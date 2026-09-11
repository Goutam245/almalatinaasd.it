/* Immagine responsive con segnaposto sfocato (LQIP) incorporato.
   Il LQIP è un base64 da ~200 byte già dentro il bundle: lo spazio è
   riempito dal primo frame, quindi non c'è mai un rettangolo vuoto. */
import { useState } from 'react'
import manifest from '../data/manifest.json'
import { eMedia, urlMedia } from '../data/archivio'

type Voce = { w: number; h: number; ratio: number; lqip: string; sizes: Record<string, number> }
const IMG = manifest as unknown as Record<string, Voce>

export function Immagine({
  chiave,
  alt,
  className = '',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  fuoco = '50% 50%',
  priorita = false,
}: {
  chiave: string
  alt: string
  className?: string
  sizes?: string
  fuoco?: string
  priorita?: boolean
}) {
  const [caricata, setCaricata] = useState(false)

  /* Foto caricata dal pannello: non sta nel manifest ma in IndexedDB.
     Si mostra diretta, senza varianti responsive. */
  if (eMedia(chiave)) {
    return (
      <div className={`relative overflow-hidden bg-carbone ${className}`}>
        <img
          src={urlMedia(chiave)}
          alt={alt}
          loading={priorita ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-cover"
          style={{ objectPosition: fuoco }}
        />
      </div>
    )
  }

  const voce = IMG[chiave]

  // Chiave mancante (es. Vacugym, senza foto): fondo di marca, mai un buco.
  if (!voce) {
    return (
      <div
        className={`bg-gradient-to-br from-grafite via-carbone to-inchiostro ${className}`}
        role="img"
        aria-label={alt}
      />
    )
  }

  const larghezze = Object.keys(voce.sizes).map(Number).sort((a, b) => a - b)
  const srcSet = larghezze.map((w) => `/img/${chiave}-${w}.webp ${w}w`).join(', ')
  const piuGrande = larghezze[larghezze.length - 1]

  return (
    <div className={`relative overflow-hidden bg-carbone ${className}`}>
      {/* Segnaposto sfocato: sparisce solo quando la foto vera è pronta. */}
      <img
        src={voce.lqip}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full scale-110 object-cover blur-xl transition-opacity duration-700 ${
          caricata ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ objectPosition: fuoco }}
      />
      <img
        src={`/img/${chiave}-${piuGrande}.webp`}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={voce.w}
        height={voce.h}
        loading={priorita ? 'eager' : 'lazy'}
        /* attributo HTML in minuscolo: React 18 non conosce `fetchPriority`
           in camelCase e lo scarterebbe con un avviso in console. */
        {...{ fetchpriority: priorita ? 'high' : 'auto' }}
        decoding="async"
        onLoad={() => setCaricata(true)}
        onError={() => setCaricata(true)}
        className={`relative h-full w-full object-cover transition-opacity duration-700 ${
          caricata ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ objectPosition: fuoco }}
      />
    </div>
  )
}

export const rapporto = (chiave: string) => IMG[chiave]?.ratio ?? 1.5

/** Percorso della variante più grande realmente generata per quella foto.
 *  Non tutte arrivano a 1600: le foto del cliente più piccole si fermano a
 *  640 o 1080. Chiedere sempre «-1600» faceva 404 e nella lente compariva
 *  un riquadro rotto. */
export function srcPiuGrande(chiave: string): string | null {
  if (eMedia(chiave)) return urlMedia(chiave)
  const voce = IMG[chiave]
  if (!voce) return null
  const larghezze = Object.keys(voce.sizes).map(Number).sort((a, b) => a - b)
  if (!larghezze.length) return null
  return `/img/${chiave}-${larghezze[larghezze.length - 1]}.webp`
}

/** Segnaposto sfocato: serve alla lente per non mostrare mai un vuoto. */
export const lqipDi = (chiave: string) => (eMedia(chiave) ? null : IMG[chiave]?.lqip ?? null)
