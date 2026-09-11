/* CORSI — otto discipline di danza + tre voci fitness.
   Elenco aggiornato con le correzioni del cliente del 10/09/2026.
   Il Vacugym non è più qui dentro: ha una sezione tutta sua.
   🚫 Nessun prezzo: richiesta esplicita del cliente.

   A ogni corso è assegnata una tinta del logo: messe in griglia, le
   schede ricompongono l'onda colorata del marchio.

   Le descrizioni non ci sono perché non le abbiamo: in call il cliente ha
   detto che quelle del vecchio sito sono ferme a quindici anni fa e che ne
   manderà di nuove. Quando arrivano si scrivono in `contenuti.ts` e
   compaiono qui sotto da sole, senza toccare questo file. */
import { forwardRef, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CORSI, DISCIPLINE, type Famiglia } from '../data/contenuti'
import { Immagine } from './Immagine'
import { useRivela } from '../lib/movimento'
import { eMedia, urlMedia } from '../data/archivio'
import { testoSu } from '../lib/colore'
import { useLente } from './Lente'

type Filtro = 'tutti' | Famiglia

const FILTRI: Array<{ id: Filtro; etichetta: string }> = [
  { id: 'tutti', etichetta: 'Tutti' },
  { id: 'danza', etichetta: 'Danza' },
  { id: 'fitness', etichetta: 'Fitness' },
]

export function Corsi({ versoSezione }: { versoSezione: (id: string) => void }) {
  const [filtro, setFiltro] = useState<Filtro>('tutti')
  const rif = useRivela<HTMLElement>({ scaglione: 0.05 })

  const elenco = useMemo(
    () => (filtro === 'tutti' ? CORSI : CORSI.filter((c) => c.famiglia === filtro)),
    [filtro],
  )

  return (
    <section id="corsi" ref={rif} className="relative scroll-mt-24 bg-carbone py-20 sm:py-28 lg:py-32">
      <div className="contenitore">
        <div className="mb-11 flex flex-col gap-8 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="colonna-titolo">
            <p data-rivela className="occhiello mb-5 flex items-center gap-3 text-giallo">
              <span className="h-px w-8 bg-giallo/60" />
              Undici corsi
            </p>
            {/* «I nostri» resta unito su una riga, «corsi» va a capo:
                il max-width in `ch` sta sul titolo, dove `ch` vale davvero. */}
            <h2 data-rivela className="titolo-sezione max-w-[9ch] text-panna">
              <span className="whitespace-nowrap">I nostri</span>{' '}
              <em className="corsivo testo-arcobaleno not-italic">corsi</em>
            </h2>
          </div>

          <div data-rivela className="lg:max-w-[26rem] lg:text-right">
            <p className="font-sans leading-relaxed text-nebbia">
              Corsi di danza e corsi di fitness, nella stessa sala. Scegli la disciplina
              e scrivici per orari e posti liberi.
            </p>

            {/* Filtro: qualcosa da fare, non solo da guardare. */}
            <div
              role="group"
              aria-label="Filtra i corsi"
              className="mt-6 inline-flex rounded-full border border-white/15 bg-inchiostro/70 p-1.5"
            >
              {FILTRI.map((f) => {
                const attivo = filtro === f.id
                return (
                  <button
                    key={f.id}
                    onClick={() => setFiltro(f.id)}
                    aria-pressed={attivo}
                    className={`relative min-h-[44px] rounded-full px-5 font-sans text-[0.88rem] font-semibold
                                transition-colors ${attivo ? 'text-inchiostro' : 'text-nebbia hover:text-panna'}`}
                  >
                    {attivo && (
                      <motion.span
                        layoutId="pillola-filtro"
                        transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                        className="absolute inset-0 rounded-full bg-panna"
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {f.etichetta}
                      {/* Conteggio: si vede a colpo d'occhio cosa sta filtrando. */}
                      <span
                        className={`rounded-full px-1.5 py-px text-[0.66rem] tabular-nums ${
                          attivo ? 'bg-inchiostro/15 text-inchiostro' : 'bg-white/10 text-cenere'
                        }`}
                      >
                        {f.id === 'tutti' ? CORSI.length : CORSI.filter((c) => c.famiglia === f.id).length}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Griglia: due schede per riga già dal telefono — mai un blocco solo
            per riga, mai un'immagine gigante sotto l'altra.

            Niente `layout` sull'elenco e niente `mode="popLayout"`: su una
            griglia CSS quella combinazione lasciava le schede in uscita
            montate per sempre, e il filtro non filtrava nulla. Con
            AnimatePresence in modalità normale le schede escono davvero;
            il `layout` sulla singola scheda basta a far scivolare le altre
            al loro posto. */}
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
          <AnimatePresence initial={false}>
            {elenco.map((c, i) => (
              <SchedaCorso key={c.slug} corso={c} indice={i} />
            ))}
          </AnimatePresence>
        </ul>

        <p data-rivela className="mt-9 text-center font-sans text-sm text-cenere">
          Orari, livelli e posti disponibili cambiano durante l’anno.{' '}
          <button
            onClick={() => versoSezione('contatti')}
            className="font-semibold text-azzurro underline decoration-azzurro/40 underline-offset-4 hover:decoration-azzurro"
          >
            Scrivici per sapere quando si balla
          </button>
          .
        </p>
      </div>
    </section>
  )
}

const SchedaCorso = forwardRef<
  HTMLLIElement,
  { corso: (typeof CORSI)[number]; indice: number }
>(function SchedaCorso({ corso, indice }, rifEsterno) {
  const rifVideo = useRef<HTMLVideoElement>(null)
  const [suHover, setSuHover] = useState(false)
  const { apri } = useLente()
  const scheda = DISCIPLINE[corso.slug]

  const entra = () => {
    setSuHover(true)
    const v = rifVideo.current
    if (v) {
      v.currentTime = 0
      const p = v.play()
      if (p?.catch) p.catch(() => {})
    }
  }
  const esce = () => {
    setSuHover(false)
    rifVideo.current?.pause()
  }

  return (
    <motion.li
      ref={rifEsterno}
      layout="position"
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.16, ease: 'easeIn' } }}
      transition={{ duration: 0.38, delay: Math.min(indice, 7) * 0.028, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <button
        onClick={() =>
          apri({
            tipo: corso.video ? 'video' : 'foto',
            sorgente: corso.video ?? corso.immagine,
            poster: corso.poster,
            etichetta: corso.famiglia === 'danza' ? 'Danza' : 'Fitness',
            titolo: corso.nome,
            testo: scheda?.testo,
            colore: corso.colore,
          })
        }
        onMouseEnter={entra}
        onMouseLeave={esce}
        onFocus={entra}
        onBlur={esce}
        className="relative block w-full overflow-hidden rounded-2xl text-left ring-1 ring-white/12
                   transition-transform duration-500 ease-onda hover:-translate-y-1.5
                   focus-visible:-translate-y-1.5"
        aria-label={`${corso.nome} — apri la scheda`}
      >
        <div className="relative aspect-[3/4] w-full">
          {corso.immagine ? (
            <Immagine
              chiave={corso.immagine}
              alt={corso.nome}
              className="h-full w-full transition-transform duration-[900ms] ease-onda group-hover:scale-[1.07]"
              fuoco={corso.fuoco}
              sizes="(max-width: 640px) 48vw, (max-width: 1024px) 32vw, 19vw"
            />
          ) : (
            /* Vacugym: nessuna foto della saletta attrezzi fra i materiali
               ricevuti. Fondo di marca al posto di un buco. */
            <div
              className="h-full w-full"
              style={{
                background: `radial-gradient(120% 90% at 30% 20%, ${corso.colore}44 0%, #131319 62%, #0B0B0F 100%)`,
              }}
            >
              <svg viewBox="0 0 100 100" className="h-full w-full opacity-25" aria-hidden="true">
                {[24, 38, 52, 66, 80].map((y, k) => (
                  <path
                    key={y}
                    d={`M -10 ${y} Q 25 ${y - 9} 50 ${y} T 110 ${y}`}
                    fill="none"
                    stroke={corso.colore}
                    strokeWidth={2.2 - k * 0.18}
                    strokeLinecap="round"
                  />
                ))}
              </svg>
            </div>
          )}

          {/* Video breve al passaggio del mouse, dove esiste. */}
          {corso.video && (
            <video
              ref={rifVideo}
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              poster={eMedia(corso.poster ?? '') ? urlMedia(corso.poster!) : `/poster/${corso.poster}`}
              aria-hidden="true"
              tabIndex={-1}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                suHover ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <source
                src={
                  eMedia(corso.video!)
                    ? urlMedia(corso.video!)
                    : corso.video!.includes('/')
                      ? `/${corso.video}`
                      : `/video/${corso.video}`
                }
                type="video/mp4"
              />
            </video>
          )}

          {/* Velatura fissa: il nome del corso resta leggibile su ogni foto,
              anche sulle più chiare. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(11,11,15,.96) 0%, rgba(11,11,15,.72) 28%, rgba(11,11,15,.24) 58%, rgba(11,11,15,.34) 100%)',
            }}
          />
          {/* Lampo di colore del corso al passaggio del mouse. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: `linear-gradient(to top, ${corso.colore} 0%, transparent 68%)` }}
          />

          {/* Barretta del colore assegnato. */}
          <span
            aria-hidden="true"
            className="absolute left-4 top-4 h-1 w-8 rounded-full transition-all duration-500 group-hover:w-14"
            style={{ background: corso.colore }}
          />

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            {/* Etichetta piena nella tinta del corso, con testo scelto
                automaticamente fra inchiostro e bianco: sul giallo era
                illeggibile a 2.8:1, ora nessuna scende sotto 6:1. */}
            <span
              className="mb-2 inline-block rounded-full px-2.5 py-1 font-sans text-[0.62rem] font-bold uppercase tracking-[0.14em]"
              style={{ background: corso.colore, color: testoSu(corso.colore) }}
            >
              {corso.famiglia === 'danza' ? 'Danza' : 'Fitness'}
            </span>
            <h3 className="font-display text-[1.32rem] font-bold uppercase leading-[0.98] text-panna testo-su-video sm:text-2xl">
              {corso.nome}
            </h3>
            {corso.nota && (
              <p className="mt-1.5 font-sans text-[0.74rem] leading-snug text-white/80 testo-su-video">
                {corso.nota}
              </p>
            )}
            {/* Le descrizioni compaiono qui appena il cliente le manda. */}
            {corso.descrizione && (
              <p className="mt-2 font-sans text-[0.78rem] leading-snug text-white/75">{corso.descrizione}</p>
            )}

            {/* Su schermi touch non esiste il passaggio del mouse: lì
                l'invito resta sempre visibile, invece di non comparire mai. */}
            <span
              className="mt-3 inline-flex items-center gap-1.5 font-sans text-[0.76rem] font-semibold
                         transition-all duration-300
                         [@media(hover:hover)]:opacity-0
                         group-hover:opacity-100 group-focus-visible:opacity-100"
              style={{ color: corso.colore }}
            >
              Scopri la disciplina
              <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </button>
    </motion.li>
  )
})
