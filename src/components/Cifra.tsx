/* Cifra che sale da zero al suo valore quando entra in vista.
   Il numero finale è già nel DOM al primo disegno: se il conteggio non
   parte (JS lento, «riduci animazioni», lettore di schermo) resta scritto
   il valore giusto — mai uno zero né uno spazio vuoto. */
import { useEffect, useRef } from 'react'
import { gsap, menoMovimento } from '../lib/movimento'

export function Cifra({
  valore,
  suffisso = '',
  className = '',
}: {
  valore: number
  suffisso?: string
  className?: string
}) {
  const rif = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = rif.current
    if (!el || menoMovimento()) return

    const stato = { n: 0 }
    const ctx = gsap.context(() => {
      gsap.to(stato, {
        n: valore,
        duration: 1.25,
        ease: 'power2.out',
        delay: 0.15,
        onUpdate: () => {
          el.firstChild!.textContent = String(Math.round(stato.n))
        },
        // Qualunque cosa accada, alla fine c'è il numero esatto.
        onComplete: () => {
          el.firstChild!.textContent = String(valore)
        },
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      })
    }, el)

    return () => {
      ctx.revert()
      el.firstChild!.textContent = String(valore)
    }
  }, [valore])

  return (
    <span ref={rif} className={className}>
      <span className="tabular-nums">{valore}</span>
      {suffisso}
    </span>
  )
}
