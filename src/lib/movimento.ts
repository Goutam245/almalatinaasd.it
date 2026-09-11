/* Motore di movimento — GSAP + ScrollTrigger.
   Regole applicate ovunque:
   · si animano solo transform e opacity (le uniche due proprietà che il
     compositore gestisce senza ridisegnare: è così che si tengono i 60fps);
   · se l'utente ha chiesto meno animazioni, tutto appare già al suo posto;
   · nessuna animazione può lasciare del testo invisibile: lo stato finale
     è sempre opacity 1, e viene forzato anche in caso di errore. */
import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const menoMovimento = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Rivela in sequenza gli elementi `[data-rivela]` dentro un contenitore.

    Lo stato nascosto viene applicato da JS in useLayoutEffect, mai dal CSS:
    così senza JavaScript (o con JavaScript rotto) il contenuto è
    semplicemente visibile, invece che invisibile per sempre.
    In più c'è una rete di sicurezza a tempo: se per qualsiasi motivo il
    trigger non scatta, dopo qualche secondo il testo viene mostrato lo
    stesso. Nessun testo può restare invisibile. */
export function useRivela<T extends HTMLElement = HTMLDivElement>(opzioni?: {
  ritardo?: number
  distanza?: number
  scaglione?: number
  inizio?: string
}) {
  const rif = useRef<T>(null)

  useLayoutEffect(() => {
    const radice = rif.current
    if (!radice) return

    const bersagli = Array.from(radice.querySelectorAll<HTMLElement>('[data-rivela]'))
    if (!bersagli.length) return
    // Se l'utente ha chiesto meno movimento non si nasconde nulla.
    if (menoMovimento()) return

    const mostra = () => gsap.set(bersagli, { clearProps: 'transform,opacity' })

    const ctx = gsap.context(() => {
      gsap.set(bersagli, { opacity: 0, y: opzioni?.distanza ?? 30 })
      gsap.to(bersagli, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        delay: opzioni?.ritardo ?? 0,
        stagger: opzioni?.scaglione ?? 0.085,
        onComplete: mostra,
        scrollTrigger: { trigger: radice, start: opzioni?.inizio ?? 'top 85%', once: true },
      })
    }, radice)

    // Rete di sicurezza.
    const rete = window.setTimeout(() => {
      const fermi = bersagli.filter((b) => parseFloat(getComputedStyle(b).opacity) < 0.99)
      if (fermi.length && radice.getBoundingClientRect().top < window.innerHeight * 1.5) mostra()
    }, 3500)

    return () => {
      window.clearTimeout(rete)
      ctx.revert()
    }
  }, [opzioni?.ritardo, opzioni?.distanza, opzioni?.scaglione, opzioni?.inizio])

  return rif
}

/** Parallasse verticale contenuto (solo transform, mai su mobile stretto). */
export function useParallasse<T extends HTMLElement = HTMLDivElement>(intensita = 12) {
  const rif = useRef<T>(null)

  useEffect(() => {
    const el = rif.current
    if (!el || menoMovimento()) return
    // Sotto i 768px il parallasse costa più di quanto renda e può creare
    // bordi scoperti: si disattiva.
    if (window.innerWidth < 768) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -intensita / 2 },
        {
          yPercent: intensita / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [intensita])

  return rif
}

/** Restituisce la velocità di scorrimento normalizzata (-1…1), aggiornata
 *  su rAF. Alimenta l'onda del logo: le fasce si allungano quando si scorre
 *  in fretta e si ricompongono quando ci si ferma. */
export function useVelocitaScroll() {
  const val = useRef(0)

  useEffect(() => {
    if (menoMovimento()) return
    let ultimo = window.scrollY
    let raf = 0
    const passo = () => {
      const ora = window.scrollY
      const delta = ora - ultimo
      ultimo = ora
      // Media mobile: evita gli scatti.
      val.current += (Math.max(-1, Math.min(1, delta / 45)) - val.current) * 0.12
      raf = requestAnimationFrame(passo)
    }
    raf = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(raf)
  }, [])

  return val
}

export { gsap, ScrollTrigger }
