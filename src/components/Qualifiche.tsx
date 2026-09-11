/* QUALIFICHE — riconoscimenti e titoli.
   Ogni voce corrisponde a un attestato realmente esposto in sala e
   fotografato dal cliente: CONI/Sport e Salute, laurea in Scienze
   Motorie, diploma maestri di ballo AIMB, affiliazioni CSEN e Libertas.
   Sono fatti verificabili, non autoelogio. */
import { QUALIFICHE } from '../data/contenuti'
import { Immagine } from './Immagine'
import { useLente } from './Lente'
import { useRivela } from '../lib/movimento'

function Icona({ nome, className = 'h-5 w-5' }: { nome: string; className?: string }) {
  const c = { className, fill: 'currentColor', viewBox: '0 0 24 24', 'aria-hidden': true } as const
  if (nome === 'coni')
    return (
      <svg {...c}>
        <path d="M12 2 4 5v6c0 4.7 3.2 9.1 8 10.4 4.8-1.3 8-5.7 8-10.4V5l-8-3zm-1.2 14.3-3.5-3.5 1.4-1.4 2.1 2.1 5-5 1.4 1.4-6.4 6.4z" />
      </svg>
    )
  if (nome === 'laurea')
    return (
      <svg {...c}>
        <path d="M12 3 1 9l11 6 9-4.9V17h2V9L12 3zM5 13.2V17c0 1.7 3.1 3.5 7 3.5s7-1.8 7-3.5v-3.8l-7 3.8-7-3.8z" />
      </svg>
    )
  if (nome === 'diploma')
    return (
      <svg {...c}>
        <path d="M12 2a6 6 0 1 0 0 12A6 6 0 0 0 12 2zm0 2.2 1.3 2.7 2.9.4-2.1 2 .5 2.9-2.6-1.4-2.6 1.4.5-2.9-2.1-2 2.9-.4L12 4.2zM7 15.4V22l5-2.2 5 2.2v-6.6a7.9 7.9 0 0 1-10 0z" />
      </svg>
    )
  return (
    <svg {...c}>
      <path d="M16.5 5A3.5 3.5 0 0 0 13 8.5c0 .5.1 1 .3 1.4l-3.4 3.4a3.5 3.5 0 1 0 1.4 1.4l3.4-3.4c.4.2.9.3 1.4.3a3.5 3.5 0 0 0 0-7zM7 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm10 12a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
  )
}

export function Qualifiche() {
  const rif = useRivela<HTMLElement>({ scaglione: 0.08 })
  const { apri } = useLente()

  return (
    <section
      id="qualifiche"
      ref={rif}
      className="relative scroll-mt-24 bg-inchiostro py-20 sm:py-24 lg:py-28"
    >
      <div className="contenitore">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ── Testo + elenco ── */}
          <div className="lg:col-span-7">
            <p data-rivela className="occhiello mb-5 flex items-center gap-3 text-lime">
              <span className="h-px w-8 bg-lime/60" />
              {QUALIFICHE.occhiello}
            </p>

            <h2 data-rivela className="titolo-sezione max-w-[10ch] text-panna">
              {QUALIFICHE.titolo}{' '}
              <em className="corsivo text-lime">{QUALIFICHE.titoloCorsivo}</em>
            </h2>

            <p data-rivela className="mt-6 max-w-[56ch] font-sans leading-relaxed text-nebbia">
              {QUALIFICHE.intro}
            </p>

            <ul className="mt-9 grid gap-3 sm:grid-cols-2">
              {QUALIFICHE.voci.map((v) => (
                <li
                  key={v.titolo}
                  data-rivela
                  className="group flex gap-4 rounded-2xl border border-white/12 bg-white/[0.035] p-4
                             transition-colors duration-300 hover:border-white/28 sm:p-5"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                               transition-transform duration-500 ease-onda group-hover:scale-110"
                    style={{ background: `${v.colore}22`, color: v.colore }}
                  >
                    <Icona nome={v.icona} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-sans text-[0.96rem] font-semibold leading-snug text-panna">
                      {v.titolo}
                    </span>
                    <span className="mt-1.5 block font-sans text-[0.85rem] leading-snug text-nebbia">
                      {v.testo}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Parete degli attestati ── */}
          <div className="lg:col-span-5">
            <button
              type="button"
              data-rivela
              onClick={() =>
                apri({
                  tipo: 'foto',
                  sorgente: QUALIFICHE.foto,
                  etichetta: 'Riconoscimenti',
                  titolo: 'Gli attestati in sala',
                  testo: QUALIFICHE.intro,
                  colore: '#8CC63F',
                })
              }
              className="group relative block w-full overflow-hidden rounded-3xl ring-1 ring-white/12
                         transition-transform duration-500 ease-onda hover:-translate-y-1"
              aria-label="Ingrandisci la foto degli attestati"
            >
              <Immagine
                chiave={QUALIFICHE.foto}
                alt="Attestati e riconoscimenti esposti nella sala di Alma Latina ASD"
                className="aspect-[4/3] w-full transition-transform duration-[900ms] ease-onda group-hover:scale-[1.05]"
                fuoco="50% 46%"
                sizes="(max-width: 1024px) 92vw, 38vw"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(11,11,15,.8) 0%, rgba(11,11,15,.12) 40%, transparent 66%)',
                }}
              />
              <span className="absolute inset-x-0 bottom-0 p-5 text-left">
                <span className="block font-sans text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-white testo-su-video">
                  Appesi in sala
                </span>
                <span className="mt-1 block font-sans text-[0.82rem] text-white/85 testo-su-video">
                  Tocca per ingrandire
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
