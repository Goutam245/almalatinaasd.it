/* LENTE — una sola finestra d'ingrandimento per tutto il sito.

   Qualunque foto o video, in qualunque sezione, chiama `apri(...)` e si
   apre qui: immagine grande al centro, sotto il nome della disciplina e
   una descrizione breve. Prima ogni sezione avrebbe dovuto rifarsi la
   propria finestra; con un unico contesto il comportamento è identico
   ovunque e la chiusura funziona in un punto solo.

   Chiusura: tasto X, clic sullo sfondo, tasto Esc. Tutte e tre passano
   dalla stessa funzione, così non possono divergere. */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { motion } from 'framer-motion'
import { testoSu } from '../lib/colore'
import { lqipDi, srcPiuGrande } from './Immagine'
import { eMedia, urlMedia } from '../data/archivio'

export interface VoceLente {
  tipo: 'foto' | 'video'
  /** Per le foto: la chiave del manifest. Per i video: il file in /video. */
  sorgente: string
  poster?: string
  etichetta?: string
  titolo: string
  testo?: string
  colore?: string
}

interface Contesto {
  apri: (v: VoceLente) => void
  chiudi: () => void
}

const Ctx = createContext<Contesto>({ apri: () => {}, chiudi: () => {} })
export const useLente = () => useContext(Ctx)

/** I video del cliente stanno in /cliente, quelli di repertorio in /video.
 *  La sorgente porta già il prefisso quando serve. */
const percorsoVideo = (s: string) =>
  eMedia(s) ? urlMedia(s) : s.includes('/') ? `/${s}` : `/video/${s}`

/** Comandi audio della lente: silenzia e cursore del volume.
 *  In pagina i video restano muti; qui l'utente comanda. */
function ComandiAudio({
  muto,
  volume,
  onMuto,
  onVolume,
}: {
  muto: boolean
  volume: number
  onMuto: () => void
  onVolume: (v: number) => void
}) {
  return (
    <div
      className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/20
                 bg-black/65 px-2.5 py-2 backdrop-blur-sm sm:bottom-4 sm:left-4"
    >
      <button
        type="button"
        onClick={onMuto}
        aria-label={muto ? 'Attiva l’audio' : 'Disattiva l’audio'}
        aria-pressed={!muto}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white
                   transition-colors hover:bg-white/15"
      >
        {muto ? (
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
            <path d="M3 9v6h4l5 5V4L7 9H3zm16.6 3 2.2-2.2-1.4-1.4-2.2 2.2-2.2-2.2-1.4 1.4 2.2 2.2-2.2 2.2 1.4 1.4 2.2-2.2 2.2 2.2 1.4-1.4z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05A4.47 4.47 0 0 0 16.5 12zM14 3.23v2.06a6.99 6.99 0 0 1 0 13.42v2.06A9 9 0 0 0 14 3.23z" />
          </svg>
        )}
      </button>

      <label className="flex items-center">
        <span className="sr-only">Volume</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={muto ? 0 : volume}
          onChange={(e) => onVolume(parseFloat(e.target.value))}
          className="cursore-volume h-1.5 w-20 cursor-pointer sm:w-28"
          aria-label="Volume"
        />
      </label>
    </div>
  )
}

const DURATA_USCITA = 240 // ms della dissolvenza in chiusura

export function ProviderLente({ children }: { children: ReactNode }) {
  const [voce, setVoce] = useState<VoceLente | null>(null)
  /* `uscita` accende la dissolvenza; lo smontaggio arriva poi da un
     timer nostro. Prima la chiusura era affidata a AnimatePresence, che
     in certe combinazioni non smontava mai il nodo: restava un pannello
     invisibile (opacity 0) ma a tutto schermo e cliccabile, che
     bloccava ogni clic sul sito. Con un timer non può restare appeso. */
  const [uscita, setUscita] = useState(false)
  const rifTimer = useRef<number | null>(null)
  const rifVideo = useRef<HTMLVideoElement>(null)
  const [muto, setMuto] = useState(false)
  const [volume, setVolume] = useState(0.8)

  const apri = useCallback((v: VoceLente) => {
    if (rifTimer.current) window.clearTimeout(rifTimer.current)
    setUscita(false)
    setVoce(v)
    setMuto(false)
    setVolume(0.8)
  }, [])

  const chiudi = useCallback(() => {
    setUscita(true)
    if (rifTimer.current) window.clearTimeout(rifTimer.current)
    rifTimer.current = window.setTimeout(() => {
      setVoce(null)
      setUscita(false)
    }, DURATA_USCITA)
  }, [])

  // Se il componente sparisce a metà chiusura, il timer non resta acceso.
  useEffect(() => () => {
    if (rifTimer.current) window.clearTimeout(rifTimer.current)
  }, [])

  /* Il video della lente parte con l'audio acceso. Se il browser blocca
     l'avvio con suono (succede senza interazione recente), si riparte
     muti invece di non partire affatto: meglio un video che va. */
  useEffect(() => {
    if (!voce || voce.tipo !== 'video') return
    const v = rifVideo.current
    if (!v) return
    v.volume = 0.8
    v.muted = false
    const p = v.play()
    if (p?.catch)
      p.catch(() => {
        v.muted = true
        setMuto(true)
        v.play().catch(() => {})
      })
  }, [voce])

  /* Esc chiude, e finché la lente è aperta la pagina sotto non scorre. */
  useEffect(() => {
    if (!voce) return
    const onTasto = (e: KeyboardEvent) => {
      if (e.key === 'Escape') chiudi()
    }
    const prec = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onTasto)
    return () => {
      document.body.style.overflow = prec
      window.removeEventListener('keydown', onTasto)
    }
  }, [voce, chiudi])

  const valore = useMemo(() => ({ apri, chiudi }), [apri, chiudi])

  return (
    <Ctx.Provider value={valore}>
      {children}

      {voce && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={voce.titolo}
            /* In uscita smette subito di intercettare i clic: anche se
               qualcosa rallentasse lo smontaggio, il sito resta usabile. */
            className={`fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto
                        bg-inchiostro/95 p-4 backdrop-blur-sm transition-opacity duration-200 sm:p-8
                        ${uscita ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
            /* Clic sullo sfondo: chiude solo se il bersaglio è proprio lo
               sfondo, non un elemento interno che ha lasciato passare l'evento. */
            onClick={(e) => {
              if (e.target === e.currentTarget) chiudi()
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 14 }}
              animate={uscita ? { opacity: 0, scale: 0.97, y: 8 } : { opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="relative my-auto flex w-full max-w-4xl flex-col overflow-hidden
                         rounded-2xl border border-white/12 bg-carbone shadow-2xl"
            >
              {/* Media grande e centrato.
                  Nella lente il video parte CON l'audio: in pagina i video
                  sono muti per forza, qui l'utente ha scelto di aprirlo. */}
              <div className="relative flex items-center justify-center bg-inchiostro">
                {voce.tipo === 'video' ? (
                  <>
                    <video
                      ref={rifVideo}
                      src={percorsoVideo(voce.sorgente)}
                      poster={
                        voce.poster
                          ? eMedia(voce.poster)
                            ? urlMedia(voce.poster)
                            : `/poster/${voce.poster}`
                          : undefined
                      }
                      autoPlay
                      loop
                      playsInline
                      onVolumeChange={(e) => {
                        const v = e.currentTarget
                        setMuto(v.muted)
                        setVolume(v.volume)
                      }}
                      className="max-h-[54svh] w-full object-contain"
                    />
                    <ComandiAudio
                      muto={muto}
                      volume={volume}
                      onMuto={() => {
                        const v = rifVideo.current
                        if (!v) return
                        v.muted = !v.muted
                        if (!v.muted && v.volume === 0) v.volume = 0.8
                        setMuto(v.muted)
                      }}
                      onVolume={(x) => {
                        const v = rifVideo.current
                        if (!v) return
                        v.volume = x
                        v.muted = x === 0
                        setVolume(x)
                        setMuto(v.muted)
                      }}
                    />
                  </>
                ) : (
                  /* Si chiede la variante più grande DAVVERO generata: non
                     tutte le foto arrivano a 1600 e «-1600» fisso dava 404. */
                  <img
                    src={srcPiuGrande(voce.sorgente) ?? lqipDi(voce.sorgente) ?? ''}
                    alt={voce.titolo}
                    className="max-h-[54svh] w-full object-contain"
                    style={{
                      // Se il file non arrivasse, resta il segnaposto sfocato
                      // invece dell'icona di immagine rotta.
                      backgroundImage: `url(${lqipDi(voce.sorgente) ?? ''})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                )}
              </div>

              {/* Descrizione */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.13, duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                className="border-t border-white/10 p-5 sm:p-7"
              >
                {voce.etichetta && (
                  <span
                    className="mb-3 inline-block rounded-full px-3 py-1 font-sans text-[0.62rem]
                               font-bold uppercase tracking-[0.16em]"
                    style={{
                      background: voce.colore ?? '#EB008C',
                      color: testoSu(voce.colore ?? '#EB008C'),
                    }}
                  >
                    {voce.etichetta}
                  </span>
                )}
                <h3 className="font-display text-2xl font-extrabold uppercase leading-none text-panna sm:text-3xl">
                  {voce.titolo}
                </h3>
                {voce.testo && (
                  <p className="mt-3 max-w-[62ch] font-sans text-[0.95rem] leading-relaxed text-nebbia">
                    {voce.testo}
                  </p>
                )}
              </motion.div>

              {/* Chiusura: pastiglia piena nei colori del marchio, sempre
                  visibile sopra qualsiasi immagine. */}
              <button
                type="button"
                onClick={chiudi}
                aria-label="Chiudi"
                className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full
                           text-white shadow-lg ring-1 ring-white/25 transition-transform duration-300
                           ease-onda hover:scale-105 sm:right-4 sm:top-4"
                style={{ background: 'linear-gradient(135deg,#EB008C,#F6931D)' }}
              >
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                  <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                </svg>
              </button>
            </motion.div>
          </div>
        )}
    </Ctx.Provider>
  )
}
