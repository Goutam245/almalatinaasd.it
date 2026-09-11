/* Video di sfondo.
   Standard applicati a ogni clip: parte da solo, muto, in loop, senza
   controlli, playsInline, con poster già pronto (nessun lampo nero).

   La velatura NON è decorativa: è calcolata sulla luminanza misurata di
   ciascuna clip (vedi _analisi-media). Un video con media 143/255 non si
   copre come uno con media 35/255, altrimenti o il testo sparisce o il
   video si spegne. */
import { useEffect, useRef, useState } from 'react'
import { urlMedia } from '../data/archivio'

export type Velatura = 'nessuna' | 'leggera' | 'media' | 'forte' | 'basso'

const VELATURE: Record<Velatura, string> = {
  nessuna: 'none',
  // Clip già scure (v09, media 35): basta un velo per staccare il testo.
  leggera:
    'linear-gradient(to top, rgba(11,11,15,.92) 0%, rgba(11,11,15,.45) 34%, rgba(11,11,15,.28) 70%, rgba(11,11,15,.5) 100%)',
  // Clip di media luminanza (v10, media 97).
  media:
    'linear-gradient(to top, rgba(11,11,15,.95) 0%, rgba(11,11,15,.68) 38%, rgba(11,11,15,.48) 72%, rgba(11,11,15,.62) 100%)',
  // Clip chiare (v06 161, v05 165): serve molto peso.
  forte:
    'linear-gradient(to top, rgba(11,11,15,.97) 0%, rgba(11,11,15,.82) 40%, rgba(11,11,15,.66) 75%, rgba(11,11,15,.74) 100%)',
  // Hero (v01, media 143 in alto 160): il testo sta in basso a sinistra,
  // dove la clip è più scura (131) e soprattutto più stabile nel tempo
  // (variazione fra fotogrammi 17.7 contro 97.5 della fascia alta).
  basso:
    'linear-gradient(to top, rgba(11,11,15,.94) 0%, rgba(11,11,15,.86) 22%, rgba(11,11,15,.58) 48%, rgba(11,11,15,.34) 74%, rgba(11,11,15,.42) 100%)',
}

export function VideoSfondo({
  file,
  poster,
  velatura = 'media',
  className = '',
  velaturaLaterale = false,
  oggetto = 'center',
}: {
  file: string
  poster: string
  velatura?: Velatura
  className?: string
  /** Sfumatura aggiuntiva da sinistra: usata dove il testo è allineato a sinistra. */
  velaturaLaterale?: boolean
  oggetto?: string
}) {
  const rifVideo = useRef<HTMLVideoElement>(null)
  const rifBox = useRef<HTMLDivElement>(null)
  const [pronto, setPronto] = useState(false)
  // Tutti i video partono da soli, su ogni dispositivo.
  const mostraVideo = true

  useEffect(() => {
    const v = rifVideo.current
    if (!v) return

    const prova = () => {
      const p = v.play()
      // Se il browser rifiuta l'avvio resta il poster: niente errori in console.
      if (p && typeof p.catch === 'function') p.catch(() => {})
    }

    prova()

    /* Alcuni browser bloccano il primo play finché la scheda non è attiva
       o finché non c'è stata un'interazione: si riprova a quei due eventi,
       così la riproduzione riparte da sola senza chiedere nulla. */
    const riprova = () => prova()
    document.addEventListener('visibilitychange', riprova)
    window.addEventListener('pointerdown', riprova, { once: true })
    window.addEventListener('touchstart', riprova, { once: true })

    return () => {
      document.removeEventListener('visibilitychange', riprova)
      window.removeEventListener('pointerdown', riprova)
      window.removeEventListener('touchstart', riprova)
    }
  }, [])

  return (
    <div ref={rifBox} className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Il poster è dipinto come sfondo del contenitore: c'è già al primo
          frame, prima ancora che il <video> chieda un byte. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${urlMedia(poster)})`, backgroundPosition: oggetto }}
      />
      {mostraVideo && (
        <video
          ref={rifVideo}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          poster={urlMedia(poster)}
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={() => setPronto(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            pronto ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ objectPosition: oggetto }}
        >
          <source src={urlMedia(file)} type="video/mp4" />
        </video>
      )}

      {velatura !== 'nessuna' && (
        <div aria-hidden="true" className="absolute inset-0" style={{ background: VELATURE[velatura] }} />
      )}
      {velaturaLaterale && (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(100deg, rgba(11,11,15,.9) 0%, rgba(11,11,15,.6) 34%, rgba(11,11,15,.12) 62%, rgba(11,11,15,0) 82%)',
          }}
        />
      )}
    </div>
  )
}
