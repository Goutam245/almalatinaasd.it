/* POLVERE DI SCENA — strato luminoso animato per il lato destro dell'hero.

   Serve a riempire con intenzione lo spazio accanto al titolo: sfere di
   luce sfocate nei colori del logo, disposte su tre piani di profondità.
   Le più vicine sono grandi, luminose e si muovono di più; le lontane
   sono piccole, tenui e quasi ferme. Con lo scorrimento i piani si
   separano: è la profondità a dare l'effetto tridimensionale, senza
   caricare una libreria 3D da mezzo megabyte per qualche puntino.

   Regole rispettate:
   · nessun elemento esce dal proprio riquadro (il canvas è confinato);
   · `pointer-events:none`: non intercetta mai un clic;
   · non passa mai sotto il testo — chi lo usa lo posiziona a destra;
   · si ferma quando esce dallo schermo e con «riduci animazioni»;
   · disegna solo su canvas: zero reflow, zero lavoro sul DOM. */
import { useEffect, useRef } from 'react'
import { menoMovimento } from '../lib/movimento'

/* Tinte del logo. Nessun colore nuovo. */
const TINTE = ['#EB008C', '#F6931D', '#FFF200', '#8CC63F', '#00AEEF', '#69DBFF', '#8285CD', '#F460A5']

interface Sfera {
  x: number
  y: number
  r: number
  z: number      // 0.25 lontano … 1 vicino
  vx: number
  vy: number
  tinta: string
  puls: number
  fase: number
}

export function PolvereDiScena({
  className = '',
  quantita = 26,
}: {
  className?: string
  quantita?: number
}) {
  const rif = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = rif.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    const fermo = menoMovimento()
    let larg = 0
    let alt = 0
    let dpr = 1
    let sfere: Sfera[] = []
    let raf = 0
    let attivo = true
    let t = 0
    let scorrimento = window.scrollY

    const casuale = (a: number, b: number) => a + Math.random() * (b - a)

    function semina() {
      sfere = Array.from({ length: quantita }, () => {
        const z = casuale(0.25, 1)
        return {
          x: casuale(0, larg),
          y: casuale(0, alt),
          r: casuale(16, 74) * z,
          z,
          vx: casuale(-0.12, 0.12) * z,
          vy: casuale(-0.22, -0.05) * z,
          tinta: TINTE[Math.floor(Math.random() * TINTE.length)],
          puls: casuale(0.0006, 0.0018),
          fase: casuale(0, Math.PI * 2),
        }
      })
    }

    function ridimensiona() {
      const r = cv!.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      larg = r.width
      alt = r.height
      cv!.width = Math.round(larg * dpr)
      cv!.height = Math.round(alt * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (!sfere.length) semina()
    }

    function disegnaSfera(s: Sfera, offset: number, brillio: number) {
      const y = s.y + offset * s.z
      const g = ctx!.createRadialGradient(s.x, y, 0, s.x, y, s.r)
      g.addColorStop(0, s.tinta + Math.round(brillio * 132).toString(16).padStart(2, '0'))
      g.addColorStop(0.45, s.tinta + Math.round(brillio * 46).toString(16).padStart(2, '0'))
      g.addColorStop(1, s.tinta + '00')
      ctx!.fillStyle = g
      ctx!.beginPath()
      ctx!.arc(s.x, y, s.r, 0, Math.PI * 2)
      ctx!.fill()
    }

    function fotogramma() {
      if (!attivo) return
      ctx!.clearRect(0, 0, larg, alt)
      ctx!.globalCompositeOperation = 'lighter'

      // Parallasse: i piani vicini scorrono di più di quelli lontani.
      const delta = (window.scrollY - scorrimento) * 0.06

      for (const s of sfere) {
        if (!fermo) {
          s.x += s.vx
          s.y += s.vy
          // rientro morbido dai bordi
          if (s.y + s.r < 0) { s.y = alt + s.r; s.x = casuale(0, larg) }
          if (s.x - s.r > larg) s.x = -s.r
          if (s.x + s.r < 0) s.x = larg + s.r
        }
        const brillio = 0.55 + 0.45 * Math.sin(t * s.puls * 1000 + s.fase)
        disegnaSfera(s, delta, brillio)
      }

      ctx!.globalCompositeOperation = 'source-over'
      if (!fermo) t += 1
      raf = requestAnimationFrame(fotogramma)
    }

    ridimensiona()
    fotogramma()

    const ro = new ResizeObserver(ridimensiona)
    ro.observe(cv)

    // Non consuma CPU quando non è a schermo.
    const io = new IntersectionObserver(
      ([v]) => {
        if (v.isIntersecting && !attivo) { attivo = true; raf = requestAnimationFrame(fotogramma) }
        else if (!v.isIntersecting && attivo) { attivo = false; cancelAnimationFrame(raf) }
      },
      { threshold: 0 },
    )
    io.observe(cv)

    return () => {
      attivo = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [quantita])

  return (
    <canvas
      ref={rif}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  )
}
