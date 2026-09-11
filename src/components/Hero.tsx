/* HERO — video «latin dance couple Home Hero» (nome del file = destinazione).

   Scelte dettate dalla misura, non dal gusto:
   · la clip ha luminanza media 143/255, in alto arriva a 160 e oscilla di 97
     punti fra un fotogramma e l'altro → in alto il testo bianco non reggerebbe;
   · in basso scende a 131 e oscilla di soli 17.7 punti
     → il testo va lì, con velatura pesante e ombra: leggibile su ogni frame.

   Composizione: il testo occupa la colonna sinistra, la destra ospita la
   coppia che balla (il video è inquadrato apposta più a destra) più lo
   strato di luci. Nessuno dei due si sovrappone mai al titolo: sono
   colonne separate della stessa griglia, non livelli impilati.

   Animazioni: lo stato di partenza lo imposta GSAP in useLayoutEffect,
   mai il JSX. Senza JavaScript il titolo è semplicemente al suo posto. */
import { useLayoutEffect, useRef } from 'react'
import { HERO, SCUOLA, whatsappUrl } from '../data/contenuti'
import { VideoSfondo } from './VideoSfondo'
import { IconaWhatsapp } from './Testata'
import { PolvereDiScena } from './PolvereDiScena'
import { Cifra } from './Cifra'
import { gsap, menoMovimento } from '../lib/movimento'

const FATTI = [
  { n: 11, s: '', t: 'corsi in programma' },
  { n: 15, s: '+', t: 'anni su almalatinaasd.it' },
  { n: 2, s: '', t: 'voucher per fare sport gratis' },
]

export function Hero({ versoSezione }: { versoSezione: (id: string) => void }) {
  const rif = useRef<HTMLElement>(null)
  const rifMedia = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const radice = rif.current
    if (!radice) return
    if (menoMovimento()) return

    const righe = radice.querySelectorAll<HTMLElement>('[data-riga]')
    const resto = radice.querySelectorAll<HTMLElement>('[data-entra]')
    const fatti = radice.querySelectorAll<HTMLElement>('[data-fatto]')
    const frase = radice.querySelectorAll<HTMLElement>('[data-frase]')
    const tutti = [...righe, ...resto, ...fatti, ...frase]

    const ctx = gsap.context(() => {
      gsap.set(righe, { yPercent: 108 })
      gsap.set(resto, { y: 24, opacity: 0 })
      gsap.set(fatti, { y: 14, opacity: 0 })
      gsap.set(frase, { y: 26, opacity: 0 })

      gsap
        .timeline({
          defaults: { ease: 'power4.out' },
          // Rete di sicurezza: qualunque cosa accada, si finisce visibili.
          onComplete: () => gsap.set(tutti, { clearProps: 'transform,opacity' }),
        })
        .to(righe, { yPercent: 0, duration: 1.05, stagger: 0.085 }, 0.15)
        .to(resto, { y: 0, opacity: 1, duration: 0.75, stagger: 0.1 }, 0.6)
        .to(fatti, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, 0.95)
        .to(frase, { y: 0, opacity: 1, duration: 0.9 }, 0.8)

      /* Parallasse morbido sul video: si muove meno della pagina, così
         l'hero acquista profondità mentre si scorre. Solo transform. */
      if (rifMedia.current && window.innerWidth >= 768) {
        gsap.fromTo(
          rifMedia.current,
          { yPercent: 0, scale: 1.06 },
          {
            yPercent: 9,
            scale: 1.13,
            ease: 'none',
            scrollTrigger: { trigger: radice, start: 'top top', end: 'bottom top', scrub: true },
          },
        )
      }
    }, radice)

    // Rete di sicurezza a tempo.
    const rete = window.setTimeout(() => {
      const fermi = tutti.filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99)
      if (fermi.length) gsap.set(tutti, { clearProps: 'transform,opacity' })
    }, 4000)

    return () => {
      window.clearTimeout(rete)
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={rif}
      id="inizio"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-inchiostro"
      style={{ paddingTop: 'var(--h-testata)' }}
    >
      {/* ── Video di fondo ── */}
      <div ref={rifMedia} className="absolute inset-0" style={{ willChange: 'transform' }}>
        <VideoSfondo
          file={HERO.video}
          poster={HERO.poster}
          velatura="basso"
          velaturaLaterale
          oggetto="66% 40%"
        />
      </div>

      {/* ── Bagliore d'ambiente: due luci lente nei colori del logo.
             Stanno a destra, lontane dal titolo. ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-12%] top-[6%] hidden h-[46vmax] w-[46vmax]
                   rounded-full opacity-[0.22] blur-[90px] md:block"
        style={{
          background: 'radial-gradient(circle, #EB008C 0%, #4D56CD 42%, transparent 70%)',
          animation: 'derivaLuce 19s ease-in-out infinite alternate',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[16%] top-[42%] hidden h-[30vmax] w-[30vmax]
                   rounded-full opacity-[0.16] blur-[80px] lg:block"
        style={{
          background: 'radial-gradient(circle, #00AEEF 0%, #8CC63F 48%, transparent 72%)',
          animation: 'derivaLuce 25s ease-in-out infinite alternate-reverse',
        }}
      />

      {/* ── Polvere di scena: riempie la metà destra, mai la sinistra ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] md:block">
        <PolvereDiScena quantita={22} />
      </div>

      {/* ── Contenuto ──
             Griglia: il testo vive nella colonna di sinistra e non può
             finire sopra le luci di destra. */}
      <div className="contenitore relative z-10 grid grid-cols-1 items-end gap-10 pb-12 pt-10 sm:pb-14 lg:grid-cols-12 lg:pb-16">
        <div className="lg:col-span-7 xl:col-span-6">
          <p data-entra className="occhiello mb-4 flex items-center gap-3 text-azzurro testo-su-video">
            <span className="h-px w-8 bg-azzurro/70" />
            {HERO.occhiello}
          </p>

          <h1 className="titolo-hero max-w-[9ch] text-panna testo-su-video">
            {HERO.parole.map((p, i) => (
              <span key={p} className="maschera-riga">
                <span data-riga className="block">
                  {i === HERO.parole.length - 1 ? (
                    <em className="corsivo testo-arcobaleno not-italic">{p}</em>
                  ) : (
                    p
                  )}
                </span>
              </span>
            ))}
          </h1>

          <p
            data-entra
            className="mt-6 max-w-[44ch] font-sans text-[1.02rem] leading-relaxed text-white/92 testo-su-video sm:text-lg"
          >
            {HERO.sottotitolo}
          </p>

          <div data-entra className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button onClick={() => versoSezione('corsi')} className="btn-primario">
              {HERO.pulsanteCorsi}
            </button>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn-fantasma">
              <IconaWhatsapp className="h-[19px] w-[19px]" />
              {HERO.pulsanteProva}
            </a>
          </div>

          {/* Fatti confermati, non autoelogio. Le cifre salgono da zero. */}
          <dl className="mt-8 flex flex-wrap items-baseline gap-x-7 gap-y-2.5 border-t border-white/15 pt-5">
            {FATTI.map((f) => (
              <div key={f.t} data-fatto className="flex items-baseline gap-2">
                <dt className="sr-only">{f.t}</dt>
                <dd className="flex items-baseline gap-2">
                  <Cifra
                    valore={f.n}
                    suffisso={f.s}
                    className="font-display text-2xl font-extrabold text-panna testo-su-video sm:text-3xl"
                  />
                  <span className="font-sans text-[0.8rem] text-white/80 testo-su-video sm:text-sm">{f.t}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ── Colonna destra: la frase della scuola sopra il video.
               Ha una velatura propria — il video sotto in quel punto è
               chiaro (fascia alta 160/255) e senza pannello il testo non
               reggerebbe. Sta in una colonna separata dal titolo: i due
               blocchi non possono sovrapporsi a nessuna larghezza. ── */}
        <aside
          data-frase
          className="relative hidden lg:col-span-5 lg:flex lg:justify-end xl:col-span-6"
          aria-label="La frase della scuola"
        >
          <div className="relative max-w-[21rem] xl:max-w-[24rem]">
            {/* velatura morbida dietro il testo */}
            <div
              aria-hidden="true"
              className="absolute -inset-6 rounded-3xl"
              style={{
                background:
                  'radial-gradient(120% 100% at 70% 40%, rgba(11,11,15,.82) 0%, rgba(11,11,15,.62) 52%, rgba(11,11,15,0) 100%)',
              }}
            />
            <div className="relative text-right">
              <span
                aria-hidden="true"
                className="mb-5 ml-auto block h-[3px] w-16 rounded-full"
                style={{ background: 'linear-gradient(90deg,#00AEEF,#EB008C)' }}
              />
              <p className="font-serif text-[1.55rem] italic leading-[1.3] text-panna testo-su-video xl:text-[1.85rem]">
                Il ritmo non si spiega:
                <span className="text-azzurro"> si prende con i piedi</span>, una sera
                alla volta.
              </p>
              <p className="mt-4 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.24em] text-white/70 testo-su-video">
                Alma Latina ASD
              </p>
            </div>
          </div>
        </aside>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-4 right-5 z-10 hidden flex-col items-center gap-2 lg:flex"
      >
        <span className="font-sans text-[0.62rem] uppercase tracking-[0.3em] text-white/60 [writing-mode:vertical-rl]">
          Scorri
        </span>
        <span className="h-10 w-px bg-gradient-to-b from-white/60 to-transparent animate-salta" />
      </div>

      <span className="sr-only">{SCUOLA.nomeCompleto}</span>
    </section>
  )
}
