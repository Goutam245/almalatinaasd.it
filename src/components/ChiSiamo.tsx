/* CHI SIAMO — video «latin dance 1»: la stessa coppia dell'hero, ma con
   l'orchestra dal vivo alle spalle. Continuità visiva con l'apertura e,
   soprattutto, il senso della sezione: da dove viene questo ballo.

   Il video sta in un riquadro chiuso, accanto al testo, mai sotto:
   con luminanza 97 e forti variazioni non è un fondo su cui scrivere. */
import { CHI_SIAMO } from '../data/contenuti'
import { Immagine } from './Immagine'
import { VideoSfondo } from './VideoSfondo'
import { useParallasse, useRivela } from '../lib/movimento'
import { useLente } from './Lente'
import { DISCIPLINE } from '../data/contenuti'

export function ChiSiamo() {
  const rif = useRivela<HTMLElement>({ scaglione: 0.1 })
  const rifPar = useParallasse<HTMLDivElement>(9)
  const { apri } = useLente()
  const latine = DISCIPLINE['danze-latine-coreografici-team']
  const classica = DISCIPLINE['danza-moderna-e-classica']
  const salsa = DISCIPLINE['salsa-e-bachata']

  return (
    <section id="chi-siamo" ref={rif} className="relative scroll-mt-24 bg-inchiostro py-20 sm:py-28 lg:py-36">
      <div className="contenitore">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ── Testo ── */}
          <div className="lg:col-span-6 xl:col-span-5">
            <p data-rivela className="occhiello mb-5 flex items-center gap-3 text-magenta">
              <span className="h-px w-8 bg-magenta/60" />
              {CHI_SIAMO.occhiello}
            </p>

            <h2 data-rivela className="titolo-sezione text-panna">
              {CHI_SIAMO.titolo}{' '}
              <em className="corsivo block text-azzurro">{CHI_SIAMO.titoloCorsivo}</em>
            </h2>

            <div className="mt-8 space-y-5">
              {CHI_SIAMO.paragrafi.map((p) => (
                <p key={p.slice(0, 24)} data-rivela className="max-w-[58ch] font-sans leading-relaxed text-nebbia">
                  {p}
                </p>
              ))}
            </div>

            <dl data-rivela className="mt-10 grid grid-cols-3 gap-4 border-t border-white/12 pt-7">
              {CHI_SIAMO.numeri.map((n) => (
                <div key={n.etichetta}>
                  <dt className="sr-only">{n.etichetta}</dt>
                  <dd>
                    <span className="block font-display text-3xl font-extrabold leading-none text-panna sm:text-4xl">
                      {n.valore}
                    </span>
                    <span className="mt-2 block font-sans text-[0.74rem] leading-snug text-cenere sm:text-xs">
                      {n.etichetta}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ── Media: video contenuto + due foto, mai un blocco solo per riga ── */}
          <div className="lg:col-span-6 xl:col-span-7">
            <div ref={rifPar} className="grid grid-cols-5 gap-3 sm:gap-4">
              {/* Video con l'orchestra: il pezzo forte della colonna. */}
              <figure className="group relative col-span-5 aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-white/12 sm:col-span-3 sm:aspect-[4/5]">
                <button
                  type="button"
                  onClick={() =>
                    apri({ tipo: 'video', sorgente: 'v10-latin-dance-1.mp4', poster: 'v10-orchestra.webp',
                           etichetta: 'Musica dal vivo', titolo: latine.nome, testo: latine.testo, colore: latine.colore })
                  }
                  aria-label="Ingrandisci: musica dal vivo"
                  className="absolute inset-0 z-20 cursor-zoom-in"
                />
                <VideoSfondo
                  file="/video/v10-latin-dance-1.mp4"
                  poster="/poster/v10-orchestra.webp"
                  velatura="nessuna"
                  oggetto="52% 46%"
                />
                <figcaption
                  className="absolute inset-x-0 bottom-0 z-10 p-4 font-sans text-[0.72rem] font-medium
                             uppercase tracking-[0.16em] text-white/95 testo-su-video"
                  style={{
                    background: 'linear-gradient(to top, rgba(11,11,15,.88), rgba(11,11,15,0))',
                  }}
                >
                  Musica dal vivo
                </figcaption>
              </figure>

              <div className="col-span-5 grid grid-cols-2 gap-3 sm:col-span-2 sm:grid-cols-1 sm:gap-4">
                <button
                  type="button"
                  onClick={() =>
                    apri({ tipo: 'foto', sorgente: 'ballerina-giro', etichetta: 'Sala grande',
                           titolo: classica.nome, testo: classica.testo, colore: classica.colore })
                  }
                  aria-label="Ingrandisci: ballerina nella sala grande"
                  className="relative block aspect-square overflow-hidden rounded-2xl ring-1 ring-white/12
                             transition-transform duration-500 ease-onda hover:-translate-y-1 sm:aspect-[4/5]"
                >
                  <Immagine
                    chiave="ballerina-giro"
                    alt="Ballerina in giro nella sala grande"
                    className="h-full w-full"
                    fuoco="46% 42%"
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
                  />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    apri({ tipo: 'foto', sorgente: 'coppia-bianconero', etichetta: 'Passo a due',
                           titolo: salsa.nome, testo: salsa.testo, colore: salsa.colore })
                  }
                  aria-label="Ingrandisci: coppia di ballerini"
                  className="relative block aspect-square overflow-hidden rounded-2xl ring-1 ring-white/12
                             transition-transform duration-500 ease-onda hover:-translate-y-1 sm:aspect-[4/3]"
                >
                  <Immagine
                    chiave="coppia-bianconero"
                    alt="Coppia di ballerini in volo, fotografia in bianco e nero"
                    className="h-full w-full"
                    fuoco="50% 46%"
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
