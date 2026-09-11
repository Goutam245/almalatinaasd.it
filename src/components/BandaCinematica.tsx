/* BANDA CINEMATICA — il momento più forte della pagina.
   Video «latin dance 2»: 2938x1440, formato 2.04:1, trenta secondi, e una
   luminanza media di 35/255 con variazione fra fotogrammi di appena 3.4.
   È l'unica clip del lotto su cui un titolo bianco enorme è sicuro senza
   spegnere l'immagine: bastano pochi punti di velatura.
   In più il magenta dei fari è esattamente #EB008C, il magenta del logo.

   È il file più pesante del lotto (31MB): in CONSEGNA.md c'è il comando
   per ricomprimerlo prima della pubblicazione.

   L'audio è l'unico comando esposto, come da regola: parte muto, si accende
   se l'utente lo chiede. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { BANDA } from '../data/contenuti'
import { gsap, menoMovimento } from '../lib/movimento'

export function BandaCinematica() {
  const rif = useRef<HTMLElement>(null)
  const rifVideo = useRef<HTMLVideoElement>(null)
  const [audio, setAudio] = useState(false)
  const [pronto, setPronto] = useState(false)

  /* Parte da sola e resta in riproduzione, come tutte le altre clip. */
  useEffect(() => {
    const v = rifVideo.current
    if (!v) return
    const prova = () => {
      const p = v.play()
      if (p?.catch) p.catch(() => {})
    }
    prova()
    document.addEventListener('visibilitychange', prova)
    window.addEventListener('pointerdown', prova, { once: true })
    return () => {
      document.removeEventListener('visibilitychange', prova)
      window.removeEventListener('pointerdown', prova)
    }
  }, [])

  /* Le parole salgono una dopo l'altra mentre la banda entra. */
  useLayoutEffect(() => {
    const sez = rif.current
    if (!sez) return
    if (menoMovimento()) return

    const righe = sez.querySelectorAll<HTMLElement>('[data-parola]')
    const coda = sez.querySelector<HTMLElement>('[data-coda]')
    const appigli = sez.querySelectorAll<HTMLElement>('[data-appigli] > li')

    const tutti = [...righe, ...(coda ? [coda] : []), ...appigli]

    const ctx = gsap.context(() => {
      gsap.set(righe, { yPercent: 106, opacity: 0 })
      if (coda) gsap.set(coda, { y: 18, opacity: 0 })
      gsap.set(appigli, { x: 26, opacity: 0 })

      gsap
        .timeline({
          scrollTrigger: { trigger: sez, start: 'top 78%', once: true },
          // Comunque vada, si finisce visibili.
          onComplete: () => gsap.set(tutti, { clearProps: 'transform,opacity' }),
        })
        .to(righe, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.11, ease: 'power4.out' })
        .to(coda, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.25')
        .to(appigli, { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.45')
    }, sez)

    // Rete di sicurezza: nessun testo può restare invisibile.
    const rete = window.setTimeout(() => {
      const fermi = tutti.filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99)
      if (fermi.length && sez.getBoundingClientRect().top < window.innerHeight)
        gsap.set(tutti, { clearProps: 'transform,opacity' })
    }, 4000)

    return () => {
      window.clearTimeout(rete)
      ctx.revert()
    }
  }, [])

  const commutaAudio = () => {
    const v = rifVideo.current
    if (!v) return
    v.muted = !v.muted
    setAudio(!v.muted)
    if (!v.muted) {
      const p = v.play()
      if (p?.catch) p.catch(() => {})
    }
  }

  return (
    <section
      ref={rif}
      aria-label="La scuola sul palco"
      /* Altezza contenuta: prima la banda si allungava oltre lo schermo e
         lasciava un vuoto sulla destra. Ora è alta quanto serve al
         contenuto, con un tetto ragionevole. */
      className="relative isolate flex items-center overflow-hidden bg-inchiostro
                 min-h-[clamp(30rem,72svh,44rem)] py-20 sm:py-24"
    >
      {/* Il poster è già dipinto: nessun buco nero prima del video. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/poster/v09-palco.webp)' }}
      />
      <video
        ref={rifVideo}
        muted
        loop
        playsInline
        preload="auto"
        poster="/poster/v09-palco.webp"
        aria-hidden="true"
        tabIndex={-1}
        onCanPlay={() => setPronto(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ${
          pronto ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <source src="/video/v09-latin-dance-2.mp4" type="video/mp4" />
      </video>

      {/* Clip già scura (media 35/255): basta poco per staccare il testo.
          Da destra si scurisce di nuovo, perché adesso lì ci sono le tre
          schede e devono restare leggibili quanto il titolo. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(11,11,15,.88) 0%, rgba(11,11,15,.62) 38%, rgba(11,11,15,.42) 60%, rgba(11,11,15,.68) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(11,11,15,1) 0%, rgba(11,11,15,.1) 26%, rgba(11,11,15,0) 55%, rgba(11,11,15,.55) 100%)',
        }}
      />

      <div className="contenitore relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* ── Titolo ──
              Il limite in `ch` sta sul titolo, dove `ch` si misura sul suo
              corpo reale. Prima era su un <blockquote> da 16px e valeva
              120px: le parole uscivano tagliate a metà. */}
          <blockquote className="lg:col-span-7">
            <p className="titolo-hero max-w-[12ch] text-panna testo-su-video">
              {BANDA.parole.map((p, i) => (
                <span key={p} className="maschera-riga">
                  <span
                    data-parola
                    className={`block ${i === 1 ? 'corsivo normal-case text-magenta' : ''}`}
                  >
                    {p}
                  </span>
                </span>
              ))}
            </p>
            <footer
              data-coda
              className="mt-7 max-w-[34ch] font-sans text-base leading-relaxed text-white/90 testo-su-video sm:text-lg"
            >
              {BANDA.coda}
            </footer>
          </blockquote>

          {/* ── Colonna destra: tre appigli concreti al posto del vuoto ── */}
          <ul data-appigli className="flex flex-col gap-3 lg:col-span-5">
            {BANDA.appigli.map((a, i) => (
              <li
                key={a.titolo}
                className="flex items-start gap-4 rounded-2xl border border-white/15 bg-inchiostro/55 p-4
                           backdrop-blur-sm sm:p-5"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                             font-display text-sm font-extrabold"
                  style={{
                    background: ['#EB008C', '#F6931D', '#FFF200'][i],
                    color: i === 2 ? '#0B0B0F' : '#FFFFFF',
                  }}
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block font-sans text-[0.98rem] font-semibold leading-snug text-panna">
                    {a.titolo}
                  </span>
                  <span className="mt-1 block font-sans text-[0.86rem] leading-snug text-nebbia">
                    {a.testo}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Unico comando sul video: l'audio. */}
      <button
        onClick={commutaAudio}
        aria-pressed={audio}
        className="absolute bottom-6 right-5 z-20 inline-flex items-center gap-2.5 rounded-full
                   border border-white/25 bg-black/55 px-4 py-2.5 font-sans text-[0.78rem]
                   font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/75 sm:right-8"
      >
        {audio ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05A4.47 4.47 0 0 0 16.5 12z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M3 9v6h4l5 5V4L7 9H3zm16.6 3 2.2-2.2-1.4-1.4-2.2 2.2-2.2-2.2-1.4 1.4 2.2 2.2-2.2 2.2 1.4 1.4 2.2-2.2 2.2 2.2 1.4-1.4z" />
          </svg>
        )}
        {audio ? 'Disattiva l’audio' : 'Clicca per attivare l’audio'}
      </button>
    </section>
  )
}
