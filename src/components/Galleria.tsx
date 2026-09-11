/* GALLERIA — griglia mista foto/video.
   I quattro video qui dentro sono quelli che non reggevano un titolo sopra
   (v05 luminanza 165, v07 150, v11 con contrasto interno 92) ma che come
   immagine in movimento valgono: qui non ci scrive nulla sopra, quindi
   funzionano al meglio.
   Sempre almeno due elementi per riga, anche da telefono. */
import { useEffect, useRef } from 'react'
import { ASPETTATIVE, DISCIPLINE, GALLERIA } from '../data/contenuti'
import { Immagine } from './Immagine'
import { useRivela } from '../lib/movimento'
import { eMedia, urlMedia } from '../data/archivio'
import { useLente } from './Lente'

export function Galleria() {
  const rif = useRivela<HTMLElement>({ scaglione: 0.04 })
  const { apri } = useLente()

  /** Trasforma una voce della griglia in una scheda per la lente.
   *  Titolo e testo della singola foto, quando ci sono, vincono sulla
   *  scheda generica della disciplina: così ogni scatto racconta sé stesso. */
  const mostra = (i: number) => {
    const g = GALLERIA[i]
    const d = DISCIPLINE[g.disciplina]
    apri({
      tipo: g.tipo,
      sorgente: g.tipo === 'video' ? (g.video as string) : g.chiave,
      poster: g.poster,
      etichetta: g.didascalia,
      titolo: g.titolo ?? d?.nome ?? g.didascalia,
      testo: g.testo ?? d?.testo,
      colore: d?.colore,
    })
  }


  return (
    <section id="galleria" ref={rif} className="relative scroll-mt-24 bg-carbone py-20 sm:py-28 lg:py-32">
      <div className="contenitore">
        {/* Intestazione a due colonne: a sinistra il titolo, a destra
            «Cosa aspettarti». Prima la metà destra restava vuota e la
            sezione sembrava incompiuta. */}
        <div className="mb-10 grid gap-9 lg:mb-14 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-5">
            <p data-rivela className="occhiello mb-5 flex items-center gap-3 text-ciano">
              <span className="h-px w-8 bg-ciano/60" />
              Galleria
            </p>
            <h2 data-rivela className="titolo-sezione max-w-[11ch] text-panna">
              <span className="whitespace-nowrap">Com’è</span>{' '}
              <em className="corsivo text-rosa">una lezione</em>
            </h2>
          </div>

          <div className="lg:col-span-7">
            <p data-rivela className="max-w-[54ch] font-sans leading-relaxed text-nebbia">
              {ASPETTATIVE.testo}
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {ASPETTATIVE.voci.map((v) => (
                <li
                  key={v.titolo}
                  data-rivela
                  className="group rounded-2xl border border-white/12 bg-inchiostro/70 p-4
                             transition-colors duration-300 hover:border-white/28"
                >
                  <span
                    aria-hidden="true"
                    className="mb-3 flex h-9 w-9 items-center justify-center rounded-full transition-transform
                               duration-500 ease-onda group-hover:scale-110"
                    style={{ background: `${v.colore}22`, color: v.colore }}
                  >
                    <IconaAspettativa nome={v.icona} />
                  </span>
                  <span className="block font-sans text-[0.92rem] font-semibold leading-snug text-panna">
                    {v.titolo}
                  </span>
                  <span className="mt-1.5 block font-sans text-[0.82rem] leading-snug text-nebbia">
                    {v.testo}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul className="grid auto-rows-[152px] grid-cols-2 gap-3 sm:auto-rows-[190px] sm:gap-4 lg:grid-cols-4 lg:auto-rows-[215px]">
          {GALLERIA.map((g, i) => (
            <li key={g.chiave + i} data-rivela className={g.span ?? ''}>
              <button
                onClick={() => mostra(i)}
                className="group relative block h-full w-full overflow-hidden rounded-2xl
                           ring-1 ring-white/10 transition-transform duration-500 ease-onda
                           hover:-translate-y-1 hover:ring-white/30 focus-visible:-translate-y-1"
                aria-label={`Ingrandisci: ${g.didascalia}`}
              >
                {/* I video del cliente stanno in /cliente, quelli di
                    repertorio in /video: la chiave porta già il prefisso. */}
                {g.tipo === 'video' ? (
                  <RiquadroVideo
                    file={
                      eMedia(g.video!)
                        ? urlMedia(g.video!)
                        : g.video!.includes('/')
                          ? `/${g.video}`
                          : `/video/${g.video}`
                    }
                    poster={eMedia(g.poster ?? '') ? urlMedia(g.poster!) : `/poster/${g.poster}`}
                  />
                ) : (
                  <Immagine
                    chiave={g.chiave}
                    alt={g.didascalia}
                    className="h-full w-full transition-transform duration-[900ms] ease-onda group-hover:scale-[1.06]"
                    sizes="(max-width: 640px) 48vw, (max-width: 1024px) 33vw, 25vw"
                  />
                )}

                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-95"
                  style={{
                    background: 'linear-gradient(to top, rgba(11,11,15,.9) 0%, rgba(11,11,15,.1) 46%, transparent 72%)',
                  }}
                />

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3.5">
                  <span className="font-sans text-[0.76rem] font-semibold text-white testo-su-video sm:text-[0.82rem]">
                    {g.didascalia}
                  </span>
                  {g.tipo === 'video' && (
                    <span
                      aria-hidden="true"
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                    >
                      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 translate-x-[1px] fill-white">
                        <path d="M2 1l8 5-8 5z" />
                      </svg>
                    </span>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

    </section>
  )
}

/** Icone di «Cosa aspettarti». Tratto pieno, nessuna dipendenza esterna. */
function IconaAspettativa({ nome }: { nome: string }) {
  const comune = { className: 'h-[18px] w-[18px]', fill: 'currentColor', 'aria-hidden': true } as const
  if (nome === 'prova')
    return (
      <svg viewBox="0 0 24 24" {...comune}>
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.1 14.2-3.6-3.6 1.4-1.4 2.2 2.2 5-5 1.4 1.4-6.4 6.4z" />
      </svg>
    )
  if (nome === 'gruppo')
    return (
      <svg viewBox="0 0 24 24" {...comune}>
        <path d="M8 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 13c-3 0-6 1.5-6 4.2V20h12v-2.8C14 14.5 11 13 8 13zm8 .5c-.7 0-1.4.1-2 .3 1.3 1 2 2.3 2 3.4V20h6v-2.4c0-2.4-2.6-4.1-6-4.1z" />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" {...comune}>
      <path d="M20 6h-2.2a3 3 0 0 0-.4-3.2A3 3 0 0 0 12 3a3 3 0 0 0-5.4-.2A3 3 0 0 0 6.2 6H4a2 2 0 0 0-2 2v2h20V8a2 2 0 0 0-2-2zM2 12v6a2 2 0 0 0 2 2h7v-8H2zm11 8h7a2 2 0 0 0 2-2v-6h-9v8z" />
    </svg>
  )
}

/** Video di galleria: parte da solo e resta in riproduzione. */
function RiquadroVideo({ file, poster }: { file: string; poster: string }) {
  const rif = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = rif.current
    if (!v) return
    const prova = () => {
      const p = v.play()
      if (p?.catch) p.catch(() => {})
    }
    prova()
    document.addEventListener('visibilitychange', prova)
    window.addEventListener('pointerdown', prova, { once: true })
    return () => {
      document.removeEventListener('visibilitychange', prova)
      window.removeEventListener('pointerdown', prova)
    }
  }, [])

  return (
    <video
      ref={rif}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      poster={poster}
      aria-hidden="true"
      tabIndex={-1}
      className="h-full w-full object-cover transition-transform duration-[900ms] ease-onda group-hover:scale-[1.06]"
    >
      <source src={file} type="video/mp4" />
    </video>
  )
}
