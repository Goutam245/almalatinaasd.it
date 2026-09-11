/* TESTATA — fondo pieno, sempre, ovunque.
   Nessuna trasparenza, nessun blur, nessuna scomparsa allo scroll: il fondo
   è #0B0B0F opaco dal primo pixel all'ultimo, su ogni pagina e a qualsiasi
   altezza. Il contrasto del testo bianco su questo fondo è 18.4:1. */
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV, SCUOLA, whatsappUrl } from '../data/contenuti'
import { Link, useRotta } from '../lib/router'
import { BarraAvanzamento } from './Onda'

export function Testata() {
  const [aperto, setAperto] = useState(false)
  const [attiva, setAttiva] = useState('')
  const { percorso, vai } = useRotta()
  const inHome = percorso === '/'

  /* Blocca lo scorrimento del corpo quando il menu è aperto, senza far
     saltare la pagina (compensa la larghezza della barra). */
  useEffect(() => {
    if (!aperto) return
    const y = window.scrollY
    const largh = window.innerWidth - document.documentElement.clientWidth
    const stile = document.body.style
    const prec = { pos: stile.position, top: stile.top, pad: stile.paddingRight, w: stile.width }
    stile.position = 'fixed'
    stile.top = `-${y}px`
    stile.width = '100%'
    if (largh > 0) stile.paddingRight = `${largh}px`
    return () => {
      stile.position = prec.pos
      stile.top = prec.top
      stile.paddingRight = prec.pad
      stile.width = prec.w
      window.scrollTo(0, y)
    }
  }, [aperto])

  /* Evidenzia la voce di menu della sezione che si sta guardando. */
  useEffect(() => {
    if (!inHome) {
      setAttiva('')
      return
    }
    const sezioni = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[]
    if (!sezioni.length) return

    const oss = new IntersectionObserver(
      (voci) => {
        const visibili = voci
          .filter((v) => v.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visibili[0]) setAttiva(visibili[0].target.id)
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.2, 0.6] },
    )
    sezioni.forEach((s) => oss.observe(s))
    return () => oss.disconnect()
  }, [inHome, percorso])

  const versoSezione = (id: string) => {
    setAperto(false)
    if (inHome) {
      vai(`#${id}`)
    } else {
      // Da un'altra pagina: si torna in home e poi si scorre alla sezione.
      vai('/')
      setTimeout(() => vai(`#${id}`), 90)
    }
  }

  return (
    <>
      <a
        href="#contenuto"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]
                   focus:rounded-full focus:bg-magenta focus:px-5 focus:py-3 focus:text-white"
      >
        Vai al contenuto
      </a>

      <header
        className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-inchiostro"
        style={{ height: 'var(--h-testata)' }}
      >
        <div className="contenitore flex h-full flex-nowrap items-center justify-between gap-3 xl:gap-4">
          {/* ── Marchio ── */}
          {/* Il marchio usa il ritaglio stretto sulla fascia colorata del
              logo: il file originale è quasi tutto bianco intorno e nel
              riquadro della testata lasciava un alone vuoto. */}
          <Link
            a="/"
            onClick={() => setAperto(false)}
            className="group -my-1 flex h-full shrink-0 items-center gap-2.5 py-1 pr-1"
            aria-label={`${SCUOLA.nomeCompleto} — home`}
          >
            <img
              src="/logo/marchio-quadrato.webp"
              alt=""
              width={44}
              height={44}
              className="h-[38px] w-[38px] shrink-0 rounded-[9px] object-cover ring-1 ring-white/20
                         transition-transform duration-500 ease-onda group-hover:scale-105 lg:h-[44px] lg:w-[44px]"
            />
            <span className="flex flex-col justify-center leading-none">
              <span className="font-display text-[1.3rem] font-extrabold uppercase leading-[0.9] tracking-[0.02em] text-panna lg:text-[1.42rem] xl:text-[1.58rem]">
                Alma Latina
              </span>
              <span className="mt-[5px] font-sans text-[0.55rem] font-semibold uppercase leading-none tracking-[0.3em] text-nebbia lg:text-[0.62rem]">
                ASD · Danza &amp; Fitness
              </span>
            </span>
          </Link>

          {/* ── Navigazione da schermo largo ──
                 Spaziatura: `gap` fra i pulsanti invece di solo padding
                 interno, così le voci respirano e restano distinte.
                 Cresce con lo schermo: stretta a 1024, comoda da 1280. */}
          <nav
            className="hidden flex-nowrap items-center gap-1 xl:gap-2 2xl:gap-3 lg:flex"
            aria-label="Principale"
          >
            {NAV.map((v) => (
              <button
                key={v.id}
                onClick={() => versoSezione(v.id)}
                aria-current={attiva === v.id ? 'true' : undefined}
                className={`relative whitespace-nowrap rounded-full px-3 py-2.5 font-sans
                            text-[0.85rem] font-medium transition-colors duration-200 hover:text-white
                            xl:px-4 xl:text-[0.9rem] 2xl:px-5
                            ${attiva === v.id ? 'text-white' : 'text-nebbia'}`}
              >
                {v.etichetta}
                {attiva === v.id && (
                  <motion.span
                    layoutId="pillola-nav"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className="absolute inset-x-2 -bottom-px h-[3px] rounded-full"
                    style={{ background: 'linear-gradient(90deg,#EB008C,#F6931D)' }}
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="flex shrink-0 flex-nowrap items-center gap-2 xl:gap-2.5">
            {/* WhatsApp col numero per esteso da 1024 in su.
                Sotto i 1024 il numero sta nel menu, a tutta larghezza. */}
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${SCUOLA.telefono}`}
              className="hidden items-center gap-2 whitespace-nowrap rounded-full bg-white/10 px-3.5 py-2.5
                         font-sans text-[0.84rem] font-semibold text-panna transition-colors
                         hover:bg-white/20 lg:inline-flex xl:px-4 xl:text-[0.88rem]"
            >
              <IconaWhatsapp className="h-[18px] w-[18px] shrink-0 text-[#25D366]" />
              {SCUOLA.telefono}
            </a>
            <button
              onClick={() => versoSezione('contatti')}
              className="hidden whitespace-nowrap rounded-full px-4 py-2.5 font-sans text-[0.86rem]
                         font-semibold text-white transition-transform duration-300 ease-onda
                         hover:-translate-y-0.5 sm:inline-flex lg:hidden xl:inline-flex xl:px-5 xl:text-[0.9rem]"
              style={{ background: 'linear-gradient(96deg,#EB008C,#F6931D)' }}
            >
              Prenota la prova
            </button>

            {/* ── Interruttore menu (solo mobile) ── */}
            <button
              onClick={() => setAperto((v) => !v)}
              aria-expanded={aperto}
              aria-controls="menu-mobile"
              aria-label={aperto ? 'Chiudi il menu' : 'Apri il menu'}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full
                         border border-white/20 bg-white/[0.07] text-panna lg:hidden"
            >
              <span className="relative block h-[14px] w-[20px]">
                <span
                  className="absolute left-0 block h-[2px] w-full rounded bg-current transition-transform duration-300 ease-onda"
                  style={{ top: aperto ? 6 : 0, transform: aperto ? 'rotate(45deg)' : 'none' }}
                />
                <span
                  className="absolute left-0 top-[6px] block h-[2px] w-full rounded bg-current transition-opacity duration-200"
                  style={{ opacity: aperto ? 0 : 1 }}
                />
                <span
                  className="absolute left-0 block h-[2px] w-full rounded bg-current transition-transform duration-300 ease-onda"
                  style={{ top: aperto ? 6 : 12, transform: aperto ? 'rotate(-45deg)' : 'none' }}
                />
              </span>
            </button>
          </div>
        </div>

        <BarraAvanzamento />
      </header>

      {/* ── Pannello mobile ── */}
      <AnimatePresence>
        {aperto && (
          <motion.div
            id="menu-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-inchiostro lg:hidden"
            style={{ paddingTop: 'var(--h-testata)' }}
          >
            <motion.nav
              initial={{ y: -14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="contenitore flex h-full flex-col overflow-y-auto py-6"
              aria-label="Menu"
            >
              {NAV.map((v, i) => (
                <motion.button
                  key={v.id}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => versoSezione(v.id)}
                  className="flex items-baseline gap-4 border-b border-white/10 py-4 text-left"
                >
                  <span className="font-sans text-[0.68rem] font-semibold tabular-nums text-cenere">
                    0{i + 1}
                  </span>
                  <span className="font-display text-[2rem] font-bold uppercase leading-none text-panna xs:text-[2.4rem]">
                    {v.etichetta}
                  </span>
                </motion.button>
              ))}

              <div className="mt-auto flex flex-col gap-3 pb-8 pt-7">
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn-verde w-full">
                  <IconaWhatsapp className="h-5 w-5" />
                  Scrivi su WhatsApp
                </a>
                <button onClick={() => versoSezione('contatti')} className="btn-primario w-full">
                  Prenota la prova
                </button>
                <p className="pt-1 text-center font-sans text-sm text-nebbia">{SCUOLA.telefono}</p>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function IconaWhatsapp({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" focusable="false">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.02h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.23 8.23 0 0 1 8.24 8.24c0 4.54-3.7 8.23-8.24 8.23z" />
    </svg>
  )
}
