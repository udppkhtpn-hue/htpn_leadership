import { Stamp } from '../collage'
import type { Framework, FrameworkModel } from '../content/types'
import { StylesModel } from './StylesModel'
import { VennModel } from './VennModel'
import { CirclesModel } from './CirclesModel'
import { MythsModel } from './MythsModel'
import { EquationModel } from './EquationModel'
import { PyramidModel } from './PyramidModel'
import { QuotesModel } from './QuotesModel'
import { CompareModel } from './CompareModel'
import { CardsModel } from './CardsModel'
import { LoopModel } from './LoopModel'

/* ---------------------------------------------------------------------------
   A framework screen is a specimen sheet: a small typewritten header, the
   model drawn large as the hero, and the source pressed into the corner. No
   claim reaches the projector without its author and year.

   A model that is specified but not yet drawn shows a visible [TODO] plate
   rather than an empty sheet, so a gap is obvious in rehearsal.
   --------------------------------------------------------------------------- */

function Model({ model, step }: { model: FrameworkModel; step: number }) {
  if (model.kind === 'styles') {
    return <StylesModel cards={model.cards} closing={model.closing} step={step} />
  }
  if (model.kind === 'venn') {
    return <VennModel left={model.left} right={model.right} overlap={model.overlap} step={step} />
  }
  if (model.kind === 'circles') {
    return <CirclesModel rings={model.rings} step={step} />
  }
  if (model.kind === 'myths') {
    return <MythsModel pairs={model.pairs} step={step} />
  }
  if (model.kind === 'equation') {
    return <EquationModel terms={model.terms} divisor={model.divisor} step={step} />
  }
  if (model.kind === 'pyramid') {
    return <PyramidModel levels={model.levels} step={step} />
  }
  if (model.kind === 'quotes') {
    return <QuotesModel quotes={model.quotes} step={step} />
  }
  if (model.kind === 'compare') {
    return (
      <CompareModel left={model.left} right={model.right} rows={model.rows} closing={model.closing} step={step} />
    )
  }
  if (model.kind === 'cards') {
    return <CardsModel cards={model.cards} step={step} />
  }
  return <LoopModel steps={model.steps} note={model.note} step={step} />
}

export function FrameworkScreen({ framework, step }: { framework: Framework; step: number }) {
  return (
    <div className="fw">
      <header className="fw__head">
        <h1 className="fw__name">{framework.name}</h1>
        {framework.definition ? <p className="fw__definition">{framework.definition}</p> : null}
        <div className="fw__rule" />
      </header>

      <div className="fw__model">
        {framework.model ? (
          <Model model={framework.model} step={step} />
        ) : (
          <p className="fw__todo">[TODO] no model for this framework yet.</p>
        )}
      </div>

      <div className="fw__foot">
        {framework.source ? <Stamp seed={`${framework.name}:source`}>{framework.source}</Stamp> : null}
      </div>
    </div>
  )
}
