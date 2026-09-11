/* Fascia citazione — riempie lo spazio fra la galleria e i contatti con
   una dichiarazione della scuola, non con un riempitivo.

   La frase è scritta nella voce di Alma Latina e firmata dalla scuola:
   nessuna attribuzione inventata a personaggi che non l'hanno mai detta.
   Tipografia grande e leggibile (non un testo piccolo di servizio), con
   rivelazione morbida allo scorrimento. */
import { useLayoutEffect, useRef } from 'react'
import { CITAZIONE } from '../data/contenuti'
import { gsap, menoMovimento } from '../lib/movimento'

export function Citazione() {
  const rif = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const sez = rif.current
    if (!sez || menoMovimento()) return

    const pezzi = sez.querySelectorAll<HTMLElement>('[data-pezzo]')
    const barra = sez.querySelector<HTMLElement>('[data-barra]')

    const ctx = gsap.context(() => {
      gsap.set(pezzi, { y: 22, opacity: 0 })
      if (barra) gsap.set(barra, { scaleY: 0 })

      gsap
        .timeline({
          scrollTrigger: { trigger: sez, start: 'top 82%', once: true },
          onComplete: () => gsap.set([...pezzi, ...(barra ? [barra] : [])], { clearProps: 'transform,opacity' }),
        })
        .to(barra, { scaleY: 1, duration: 0.6, ease: 'power3.out' })
        .to(pezzi, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' }, '-=0.35')
    }, sez)

    // Rete di sicurezza: mai testo invisibile.
    const rete = window.setTimeout(() => {
      const fermi = [...pezzi].filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99)
      if (fermi.length && sez.getBoundingClientRect().top < window.innerHeight)
        gsap.set(pezzi, { clearProps: 'transform,opacity' })
    }, 4000)

    return () => {
      window.clearTimeout(rete)
      ctx.revert()
    }
  }, [])

  return (
    <section ref={rif} aria-label="Perché si balla" className="relative overflow-hidden bg-inchiostro">
      {/* Alone tenue nei colori del logo: profondità senza rumore. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2
                   -translate-y-1/2 rounded-full opacity-[0.13] blur-[110px]"
        style={{ background: 'radial-gradient(circle, #EB008C 0%, #4D56CD 46%, transparent 72%)' }}
      />

      <div className="contenitore relative py-20 sm:py-24 lg:py-28">
        <figure className="mx-auto flex max-w-4xl gap-6 sm:gap-8">
          {/* Barra a tinte del logo, si allunga all'ingresso. */}
          <span
            data-barra
            aria-hidden="true"
            className="w-[3px] shrink-0 origin-top rounded-full sm:w-1"
            style={{
              background: 'linear-gradient(to bottom, #EB008C, #F6931D, #FFF200, #8CC63F, #00AEEF)',
            }}
          />

          <div>
            <p data-pezzo className="occhiello mb-5 text-azzurro">
              {CITAZIONE.occhiello}
            </p>

            <blockquote
              data-pezzo
              className="font-serif text-[1.65rem] italic leading-[1.28] text-panna
                         sm:text-[2.15rem] lg:text-[2.6rem]"
            >
              <span className="not-italic text-magenta">«</span>
              {CITAZIONE.testo}
              <span className="not-italic text-magenta">»</span>
            </blockquote>

            <figcaption
              data-pezzo
              className="mt-6 flex items-center gap-3 font-sans text-[0.72rem] font-semibold
                         uppercase tracking-[0.24em] text-cenere"
            >
              <span aria-hidden="true" className="h-px w-8 bg-cenere/50" />
              {CITAZIONE.firma}
            </figcaption>
          </div>
        </figure>
      </div>
    </section>
  )
}
