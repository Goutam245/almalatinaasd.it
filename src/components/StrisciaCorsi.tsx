/* Striscia scorrevole con i dieci corsi, ognuno nella sua tinta del logo.
   Scorre sempre e non si ferma mai, nemmeno col puntatore sopra.
   Animazione su solo `transform`, duplicata due volte per un ciclo continuo. */
import { CORSI } from '../data/contenuti'

export function StrisciaCorsi() {
  const doppio = [...CORSI, ...CORSI]

  return (
    <div
      className="relative flex overflow-hidden border-y border-white/10 bg-carbone py-3.5 sm:py-4"
      aria-hidden="true"
    >
      <div className="flex shrink-0 animate-scorri items-center gap-8 pr-8 sm:gap-12 sm:pr-12">
        {doppio.map((c, i) => (
          <span key={`${c.slug}-${i}`} className="flex shrink-0 items-center gap-8 sm:gap-12">
            <span className="font-display text-xl font-bold uppercase tracking-wide text-panna/85 sm:text-2xl">
              {c.nome}
            </span>
            <span
              className="h-2 w-2 shrink-0 rotate-45 rounded-[2px]"
              style={{ background: c.colore }}
            />
          </span>
        ))}
      </div>
      {/* Sfumature ai bordi: la striscia entra ed esce, non viene tagliata. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-carbone to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-carbone to-transparent sm:w-28" />
    </div>
  )
}
