/* SCHERMATA DI APERTURA — una sola volta per sessione.

   Mostra il marchio mentre una passata di colore (le tinte del logo)
   lo attraversa, poi si dissolve sull'hero. Non compare ai cambi di
   pagina interni: la memoria è in sessionStorage, quindi torna solo
   aprendo il sito in una scheda nuova.

   Vincoli rispettati:
   · dura al massimo ~1.6s e si chiude comunque, anche se un asset non
     arriva: non può bloccare l'accesso al sito;
   · l'hero sotto è già montato e con il suo poster, quindi alla
     dissolvenza non c'è nessun vuoto;
   · con «riduci animazioni» non compare affatto. */
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { menoMovimento } from '../lib/movimento'

const CHIAVE = 'alma-latina:apertura-vista'

export function Caricamento() {
  const [visibile, setVisibile] = useState(() => {
    if (typeof window === 'undefined') return false
    if (menoMovimento()) return false
    try {
      return sessionStorage.getItem(CHIAVE) !== '1'
    } catch {
      // Modalità privata o storage bloccato: si salta l'apertura.
      return false
    }
  })

  useEffect(() => {
    if (!visibile) return
    try {
      sessionStorage.setItem(CHIAVE, '1')
    } catch {
      /* niente da fare: l'apertura semplicemente si rivedrà */
    }

    // Blocca lo scorrimento finché il velo è su.
    const prec = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const chiudi = window.setTimeout(() => setVisibile(false), 1600)
    return () => {
      window.clearTimeout(chiudi)
      document.body.style.overflow = prec
    }
  }, [visibile])

  return (
    <AnimatePresence>
      {visibile && (
        <motion.div
          key="apertura"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-inchiostro"
          role="status"
          aria-label="Caricamento del sito"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center px-6"
          >
            <img
              src="/logo/marchio-quadrato.webp"
              alt=""
              width={72}
              height={72}
              className="h-16 w-16 rounded-xl object-cover ring-1 ring-white/20 sm:h-[72px] sm:w-[72px]"
            />

            {/* Passata di colore sul nome. */}
            <span className="relative mt-5 overflow-hidden font-display text-3xl font-extrabold uppercase tracking-[0.03em] text-panna sm:text-4xl">
              Alma Latina
              <span aria-hidden="true" className="scia-colore" />
            </span>

            <span className="mt-2 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.36em] text-cenere">
              ASD · Danza &amp; Fitness
            </span>

            {/* Filo di avanzamento nei colori del logo. */}
            <span aria-hidden="true" className="mt-6 block h-[3px] w-40 overflow-hidden rounded-full bg-white/12">
              <span className="filo-avanzamento block h-full w-full rounded-full" />
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
