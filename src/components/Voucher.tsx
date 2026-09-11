/* VOUCHER — «FAI SPORT GRATIS CON IL VOUCHER REGIONE CAMPANIA».
   Il titolo è quello del roll-up, alla lettera.

   Video «dance class 3»: una lezione di bambini con la maestra alla sbarra.
   È la sezione dove serviva esattamente questo, perché in call il voucher è
   stato spiegato così: strumenti «che permettono alle persone di far fare
   sport ai figli gratuitamente».
   Luminanza 161/255: troppo chiara per scriverci sopra, quindi il video sta
   in un riquadro accanto al testo, non dietro.

   ⚠️ Nessun criterio ISEE, nessuna soglia, nessuna cifra: i requisiti li
   fissano gli enti e cambiano. Il sito porta le persone a chiedere. */
import { VOUCHER, whatsappUrl } from '../data/contenuti'
import { Immagine } from './Immagine'
import { VideoSfondo } from './VideoSfondo'
import { IconaWhatsapp } from './Testata'
import { Onda } from './Onda'
import { useRivela } from '../lib/movimento'
import { useLente } from './Lente'
import { DISCIPLINE } from '../data/contenuti'

export function Voucher({ versoSezione }: { versoSezione: (id: string) => void }) {
  const rif = useRivela<HTMLElement>({ scaglione: 0.09 })
  const { apri } = useLente()
  const classica = DISCIPLINE['danza-moderna-e-classica']

  return (
    <section id="voucher" ref={rif} className="relative scroll-mt-24 overflow-hidden bg-inchiostro">
      <Onda altezza="h-14 sm:h-16" opacita={0.9} />

      <div className="contenitore py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ── Testo ── */}
          <div>
            <p data-rivela className="occhiello mb-5 flex items-center gap-3 text-giallo">
              <span className="h-px w-8 bg-giallo/60" />
              {VOUCHER.occhiello}
            </p>

            <h2 data-rivela className="titolo-sezione">
              <span className="block text-giallo">{VOUCHER.titolo}</span>
              <em className="corsivo mt-1 block text-[0.44em] leading-tight text-panna">
                {VOUCHER.sottotitolo}
              </em>
            </h2>

            <div className="mt-8 space-y-5">
              {VOUCHER.righe.map((r) => (
                <p key={r.slice(0, 22)} data-rivela className="max-w-[56ch] font-sans leading-relaxed text-nebbia">
                  {r}
                </p>
              ))}
            </div>

            <div data-rivela className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button onClick={() => versoSezione('contatti')} className="btn-giallo">
                {VOUCHER.cta}
              </button>
              <a
                href={whatsappUrl(
                  'Ciao! Vorrei sapere se posso accedere al voucher Regione Campania per i corsi di Alma Latina ASD.',
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-fantasma"
              >
                <IconaWhatsapp className="h-[19px] w-[19px]" />
                Chiedi su WhatsApp
              </a>
            </div>
          </div>

          {/* ── Media: video contenuto + una foto, mai impilati a tutta pagina ── */}
          <div className="grid grid-cols-5 gap-3 sm:gap-4">
            <figure className="group relative col-span-3 aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-white/12">
              <button
                type="button"
                onClick={() =>
                  apri({ tipo: 'video', sorgente: 'v06-dance-class-3.mp4', poster: 'v06-bambini.webp',
                         etichetta: 'Corsi per bambini', titolo: classica.nome, testo: classica.testo, colore: classica.colore })
                }
                aria-label="Ingrandisci: corso per bambini"
                className="absolute inset-0 z-20 cursor-zoom-in"
              />
              <VideoSfondo
                file="/video/v06-dance-class-3.mp4"
                poster="/poster/v06-bambini.webp"
                velatura="nessuna"
                oggetto="46% 40%"
              />
              {/* Etichetta su fascia piena: leggibile anche su questa clip chiara. */}
              <figcaption
                className="absolute inset-x-0 bottom-0 z-10 p-4 font-sans text-[0.72rem] font-semibold
                           uppercase tracking-[0.16em] text-white"
                style={{ background: 'linear-gradient(to top, rgba(11,11,15,.92), rgba(11,11,15,0))' }}
              >
                Corsi per bambini
              </figcaption>
            </figure>

            <div className="col-span-2 flex flex-col gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() =>
                  apri({ tipo: 'foto', sorgente: 'classe-bambine', etichetta: 'Corso bambini',
                         titolo: classica.nome, testo: classica.testo, colore: classica.colore })
                }
                aria-label="Ingrandisci: lezione per bambine"
                className="relative block aspect-[3/4] flex-1 overflow-hidden rounded-2xl ring-1 ring-white/12
                           transition-transform duration-500 ease-onda hover:-translate-y-1"
              >
                <Immagine
                  chiave="classe-bambine"
                  alt="Lezione di danza classica per bambine con la maestra"
                  className="h-full w-full"
                  fuoco="54% 40%"
                  sizes="(max-width: 1024px) 34vw, 20vw"
                />
              </button>
              <div
                className="rounded-2xl p-4 text-center ring-1 ring-white/12"
                style={{ background: 'linear-gradient(150deg,#EB008C22,#0B0B0F 70%)' }}
              >
                <span className="block font-display text-3xl font-extrabold leading-none text-giallo">2</span>
                <span className="mt-1.5 block font-sans text-[0.68rem] leading-snug text-nebbia">
                  voucher attivi: Regione Campania e Governo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
