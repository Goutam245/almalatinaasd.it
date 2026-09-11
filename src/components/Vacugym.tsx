/* VACUGYM — sezione dedicata, NON una disciplina di danza.
   Correzione esplicita del cliente del 10/09/2026: il Vacugym è un
   macchinario, quindi esce dall'elenco dei corsi e prende uno spazio suo.

   Materiali: foto della macchina nella saletta, foto del roll-up e il
   PDF del volantino, tutti forniti dal cliente.

   ⚠️ Il video promozionale del Vacugym NON è stato usato: ha un prezzo
      impresso nei fotogrammi («PROMO LANCIO 100 EURO AL MESE») e il sito
      non deve mostrare prezzi da nessuna parte. */
import { VACUGYM, whatsappUrl } from '../data/contenuti'
import { Immagine } from './Immagine'
import { useLente } from './Lente'
import { IconaWhatsapp } from './Testata'
import { useRivela } from '../lib/movimento'
import { urlMedia } from '../data/archivio'

export function Vacugym({ versoSezione }: { versoSezione: (id: string) => void }) {
  const rif = useRivela<HTMLElement>({ scaglione: 0.09 })
  const { apri } = useLente()

  return (
    <section
      id="vacugym"
      ref={rif}
      className="relative scroll-mt-24 overflow-hidden bg-carbone py-20 sm:py-28 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[8%] top-[12%] h-[32rem] w-[32rem] rounded-full
                   opacity-[0.14] blur-[110px]"
        style={{ background: 'radial-gradient(circle, #00AEEF 0%, #4D56CD 52%, transparent 74%)' }}
      />

      <div className="contenitore relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ── Testo ── */}
          <div className="lg:col-span-6">
            <p data-rivela className="occhiello mb-5 flex items-center gap-3 text-ciano">
              <span className="h-px w-8 bg-ciano/60" />
              {VACUGYM.occhiello}
            </p>

            <h2 data-rivela className="titolo-sezione text-panna">
              {VACUGYM.titolo}
            </h2>

            <p data-rivela className="mt-3 font-serif text-xl italic leading-snug text-ciano sm:text-2xl">
              {VACUGYM.sottotitolo}
            </p>

            <div className="mt-7 space-y-5">
              {VACUGYM.paragrafi.map((p) => (
                <p key={p.slice(0, 24)} data-rivela className="max-w-[58ch] font-sans leading-relaxed text-nebbia">
                  {p}
                </p>
              ))}
            </div>

            <ul data-rivela className="mt-7 flex flex-wrap gap-2.5">
              {VACUGYM.punti.map((x) => (
                <li
                  key={x}
                  className="rounded-full border border-ciano/30 bg-ciano/[0.08] px-4 py-2
                             font-sans text-[0.84rem] font-medium text-panna"
                >
                  {x}
                </li>
              ))}
            </ul>

            <div data-rivela className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={whatsappUrl(
                  'Ciao! Vorrei prenotare una seduta di prova gratuita del Vacugym.',
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-verde"
              >
                <IconaWhatsapp className="h-[19px] w-[19px]" />
                {VACUGYM.cta}
              </a>
              <a
                href={urlMedia(VACUGYM.pdf)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-fantasma"
                download
              >
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
                  <path d="M12 16.5 7.5 12l1.4-1.4 2.1 2.1V4h2v8.7l2.1-2.1L16.5 12 12 16.5zM5 18h14v2H5v-2z" />
                </svg>
                {VACUGYM.pdfEtichetta}
              </a>
              <button onClick={() => versoSezione('contatti')} className="btn-fantasma">
                Chiedi informazioni
              </button>
            </div>
          </div>

          {/* ── Media: la macchina + il roll-up, mai un blocco solo per riga ── */}
          <div className="grid grid-cols-5 gap-3 sm:gap-4 lg:col-span-6">
            <button
              type="button"
              data-rivela
              onClick={() =>
                apri({
                  tipo: 'foto',
                  sorgente: VACUGYM.foto,
                  etichetta: 'Saletta attrezzi',
                  titolo: 'Il Vacugym',
                  testo: VACUGYM.paragrafi[0],
                  colore: '#00AEEF',
                })
              }
              className="group relative col-span-3 overflow-hidden rounded-2xl ring-1 ring-white/12
                         transition-transform duration-500 ease-onda hover:-translate-y-1"
              aria-label="Ingrandisci la foto del Vacugym"
            >
              <Immagine
                chiave={VACUGYM.foto}
                alt="La macchina Vacugym nella saletta attrezzi di Alma Latina"
                className="aspect-[3/4] w-full transition-transform duration-[900ms] ease-onda group-hover:scale-[1.05]"
                fuoco="58% 46%"
                sizes="(max-width: 1024px) 55vw, 28vw"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(11,11,15,.7), transparent 52%)' }}
              />
              <span className="absolute inset-x-0 bottom-0 p-4 text-left font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-white testo-su-video">
                La macchina
              </span>
            </button>

            <button
              type="button"
              data-rivela
              onClick={() =>
                apri({
                  tipo: 'foto',
                  sorgente: VACUGYM.fotoBanner,
                  etichetta: 'Vacugym',
                  titolo: 'Il volantino in sala',
                  testo: 'Il roll-up esposto all’ingresso della scuola. Il volantino completo è scaricabile in PDF.',
                  colore: '#00AEEF',
                })
              }
              className="group relative col-span-2 overflow-hidden rounded-2xl ring-1 ring-white/12
                         transition-transform duration-500 ease-onda hover:-translate-y-1"
              aria-label="Ingrandisci il volantino Vacugym"
            >
              <Immagine
                chiave={VACUGYM.fotoBanner}
                alt="Roll-up Vacugym di Alma Latina ASD"
                className="aspect-[3/4] w-full transition-transform duration-[900ms] ease-onda group-hover:scale-[1.05]"
                fuoco="50% 40%"
                sizes="(max-width: 1024px) 38vw, 19vw"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(11,11,15,.7), transparent 52%)' }}
              />
              <span className="absolute inset-x-0 bottom-0 p-4 text-left font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-white testo-su-video">
                Il volantino
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
