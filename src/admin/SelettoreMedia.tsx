/* SELETTORE MEDIA — carica un file dal dispositivo, oppure sceglie
   qualcosa già caricato, oppure lascia il file originale del sito.

   I file caricati finiscono in IndexedDB e nei contenuti compaiono come
   `media://<id>`. I file originali restano quelli che sono (percorsi
   dentro /img, /video, /doc o chiavi del manifest). */
import { useEffect, useRef, useState } from 'react'
import {
  PREFISSO_MEDIA,
  elencoMedia,
  eliminaMedia,
  eMedia,
  salvaMedia,
  urlMedia,
  type VoceMedia,
} from '../data/archivio'
import { srcPiuGrande } from '../components/Immagine'
import { Avviso, Bottone, pesoLeggibile } from './ui'

/** Anteprima di un valore, qualunque forma abbia. */
function Anteprima({ valore, accetta }: { valore: string; accetta?: string }) {
  if (!valore) {
    return (
      <div className="flex h-full w-full items-center justify-center text-[0.76rem] text-slate-600">
        nessun file
      </div>
    )
  }
  const eVideo = accetta?.startsWith('video') || /\.(mp4|webm|mov)$/i.test(valore)
  const ePdf = accetta?.includes('pdf') || /\.pdf$/i.test(valore)

  if (ePdf) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-slate-400">
        <span className="text-2xl">📄</span>
        <span className="px-2 text-center text-[0.7rem] leading-tight">PDF</span>
      </div>
    )
  }
  if (eVideo) {
    return (
      <video
        src={eMedia(valore) ? urlMedia(valore) : valore}
        muted
        loop
        playsInline
        autoPlay
        className="h-full w-full object-cover"
      />
    )
  }
  // Immagine: può essere un media caricato o una chiave del manifest.
  const src = eMedia(valore) ? urlMedia(valore) : (srcPiuGrande(valore) ?? valore)
  return <img src={src} alt="" className="h-full w-full object-cover" />
}

export function SelettoreMedia({
  etichetta,
  valore,
  onCambia,
  accetta = 'image/*',
  aiuto,
}: {
  etichetta: string
  valore: string
  onCambia: (v: string) => void
  accetta?: string
  aiuto?: string
}) {
  const [libreria, setLibreria] = useState<VoceMedia[]>([])
  const [apertaLibreria, setApertaLibreria] = useState(false)
  const [errore, setErrore] = useState('')
  const [caricamento, setCaricamento] = useState(false)
  const rifInput = useRef<HTMLInputElement>(null)

  const ricarica = () => elencoMedia().then(setLibreria).catch(() => setLibreria([]))
  useEffect(() => {
    if (apertaLibreria) ricarica()
  }, [apertaLibreria])

  async function carica(file: File | undefined) {
    if (!file) return
    setErrore('')
    // Limite di buon senso: oltre i 60MB il browser fatica e il sito diventa lento.
    if (file.size > 60 * 1024 * 1024) {
      setErrore(`File troppo pesante (${pesoLeggibile(file.size)}). Massimo 60 MB.`)
      return
    }
    try {
      setCaricamento(true)
      const v = await salvaMedia(file)
      onCambia(PREFISSO_MEDIA + v.id)
      ricarica()
    } catch (e) {
      setErrore(e instanceof Error ? e.message : 'caricamento non riuscito')
    } finally {
      setCaricamento(false)
      if (rifInput.current) rifInput.current.value = ''
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-[0.82rem] font-semibold text-slate-200">{etichetta}</span>

      <div className="flex flex-wrap items-start gap-3">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-slate-700 bg-slate-950">
          <Anteprima valore={valore} accetta={accetta} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Bottone onClick={() => rifInput.current?.click()} disabilitato={caricamento}>
              {caricamento ? 'Carico…' : 'Carica dal dispositivo'}
            </Bottone>
            <Bottone variante="fantasma" onClick={() => setApertaLibreria((v) => !v)}>
              {apertaLibreria ? 'Chiudi archivio' : 'Scegli dall’archivio'}
            </Bottone>
          </div>

          <p className="break-all font-mono text-[0.72rem] text-slate-500">
            {valore
              ? eMedia(valore)
                ? `caricato · ${valore.slice(0, 26)}…`
                : `originale · ${valore}`
              : '— nessun file —'}
          </p>

          {aiuto && <p className="text-[0.76rem] leading-snug text-slate-500">{aiuto}</p>}
        </div>

        <input
          ref={rifInput}
          type="file"
          accept={accetta}
          className="hidden"
          onChange={(e) => carica(e.target.files?.[0])}
        />
      </div>

      {errore && (
        <div className="mt-2">
          <Avviso tono="errore">{errore}</Avviso>
        </div>
      )}

      {apertaLibreria && (
        <div className="mt-3 rounded-lg border border-slate-700 bg-slate-950/60 p-3">
          {libreria.length === 0 ? (
            <p className="py-4 text-center text-[0.82rem] text-slate-500">
              Nessun file caricato finora.
            </p>
          ) : (
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {libreria.map((m) => {
                const rif = PREFISSO_MEDIA + m.id
                const scelto = valore === rif
                return (
                  <li key={m.id} className="relative">
                    <button
                      type="button"
                      onClick={() => onCambia(rif)}
                      className={`block aspect-square w-full overflow-hidden rounded-md border-2 transition-colors
                                  ${scelto ? 'border-fuchsia-500' : 'border-transparent hover:border-slate-600'}`}
                      title={`${m.nome} · ${pesoLeggibile(m.peso)}`}
                    >
                      <Anteprima valore={rif} accetta={m.tipo} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Elimina ${m.nome}`}
                      title="Elimina definitivamente"
                      onClick={async () => {
                        await eliminaMedia(m.id)
                        if (valore === rif) onCambia('')
                        ricarica()
                      }}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full
                                 border border-red-900 bg-red-950 text-[0.7rem] text-red-200 hover:bg-red-900"
                    >
                      ×
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
