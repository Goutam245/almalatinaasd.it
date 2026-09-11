/* ═══ L'ONDA — la firma del sito ═══════════════════════════════════════
   Il logo di Alma Latina è una successione di fasce colorate che scorrono
   dietro due ballerini. Qui quella stessa onda diventa un elemento vivo.

   Non è uno scorrimento laterale: ogni fascia è un tracciato SVG la cui
   `d` viene ridisegnata a ogni fotogramma su due sinusoidi sovrapposte di
   frequenza diversa. Il risultato ondeggia come un nastro nel vento —
   sale, scende e si torce — invece di scivolare da destra a sinistra.

   Il ciclo è chiuso per costruzione: la fase avanza di 2π in un tempo
   fisso e le sinusoidi hanno periodo intero sulla larghezza, quindi non
   esiste un punto di ricongiunzione visibile.

   Costo: ~40 punti per bordo × 9 fasce, sole stringhe di tracciato, e
   `d` non provoca layout. Su schermo fermo resta sotto il millisecondo
   a fotogramma. Con «riduci animazioni» il nastro è disegnato immobile.
   ═══════════════════════════════════════════════════════════════════════ */
import { useEffect, useMemo, useRef } from 'react'
import { gsap, menoMovimento } from '../lib/movimento'

/* Ordine e tinte presi dal file del logo, dall'alto verso il basso.
   I colori NON si toccano: cambia solo il movimento. */
const FASCE = [
  { colore: '#8285CD', y: 14,  amp: 7.5, spessore: 15, giro: 1.00, fase: 0.0 },
  { colore: '#FFF200', y: 27,  amp: 9.5, spessore: 13, giro: 1.35, fase: 0.7 },
  { colore: '#00AEEF', y: 39,  amp: 6.5, spessore: 12, giro: 0.82, fase: 1.4 },
  { colore: '#F6931D', y: 51,  amp: 10,  spessore: 16, giro: 1.60, fase: 2.1 },
  { colore: '#00A550', y: 65,  amp: 7.5, spessore: 12, giro: 1.12, fase: 2.8 },
  { colore: '#EB008C', y: 77,  amp: 11,  spessore: 15, giro: 0.70, fase: 3.5 },
  { colore: '#69DBFF', y: 90,  amp: 8,   spessore: 13, giro: 1.44, fase: 4.2 },
  { colore: '#8CC63F', y: 102, amp: 8.5, spessore: 12, giro: 0.95, fase: 4.9 },
  { colore: '#4D56CD', y: 113, amp: 6.5, spessore: 14, giro: 1.22, fase: 5.6 },
]

const LARGH = 1200
const PUNTI = 40                    // campioni per bordo
const DX = LARGH / PUNTI

/** Una fascia ondulata: due sinusoidi di periodo intero sulla larghezza,
 *  così agli estremi il tracciato combacia sempre con se stesso. */
function tracciaFascia(
  y: number,
  amp: number,
  spessore: number,
  faseBase: number,
  t: number,
  giro: number,
) {
  const f1 = 2 * Math.PI * 2 // due creste sulla larghezza
  const f2 = 2 * Math.PI * 3 // tre creste: rompe la regolarità
  const alt = (x: number) => {
    const u = x / LARGH
    return (
      amp * Math.sin(f1 * u + faseBase + t * giro) +
      amp * 0.38 * Math.sin(f2 * u - faseBase * 0.6 - t * giro * 1.35)
    )
  }

  let d = ''
  for (let i = 0; i <= PUNTI; i++) {
    const x = i * DX
    d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + (y + alt(x)).toFixed(2)
  }
  for (let i = PUNTI; i >= 0; i--) {
    const x = i * DX
    d += 'L' + x.toFixed(1) + ' ' + (y + spessore + alt(x)).toFixed(2)
  }
  return d + 'Z'
}

export function Onda({
  altezza = 'h-16 sm:h-20 lg:h-24',
  className = '',
  opacita = 1,
  /** Secondi per un giro completo dell'onda. */
  durata = 8,
}: {
  altezza?: string
  className?: string
  opacita?: number
  durata?: number
}) {
  const rif = useRef<SVGSVGElement>(null)

  /* Tracciati iniziali: la fascia è già ondulata al primo disegno, anche
     prima che parta l'animazione (e anche se non parte affatto). */
  const iniziali = useMemo(
    () => FASCE.map((f) => tracciaFascia(f.y, f.amp, f.spessore, f.fase, 0, f.giro)),
    [],
  )

  useEffect(() => {
    const svg = rif.current
    if (!svg || menoMovimento()) return

    const paths = Array.from(svg.querySelectorAll<SVGPathElement>('path[data-fascia]'))
    if (!paths.length) return

    /* Un solo tween guida la fase: 0 → 2π con andamento lineare.
       La morbidezza «sine.inOut» è già nella forma dell'onda, mentre la
       fase deve avanzare a passo costante — altrimenti a ogni ripetizione
       si vedrebbe una frenata. */
    const stato = { t: 0 }
    const tween = gsap.to(stato, {
      t: Math.PI * 2,
      duration: durata,
      ease: 'none',
      repeat: -1,
      onUpdate() {
        for (let i = 0; i < paths.length; i++) {
          const f = FASCE[i]
          paths[i].setAttribute('d', tracciaFascia(f.y, f.amp, f.spessore, f.fase, stato.t, f.giro))
        }
      },
    })

    /* Ferma il calcolo quando il nastro non è a schermo. */
    const oss = new IntersectionObserver(
      ([voce]) => (voce.isIntersecting ? tween.play() : tween.pause()),
      { rootMargin: '80px 0px' },
    )
    oss.observe(svg)

    return () => {
      oss.disconnect()
      tween.kill()
    }
  }, [durata])

  return (
    <div
      className={`pointer-events-none w-full overflow-hidden ${altezza} ${className}`}
      aria-hidden="true"
      style={{ opacity: opacita }}
    >
      <svg
        ref={rif}
        viewBox={`0 0 ${LARGH} 130`}
        preserveAspectRatio="none"
        className="h-full w-full"
        focusable="false"
      >
        {FASCE.map((f, i) => (
          <path key={f.colore} data-fascia d={iniziali[i]} fill={f.colore} />
        ))}
      </svg>
    </div>
  )
}

/** Filo sottile a tinte del logo: separa le sezioni senza rubare scena. */
export function FiloArcobaleno({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`h-px w-full ${className}`}
      style={{
        background:
          'linear-gradient(90deg, transparent 0%, #EB008C 12%, #F6931D 28%, #FFF200 42%, #8CC63F 57%, #00AEEF 72%, #4D56CD 88%, transparent 100%)',
      }}
    />
  )
}

/** Indicatore di avanzamento in cima alla pagina, nei colori del logo. */
export function BarraAvanzamento() {
  const rif = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = rif.current
    if (!el) return
    const setter = gsap.quickSetter(el, 'scaleX')
    let raf = 0
    const passo = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setter(h > 0 ? Math.min(1, window.scrollY / h) : 0)
      raf = requestAnimationFrame(passo)
    }
    raf = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      ref={rif}
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-[3px] origin-left"
      style={{
        transform: 'scaleX(0)',
        willChange: 'transform',
        background:
          'linear-gradient(90deg, #EB008C, #F6931D, #FFF200, #8CC63F, #00A550, #00AEEF, #4D56CD, #8285CD)',
      }}
    />
  )
}
