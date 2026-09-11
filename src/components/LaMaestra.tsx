/* LA MAESTRA — il racconto in prima persona dell'insegnante.
   Il testo è quello inviato dal cliente il 10/09/2026, riportato
   parola per parola: non è stato riscritto né accorciato.
   ⚠️ DA_CONFERMARE: il nome dell'insegnante non è stato comunicato. */
import { MAESTRA } from '../data/contenuti'
import { Immagine } from './Immagine'
import { useLente } from './Lente'
import { useRivela } from '../lib/movimento'

export function LaMaestra() {
  const rif = useRivela<HTMLElement>({ scaglione: 0.1 })
  const { apri } = useLente()

  return (
    <section
      id="la-maestra"
      ref={rif}
      className="relative scroll-mt-24 overflow-hidden bg-carbone py-20 sm:py-28 lg:py-32"
    >
      {/* Alone tenue: profondità senza rumore. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[10%] top-1/4 h-[30rem] w-[30rem] rounded-full
                   opacity-[0.12] blur-[110px]"
        style={{ background: 'radial-gradient(circle, #69DBFF 0%, #8285CD 50%, transparent 74%)' }}
      />

      <div className="contenitore relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ── Ritratto ── */}
          <div className="lg:col-span-5">
            <button
              type="button"
              onClick={() =>
                apri({
                  tipo: 'foto',
                  sorgente: MAESTRA.foto,
                  etichetta: 'La maestra',
                  titolo: 'In sala prove',
                  testo: MAESTRA.paragrafi[0],
                  colore: '#69DBFF',
                })
              }
              data-rivela
              className="group relative block w-full overflow-hidden rounded-3xl ring-1 ring-white/12
                         transition-transform duration-500 ease-onda hover:-translate-y-1"
              aria-label="Ingrandisci la foto della maestra"
            >
              <Immagine
                chiave={MAESTRA.foto}
                alt="La maestra di Alma Latina in sala prove"
                className="aspect-[3/4] w-full transition-transform duration-[900ms] ease-onda group-hover:scale-[1.04]"
                fuoco="52% 32%"
                sizes="(max-width: 1024px) 92vw, 40vw"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(11,11,15,.72) 0%, rgba(11,11,15,.1) 34%, transparent 60%)',
                }}
              />
              <span
                className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-5 font-sans text-[0.74rem]
                           font-semibold uppercase tracking-[0.18em] text-white testo-su-video"
              >
                <span aria-hidden="true" className="h-px w-6 bg-azzurro" />
                In sala prove
              </span>
            </button>
          </div>

          {/* ── Racconto ── */}
          <div className="lg:col-span-7">
            <p data-rivela className="occhiello mb-5 flex items-center gap-3 text-azzurro">
              <span className="h-px w-8 bg-azzurro/60" />
              {MAESTRA.occhiello}
            </p>

            <h2 data-rivela className="titolo-sezione max-w-[13ch] text-panna">
              {MAESTRA.titolo}{' '}
              <em className="corsivo block text-azzurro">{MAESTRA.titoloCorsivo}</em>
            </h2>

            <div className="mt-8 space-y-5">
              {MAESTRA.paragrafi.map((p) => (
                <p
                  key={p.slice(0, 26)}
                  data-rivela
                  className="max-w-[62ch] font-sans leading-relaxed text-nebbia"
                >
                  {p}
                </p>
              ))}
            </div>

            <dl data-rivela className="mt-10 grid grid-cols-3 gap-4 border-t border-white/12 pt-7">
              {MAESTRA.tappe.map((t) => (
                <div key={t.testo}>
                  <dt className="sr-only">{t.testo}</dt>
                  <dd>
                    <span className="block font-display text-3xl font-extrabold leading-none text-panna sm:text-4xl">
                      {t.anno}
                    </span>
                    <span className="mt-2 block font-sans text-[0.74rem] leading-snug text-cenere sm:text-xs">
                      {t.testo}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
