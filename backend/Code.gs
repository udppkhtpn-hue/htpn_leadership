/**
 * HTPN Lead Live — backend.
 *
 * One Google Sheet, one Apps Script web app. Deployed as:
 *   Execute as:      Me
 *   Who has access:  Anyone
 *
 * Nothing here identifies a person. deviceId is a random UUID generated in the
 * browser; no names, emails, phone numbers, IC numbers or clinical details are
 * accepted or stored.
 *
 * Apps Script allows roughly 30 simultaneous executions, so every read is
 * served from CacheService and only falls through to the sheet on a miss.
 *
 * See SETUP.md for the manual deployment steps.
 */

// ---------------------------------------------------------------- constants

var TAB = {
  state: 'State',
  responses: 'Responses',
  votes: 'Votes',
  log: 'Log',
};

var HEADERS = {
  State: ['key', 'value'],
  Responses: ['id', 'ts', 'promptId', 'deviceId', 'text', 'column', 'status', 'starred', 'flagged'],
  Votes: ['ts', 'scenarioId', 'deviceId', 'option'],
  Log: ['ts', 'action', 'detail'],
};

var STATE_KEYS = ['sectionId', 'moduleKind', 'promptId', 'open', 'revealed', 'frozen', 'seq'];

var LIMITS = {
  wordcloud: 30,
  board: 80,
  cacheSeconds: 30,
  lockMs: 8000,
  maxWords: 60,
  maxNotes: 120,
};

var COLUMNS = ['drains', 'energises'];
var OPTIONS = ['A', 'B', 'C', 'D'];

// ------------------------------------------------------------------ helpers

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

var ok_ = function (data) {
  return json_({ ok: true, data: data });
};

var fail_ = function (error) {
  return json_({ ok: false, error: error });
};

function book_() {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  return id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
}

function sheet_(name) {
  var book = book_();
  var sheet = book.getSheetByName(name);
  if (!sheet) {
    sheet = book.insertSheet(name);
    sheet.appendRow(HEADERS[name]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function cache_() {
  return CacheService.getScriptCache();
}

/** Rows below the header, as arrays. */
function rows_(name) {
  var sheet = sheet_(name);
  var last = sheet.getLastRow();
  if (last < 2) return [];
  return sheet.getRange(2, 1, last - 1, HEADERS[name].length).getValues();
}

function colIndex_(name, column) {
  return HEADERS[name].indexOf(column);
}

/**
 * Strip anything that could be markup, collapse whitespace, trim, and cap the
 * length. Everything the audience sends goes through here.
 */
function clean_(value, maxChars) {
  var text = String(value == null ? '' : value);
  text = text.replace(/<[^>]*>/g, ' ');
  text = text.replace(/[<>]/g, ' ');
  text = text.replace(/[\u0000-\u001f\u007f]/g, ' ');
  text = text.replace(/\s+/g, ' ').trim();
  if (text.length > maxChars) text = text.slice(0, maxChars);
  return text;
}

/**
 * Flags a note that might name somebody: "Dr " anywhere, or two capitalised
 * words in a row. Flagged notes still go to the moderation queue — the flag
 * only tells the presenter to look twice.
 */
function looksLikeAName_(text) {
  if (/\bdr\.?\s/i.test(text)) return true;
  if (/\bdato|\bdatuk|\bprof\.?\s/i.test(text)) return true;
  return /\b[A-Z][a-z]{1,}\s+[A-Z][a-z]{1,}\b/.test(text);
}

function uuid_() {
  return Utilities.getUuid();
}

function log_(action, detail) {
  try {
    sheet_(TAB.log).appendRow([new Date(), action, detail || '']);
  } catch (error) {
    // Logging must never break a submission.
  }
}

function checkPin_(pin) {
  var expected = PropertiesService.getScriptProperties().getProperty('PRESENTER_PIN');
  if (!expected) return false;
  var given = String(pin == null ? '' : pin);
  if (given.length !== expected.length) return false;
  var diff = 0;
  for (var i = 0; i < expected.length; i += 1) {
    diff |= given.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

// -------------------------------------------------------------------- state

function readStateFromSheet_() {
  var state = {
    sectionId: '',
    moduleKind: '',
    promptId: '',
    open: false,
    revealed: false,
    frozen: false,
    seq: 0,
  };
  rows_(TAB.state).forEach(function (row) {
    var key = String(row[0]);
    if (STATE_KEYS.indexOf(key) === -1) return;
    var value = row[1];
    if (key === 'open' || key === 'revealed' || key === 'frozen') {
      state[key] = value === true || value === 'TRUE' || value === 'true';
    } else if (key === 'seq') {
      state.seq = Number(value) || 0;
    } else {
      state[key] = String(value == null ? '' : value);
    }
  });
  return state;
}

function getState_() {
  var cached = cache_().get('state');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (error) {
      // fall through to the sheet
    }
  }
  var state = readStateFromSheet_();
  cache_().put('state', JSON.stringify(state), LIMITS.cacheSeconds);
  return state;
}

function writeState_(patch) {
  var sheet = sheet_(TAB.state);
  var state = readStateFromSheet_();
  Object.keys(patch).forEach(function (key) {
    if (STATE_KEYS.indexOf(key) !== -1) state[key] = patch[key];
  });
  state.seq = (Number(state.seq) || 0) + 1;

  var values = STATE_KEYS.map(function (key) {
    return [key, state[key]];
  });
  values.push(['updatedAt', new Date().toISOString()]);

  sheet.getRange(2, 1, values.length, 2).setValues(values);
  if (sheet.getLastRow() > values.length + 1) {
    sheet.deleteRows(values.length + 2, sheet.getLastRow() - values.length - 1);
  }

  cache_().put('state', JSON.stringify(state), LIMITS.cacheSeconds);
  return state;
}

// ------------------------------------------------------------------ results

/**
 * Merge simple variants so "care", "cares" and "caring" land on one word.
 * Deliberately crude: it only touches English suffixes and never merges two
 * words of three letters or fewer.
 */
function normaliseWord_(raw) {
  var word = String(raw || '').toLowerCase().trim();
  word = word.replace(/[.,!?;:"'`]+$/g, '').replace(/^[.,!?;:"'`]+/g, '');
  if (word.length <= 3) return word;
  var stem = word
    .replace(/ies$/, 'y')
    .replace(/ing$/, '')
    .replace(/edness$/, '')
    .replace(/ness$/, '')
    .replace(/ed$/, '')
    .replace(/es$/, '')
    .replace(/s$/, '');
  if (stem.length < 3) return word;
  return stem;
}

function buildWordResults_(promptId) {
  var idText = colIndex_(TAB.responses, 'text');
  var idPrompt = colIndex_(TAB.responses, 'promptId');
  var idStatus = colIndex_(TAB.responses, 'status');

  var groups = {};
  rows_(TAB.responses).forEach(function (row) {
    if (String(row[idPrompt]) !== promptId) return;
    if (String(row[idStatus]) === 'hidden') return;
    var text = String(row[idText] || '').trim();
    if (!text) return;
    var key = normaliseWord_(text);
    if (!key) return;
    if (!groups[key]) groups[key] = { count: 0, surfaces: {} };
    groups[key].count += 1;
    var surface = text.toLowerCase();
    groups[key].surfaces[surface] = (groups[key].surfaces[surface] || 0) + 1;
  });

  var words = Object.keys(groups).map(function (key) {
    var group = groups[key];
    // Show the spelling people actually typed most often, not the stem.
    var best = key;
    var bestCount = -1;
    Object.keys(group.surfaces).forEach(function (surface) {
      if (group.surfaces[surface] > bestCount) {
        bestCount = group.surfaces[surface];
        best = surface;
      }
    });
    return { word: best, count: group.count };
  });

  words.sort(function (a, b) {
    return b.count - a.count;
  });
  return words.slice(0, LIMITS.maxWords);
}

function buildBoardResults_(promptId) {
  var idId = colIndex_(TAB.responses, 'id');
  var idText = colIndex_(TAB.responses, 'text');
  var idPrompt = colIndex_(TAB.responses, 'promptId');
  var idColumn = colIndex_(TAB.responses, 'column');
  var idStatus = colIndex_(TAB.responses, 'status');
  var idStarred = colIndex_(TAB.responses, 'starred');

  var board = { drains: [], energises: [] };
  rows_(TAB.responses).forEach(function (row) {
    if (String(row[idPrompt]) !== promptId) return;
    if (String(row[idStatus]) !== 'approved') return;
    var column = String(row[idColumn]);
    if (COLUMNS.indexOf(column) === -1) return;
    board[column].push({
      id: String(row[idId]),
      text: String(row[idText]),
      starred: row[idStarred] === true || String(row[idStarred]) === 'TRUE',
    });
  });

  COLUMNS.forEach(function (column) {
    // Starred notes first so the projector can enlarge them.
    board[column].sort(function (a, b) {
      return (b.starred ? 1 : 0) - (a.starred ? 1 : 0);
    });
    board[column] = board[column].slice(0, LIMITS.maxNotes);
  });
  return board;
}

function buildVoteResults_(scenarioId) {
  var counts = { A: 0, B: 0, C: 0, D: 0 };
  var total = 0;
  rows_(TAB.votes).forEach(function (row) {
    if (String(row[1]) !== scenarioId) return;
    var option = String(row[3]);
    if (OPTIONS.indexOf(option) === -1) return;
    counts[option] += 1;
    total += 1;
  });
  return { counts: counts, total: total };
}

/** Every note for one prompt, for the presenter's moderation queue. */
function pendingNotes_(promptId) {
  var idId = colIndex_(TAB.responses, 'id');
  var idTs = colIndex_(TAB.responses, 'ts');
  var idText = colIndex_(TAB.responses, 'text');
  var idPrompt = colIndex_(TAB.responses, 'promptId');
  var idColumn = colIndex_(TAB.responses, 'column');
  var idStatus = colIndex_(TAB.responses, 'status');
  var idStarred = colIndex_(TAB.responses, 'starred');
  var idFlagged = colIndex_(TAB.responses, 'flagged');

  var notes = [];
  rows_(TAB.responses).forEach(function (row) {
    if (String(row[idPrompt]) !== promptId) return;
    notes.push({
      id: String(row[idId]),
      ts: row[idTs] ? new Date(row[idTs]).getTime() : 0,
      text: String(row[idText]),
      column: String(row[idColumn]),
      status: String(row[idStatus]),
      starred: row[idStarred] === true || String(row[idStarred]) === 'TRUE',
      flagged: row[idFlagged] === true || String(row[idFlagged]) === 'TRUE',
    });
  });

  // Newest first: the queue is worked from the top during the talk.
  notes.sort(function (a, b) {
    return b.ts - a.ts;
  });
  return notes.slice(0, LIMITS.maxNotes);
}

function getResults_(promptId, kind) {
  if (!promptId) return null;
  var key = 'results:' + kind + ':' + promptId;
  var cached = cache_().get(key);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (error) {
      // fall through
    }
  }
  var data;
  if (kind === 'vote') data = buildVoteResults_(promptId);
  else if (kind === 'board') data = buildBoardResults_(promptId);
  else data = { words: buildWordResults_(promptId) };

  cache_().put(key, JSON.stringify(data), LIMITS.cacheSeconds);
  return data;
}

function invalidateResults_(promptId) {
  cache_().removeAll([
    'results:wordcloud:' + promptId,
    'results:board:' + promptId,
    'results:vote:' + promptId,
  ]);
}

// ------------------------------------------------------------------ submits

function alreadySubmitted_(promptId, deviceId, isVote) {
  if (isVote) {
    var votes = rows_(TAB.votes);
    for (var i = 0; i < votes.length; i += 1) {
      if (String(votes[i][1]) === promptId && String(votes[i][2]) === deviceId) return true;
    }
    return false;
  }
  var idPrompt = colIndex_(TAB.responses, 'promptId');
  var idDevice = colIndex_(TAB.responses, 'deviceId');
  var responses = rows_(TAB.responses);
  for (var j = 0; j < responses.length; j += 1) {
    if (
      String(responses[j][idPrompt]) === promptId &&
      String(responses[j][idDevice]) === deviceId
    ) {
      return true;
    }
  }
  return false;
}

function submit_(body) {
  var promptId = clean_(body.promptId, 64);
  var deviceId = clean_(body.deviceId, 64);
  var kind = clean_(body.kind, 16); // wordcloud | board | vote

  if (!promptId || !deviceId) return fail_('missing promptId or deviceId');

  var state = getState_();
  if (!state.open || state.promptId !== promptId) {
    return ok_({ accepted: false, reason: 'closed' });
  }

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(LIMITS.lockMs)) return fail_('busy');

  try {
    var isVote = kind === 'vote';
    if (alreadySubmitted_(promptId, deviceId, isVote)) {
      return ok_({ accepted: false, reason: 'duplicate' });
    }

    if (isVote) {
      var option = clean_(body.option, 1).toUpperCase();
      if (OPTIONS.indexOf(option) === -1) return ok_({ accepted: false, reason: 'bad option' });
      sheet_(TAB.votes).appendRow([new Date(), promptId, deviceId, option]);
      invalidateResults_(promptId);
      return ok_({ accepted: true });
    }

    var isBoard = kind === 'board';
    var text = clean_(body.text, isBoard ? LIMITS.board : LIMITS.wordcloud);
    if (!text) return ok_({ accepted: false, reason: 'empty' });

    var column = '';
    if (isBoard) {
      column = clean_(body.column, 16);
      if (COLUMNS.indexOf(column) === -1) return ok_({ accepted: false, reason: 'bad column' });
    }

    // Word cloud entries go straight to the screen; board notes wait for the
    // presenter to approve them.
    var status = isBoard ? 'pending' : 'approved';
    var flagged = isBoard ? looksLikeAName_(text) : false;

    sheet_(TAB.responses).appendRow([
      uuid_(),
      new Date(),
      promptId,
      deviceId,
      text,
      column,
      status,
      false,
      flagged,
    ]);
    invalidateResults_(promptId);
    return ok_({ accepted: true, moderated: isBoard });
  } finally {
    lock.releaseLock();
  }
}

// ------------------------------------------------------------------ control

function findRowById_(id) {
  var idId = colIndex_(TAB.responses, 'id');
  var responses = rows_(TAB.responses);
  for (var i = 0; i < responses.length; i += 1) {
    if (String(responses[i][idId]) === id) return i + 2; // 1-based, past header
  }
  return 0;
}

function control_(body) {
  if (!checkPin_(body.pin)) return fail_('bad pin');

  var op = clean_(body.op, 24);
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(LIMITS.lockMs)) return fail_('busy');

  try {
    switch (op) {
      case 'set': {
        var state = writeState_({
          sectionId: clean_(body.sectionId, 64),
          moduleKind: clean_(body.moduleKind, 16),
          promptId: clean_(body.promptId, 64),
          open: body.open === true,
          revealed: false,
          frozen: false,
        });
        log_('set', state.sectionId + ' / ' + state.promptId);
        return ok_(state);
      }
      case 'open':
        return ok_(writeState_({ open: true }));
      case 'close':
        return ok_(writeState_({ open: false }));
      case 'reveal':
        return ok_(writeState_({ revealed: body.revealed !== false }));
      case 'freeze':
        return ok_(writeState_({ frozen: body.frozen !== false }));

      case 'moderate': {
        var row = findRowById_(clean_(body.id, 64));
        if (!row) return fail_('unknown id');
        var status = clean_(body.status, 16);
        if (['pending', 'approved', 'hidden'].indexOf(status) === -1) return fail_('bad status');
        sheet_(TAB.responses)
          .getRange(row, colIndex_(TAB.responses, 'status') + 1)
          .setValue(status);
        invalidateResults_(clean_(body.promptId, 64));
        return ok_({ id: body.id, status: status });
      }

      case 'star': {
        var starRow = findRowById_(clean_(body.id, 64));
        if (!starRow) return fail_('unknown id');
        sheet_(TAB.responses)
          .getRange(starRow, colIndex_(TAB.responses, 'starred') + 1)
          .setValue(body.starred === true);
        invalidateResults_(clean_(body.promptId, 64));
        return ok_({ id: body.id, starred: body.starred === true });
      }

      case 'reset': {
        var promptId = clean_(body.promptId, 64);
        if (!promptId) return fail_('missing promptId');
        resetPrompt_(promptId);
        invalidateResults_(promptId);
        log_('reset', promptId);
        return ok_({ promptId: promptId, reset: true });
      }

      default:
        return fail_('unknown op');
    }
  } finally {
    lock.releaseLock();
  }
}

/** Deletes every response and vote for one prompt, bottom up. */
function resetPrompt_(promptId) {
  var responses = sheet_(TAB.responses);
  var idPrompt = colIndex_(TAB.responses, 'promptId');
  var responseRows = rows_(TAB.responses);
  for (var i = responseRows.length - 1; i >= 0; i -= 1) {
    if (String(responseRows[i][idPrompt]) === promptId) responses.deleteRow(i + 2);
  }
  var votes = sheet_(TAB.votes);
  var voteRows = rows_(TAB.votes);
  for (var j = voteRows.length - 1; j >= 0; j -= 1) {
    if (String(voteRows[j][1]) === promptId) votes.deleteRow(j + 2);
  }
}

// ------------------------------------------------------------------- export

function csvCell_(value) {
  var text = String(value == null ? '' : value);
  if (/[",\n]/.test(text)) return '"' + text.replace(/"/g, '""') + '"';
  return text;
}

function csvSection_(title, headers, rows) {
  var lines = ['# ' + title, headers.map(csvCell_).join(',')];
  rows.forEach(function (row) {
    lines.push(row.map(csvCell_).join(','));
  });
  lines.push('');
  return lines.join('\n');
}

function exportCsv_(pin) {
  if (!checkPin_(pin)) return fail_('bad pin');
  var csv =
    csvSection_('Responses', HEADERS.Responses, rows_(TAB.responses)) +
    '\n' +
    csvSection_('Votes', HEADERS.Votes, rows_(TAB.votes));
  return ContentService.createTextOutput(csv).setMimeType(ContentService.MimeType.TEXT);
}

// ------------------------------------------------------------------- routes

function doGet(e) {
  var params = (e && e.parameter) || {};
  var action = params.action || 'ping';

  try {
    switch (action) {
      case 'ping':
        return ok_({ ts: Date.now() });

      case 'state':
        return ok_(getState_());

      case 'results': {
        var state = getState_();
        var promptId = params.promptId || state.promptId;
        var kind = params.kind || state.moduleKind || 'wordcloud';
        if (!promptId) return ok_({ promptId: '', kind: kind, results: null, seq: state.seq });
        return ok_({
          promptId: promptId,
          kind: kind,
          seq: state.seq,
          revealed: state.revealed,
          results: getResults_(promptId, kind),
        });
      }

      case 'pending': {
        if (!checkPin_(params.pin)) return fail_('bad pin');
        var promptForQueue = params.promptId || getState_().promptId;
        if (!promptForQueue) return ok_({ notes: [] });
        return ok_({ notes: pendingNotes_(promptForQueue) });
      }

      case 'export':
        return exportCsv_(params.pin);

      default:
        return fail_('unknown action');
    }
  } catch (error) {
    return fail_(String(error));
  }
}

function doPost(e) {
  var body = {};
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (error) {
    return fail_('bad json');
  }

  try {
    var action = body.action;
    if (action === 'submit') return submit_(body);
    if (action === 'control') return control_(body);
    return fail_('unknown action');
  } catch (error) {
    return fail_(String(error));
  }
}

// -------------------------------------------------------------------- setup

/**
 * Run once from the Apps Script editor, before deploying: creates the tabs,
 * writes the headers and seeds State. Safe to run again — it only fills in
 * what is missing.
 */
function setup() {
  Object.keys(HEADERS).forEach(function (name) {
    var sheet = sheet_(name);
    var header = HEADERS[name];
    var current = sheet.getRange(1, 1, 1, header.length).getValues()[0];
    var needsHeader = header.some(function (label, index) {
      return String(current[index]) !== label;
    });
    if (needsHeader) {
      sheet.getRange(1, 1, 1, header.length).setValues([header]);
      sheet.setFrozenRows(1);
    }
  });

  var state = sheet_(TAB.state);
  if (state.getLastRow() < 2) {
    writeState_({ sectionId: '', moduleKind: '', promptId: '', open: false });
  }

  var properties = PropertiesService.getScriptProperties();
  if (!properties.getProperty('PRESENTER_PIN')) {
    throw new Error('Set PRESENTER_PIN in Project Settings > Script Properties, then run setup again.');
  }
  return 'ready';
}

/** Clears every response and vote. Run by hand after a rehearsal. */
function clearAllResponses() {
  var responses = sheet_(TAB.responses);
  if (responses.getLastRow() > 1) {
    responses.deleteRows(2, responses.getLastRow() - 1);
  }
  var votes = sheet_(TAB.votes);
  if (votes.getLastRow() > 1) {
    votes.deleteRows(2, votes.getLastRow() - 1);
  }
  cache_().removeAll(['state']);
  log_('clearAllResponses', '');
  return 'cleared';
}
