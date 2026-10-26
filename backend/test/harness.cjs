/**
 * Runs Code.gs against a stubbed Apps Script runtime, so the backend logic can
 * be checked before it is pasted into the editor and deployed.
 *
 *   node backend/test/harness.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function makeSheet(name) {
  const data = [];
  const api = {
    name,
    _data: data,
    getLastRow: () => data.length,
    setFrozenRows: () => api,
    appendRow: (row) => { data.push(row.slice()); return api; },
    deleteRow: (row) => { data.splice(row - 1, 1); },
    deleteRows: (row, count) => { data.splice(row - 1, count); },
    getRange: (r, c, numRows = 1, numCols = 1) => ({
      getValues: () => {
        const out = [];
        for (let i = 0; i < numRows; i += 1) {
          const source = data[r - 1 + i] || [];
          const line = [];
          for (let j = 0; j < numCols; j += 1) line.push(source[c - 1 + j] === undefined ? '' : source[c - 1 + j]);
          out.push(line);
        }
        return out;
      },
      setValues: (values) => {
        values.forEach((line, i) => {
          const target = data[r - 1 + i] || (data[r - 1 + i] = []);
          line.forEach((v, j) => { target[c - 1 + j] = v; });
        });
      },
      setValue: (value) => {
        const target = data[r - 1] || (data[r - 1] = []);
        target[c - 1] = value;
      },
    }),
  };
  return api;
}

const sheets = new Map();
const book = {
  getSheetByName: (n) => sheets.get(n) || null,
  insertSheet: (n) => { const s = makeSheet(n); sheets.set(n, s); return s; },
};

const cacheStore = new Map();
const props = new Map([['PRESENTER_PIN', '1910']]);

const sandbox = {
  console,
  SpreadsheetApp: { getActiveSpreadsheet: () => book, openById: () => book },
  CacheService: {
    getScriptCache: () => ({
      get: (k) => (cacheStore.has(k) ? cacheStore.get(k) : null),
      put: (k, v) => cacheStore.set(k, v),
      removeAll: (keys) => keys.forEach((k) => cacheStore.delete(k)),
    }),
  },
  LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock: () => {} }) },
  PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => (props.has(k) ? props.get(k) : null) }) },
  Utilities: { getUuid: () => 'id-' + Math.random().toString(36).slice(2, 10) },
  ContentService: {
    MimeType: { JSON: 'json', TEXT: 'text' },
    createTextOutput: (text) => ({ text, setMimeType: () => ({ text }) }),
  },
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'Code.gs'), 'utf8'), sandbox);

const parse = (res) => JSON.parse(res.text);
const get = (params) => parse(sandbox.doGet({ parameter: params }));
const post = (body) => parse(sandbox.doPost({ postData: { contents: JSON.stringify(body) } }));

let failures = 0;
const check = (label, condition, detail) => {
  if (condition) console.log('  ok   ' + label);
  else { failures += 1; console.log('  FAIL ' + label + (detail ? ' — ' + JSON.stringify(detail) : '')); }
};

console.log('setup');
check('setup runs', sandbox.setup() === 'ready');
check('ping', get({ action: 'ping' }).ok);

console.log('\npin');
check('control rejects a wrong pin', post({ action: 'control', pin: '0000', op: 'open' }).error === 'bad pin');
check('export rejects a wrong pin', JSON.parse(sandbox.doGet({ parameter: { action: 'export', pin: 'x' } }).text).error === 'bad pin');

console.log('\nword cloud');
post({ action: 'control', pin: '1910', op: 'set', sectionId: 'wc-opposite', moduleKind: 'wordcloud', promptId: 'wc-opposite', open: true });
check('state opens', get({ action: 'state' }).data.open === true);
check('first submission accepted', post({ action: 'submit', kind: 'wordcloud', promptId: 'wc-opposite', deviceId: 'd1', text: 'Ego' }).data.accepted === true);
check('same device blocked', post({ action: 'submit', kind: 'wordcloud', promptId: 'wc-opposite', deviceId: 'd1', text: 'fear' }).data.reason === 'duplicate');
post({ action: 'submit', kind: 'wordcloud', promptId: 'wc-opposite', deviceId: 'd2', text: 'egos' });
post({ action: 'submit', kind: 'wordcloud', promptId: 'wc-opposite', deviceId: 'd3', text: '<b>fear</b>' });
post({ action: 'submit', kind: 'wordcloud', promptId: 'wc-opposite', deviceId: 'd4', text: 'caring' });
post({ action: 'submit', kind: 'wordcloud', promptId: 'wc-opposite', deviceId: 'd5', text: 'cares' });
const words = get({ action: 'results', kind: 'wordcloud' }).data.results.words;
check('variants merge (ego/egos)', words.some((w) => w.count === 2 && /ego/.test(w.word)), words);
check('care variants merge', words.some((w) => w.count === 2 && /car/.test(w.word)), words);
check('markup stripped', words.some((w) => w.word === 'fear'), words);
check('closed prompt rejects', post({ action: 'submit', kind: 'wordcloud', promptId: 'other', deviceId: 'd9', text: 'x' }).data.reason === 'closed');
check('empty text rejected', post({ action: 'submit', kind: 'wordcloud', promptId: 'wc-opposite', deviceId: 'd8', text: '   ' }).data.reason === 'empty');

console.log('\nboard');
post({ action: 'control', pin: '1910', op: 'set', sectionId: 'board-drains', moduleKind: 'board', promptId: 'board-drains', open: true });
const note = post({ action: 'submit', kind: 'board', promptId: 'board-drains', deviceId: 'b1', text: 'Being blamed for something I was never told about.', column: 'drains' });
check('note accepted and moderated', note.data.accepted === true && note.data.moderated === true);
check('bad column rejected', post({ action: 'submit', kind: 'board', promptId: 'board-drains', deviceId: 'b2', text: 'x', column: 'nope' }).data.reason === 'bad column');
post({ action: 'submit', kind: 'board', promptId: 'board-drains', deviceId: 'b3', text: 'Dr Ahmad never answers', column: 'drains' });
check('board hides pending notes', get({ action: 'results', kind: 'board' }).data.results.drains.length === 0);
const responses = sheets.get('Responses')._data;
const flaggedRow = responses.find((r) => String(r[4]).indexOf('Dr Ahmad') === 0);
check('possible name flagged', flaggedRow[8] === true, flaggedRow);
const firstId = responses.find((r) => String(r[4]).indexOf('Being blamed') === 0)[0];
post({ action: 'control', pin: '1910', op: 'moderate', id: firstId, status: 'approved', promptId: 'board-drains' });
post({ action: 'control', pin: '1910', op: 'star', id: firstId, starred: true, promptId: 'board-drains' });
const board = get({ action: 'results', kind: 'board' }).data.results;
check('approved note appears', board.drains.length === 1 && board.drains[0].starred === true, board);
check('80 char cap', (() => {
  post({ action: 'submit', kind: 'board', promptId: 'board-drains', deviceId: 'b4', text: 'x'.repeat(200), column: 'energises' });
  const row = responses.find((r) => String(r[3]) === 'b4');
  return String(row[4]).length === 80;
})());

console.log('\nmoderation queue');
check('pending needs a pin', JSON.parse(sandbox.doGet({ parameter: { action: 'pending', promptId: 'board-drains' } }).text).error === 'bad pin');
const queue = get({ action: 'pending', pin: '1910', promptId: 'board-drains' }).data.notes;
check('queue returns every note whatever its status', queue.length === 3 && queue.some((n) => n.status === 'approved') && queue.some((n) => n.status === 'pending'), queue.map((n) => n.status));
check('queue marks the flagged note', queue.some((n) => n.flagged === true && /Dr Ahmad/.test(n.text)), queue);
check('queue carries the starred note', queue.some((n) => n.starred === true), queue);

console.log('\nvote');
post({ action: 'control', pin: '1910', op: 'set', sectionId: 'vote-potassium', moduleKind: 'vote', promptId: 'sc-potassium', open: true });
['v1','v2','v3'].forEach((d) => post({ action: 'submit', kind: 'vote', promptId: 'sc-potassium', deviceId: d, option: 'C' }));
post({ action: 'submit', kind: 'vote', promptId: 'sc-potassium', deviceId: 'v4', option: 'a' });
check('duplicate vote blocked', post({ action: 'submit', kind: 'vote', promptId: 'sc-potassium', deviceId: 'v1', option: 'B' }).data.reason === 'duplicate');
check('bad option rejected', post({ action: 'submit', kind: 'vote', promptId: 'sc-potassium', deviceId: 'v5', option: 'Z' }).data.reason === 'bad option');
let tally = get({ action: 'results', kind: 'vote' }).data;
check('tally counts and lowercases options', tally.results.counts.C === 3 && tally.results.counts.A === 1, tally.results);
check('reveal is off until asked', tally.revealed === false);
post({ action: 'control', pin: '1910', op: 'reveal', revealed: true });
check('reveal flips', get({ action: 'results', kind: 'vote' }).data.revealed === true);
check('seq increases', get({ action: 'state' }).data.seq > 1);

console.log('\nreset and export');
post({ action: 'control', pin: '1910', op: 'reset', promptId: 'sc-potassium' });
check('reset clears the tally', get({ action: 'results', kind: 'vote' }).data.results.total === 0);
post({ action: 'control', pin: '1910', op: 'set', sectionId: 'board-drains', moduleKind: 'board', promptId: 'board-drains', open: true });
post({ action: 'submit', kind: 'board', promptId: 'board-drains', deviceId: 'b5', text: 'Ward round at 7, clinic at 8, nobody handed over.', column: 'drains' });
const csv = sandbox.doGet({ parameter: { action: 'export', pin: '1910' } }).text;
check('csv has both sections', csv.indexOf('# Responses') === 0 && csv.indexOf('# Votes') > 0);
check('csv quotes a cell containing commas', csv.indexOf('"Ward round at 7, clinic at 8, nobody handed over."') > 0);
check('clearAllResponses works', sandbox.clearAllResponses() === 'cleared' && sheets.get('Responses')._data.length === 1);

console.log(failures ? `\n${failures} FAILURES` : '\nall checks passed');
process.exit(failures ? 1 : 0);
