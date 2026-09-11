/* Router minimo (≈1KB) — evita una dipendenza esterna su un sito vetrina.
   Requisito non negoziabile: ogni cambio di rotta riporta la pagina in cima,
   anche su mobile, anche quando il browser prova a ripristinare la posizione. */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

interface Rotta {
  percorso: string
  vai: (a: string) => void
}

const Ctx = createContext<Rotta>({ percorso: '/', vai: () => {} })
export const useRotta = () => useContext(Ctx)

/** Riporta in cima in modo affidabile: subito, e di nuovo al frame dopo,
 *  perché su iOS il ripristino automatico avviene DOPO il popstate. */
function suInCima() {
  const salta = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  salta()
  requestAnimationFrame(salta)
  // Terza rete di sicurezza: alcuni browser mobili ripristinano più tardi.
  setTimeout(salta, 60)
}

/* ── Due modi di indirizzare, per non dipendere dall'hosting ──────────

   Modo normale:  /admin          — richiede che il server, quando non
                                    trova il file, risponda con index.html
                                    (la cosiddetta «ricaduta SPA»).
   Modo ancora:   /#/admin        — funziona ovunque, senza configurare
                                    niente: il server serve sempre la home
                                    e il percorso viaggia dopo il cancelletto.

   Il secondo esiste come rete di sicurezza: se l'hosting non ha la
   ricaduta SPA configurata, /admin risponde 404 e il pannello sembra
   sparito. Con /#/admin si entra lo stesso.

   ⚠️ Solo le ancore che iniziano con «#/» sono rotte. «#corsi» resta un
   normale salto a una sezione della home. */

const ANCORA_ROTTA = '#/'

/** Controllo pendente della rete di sicurezza dello scorrimento (vedi `vai`). */
let reteScorrimento: number | null = null

function percorsoDaUrl(): string {
  const h = window.location.hash
  if (h.startsWith(ANCORA_ROTTA)) return h.slice(1) || '/'
  return window.location.pathname || '/'
}

/** Se la pagina è stata aperta in modalità ancora, ci si resta: cambiare
 *  modo a metà navigazione farebbe sparire il pannello al primo clic. */
const modoAncora = () => window.location.hash.startsWith(ANCORA_ROTTA)

export function Router({ children }: { children: ReactNode }) {
  const [percorso, setPercorso] = useState(percorsoDaUrl)

  // Il browser non deve tentare di ricordare lo scroll: lo gestiamo noi.
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
  }, [])

  const vai = useCallback(
    (a: string) => {
      // Ancora interna alla pagina corrente: scorrimento morbido, nessun cambio rotta.
      if (a.startsWith('#') && !a.startsWith(ANCORA_ROTTA)) {
        const el = document.querySelector(a)
        if (el) {
          const y =
            el.getBoundingClientRect().top +
            window.scrollY -
            (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--h-testata')) || 68) -
            8

          window.scrollTo({ top: y, behavior: 'smooth' })

          /* Rete di sicurezza: alcuni browser (e le modalità automatiche
             o «riduci animazioni») ignorano del tutto `behavior: smooth`
             e la pagina resterebbe ferma. Se dopo mezzo secondo non ci
             siamo mossi verso la meta, ci si arriva senza animazione:
             meglio un salto secco che un collegamento che non fa nulla.

             Il controllo precedente va annullato: con due clic ravvicinati
             la rete del primo scatterebbe a metà del secondo viaggio e
             butterebbe la pagina sulla sezione sbagliata. */
          if (reteScorrimento !== null) window.clearTimeout(reteScorrimento)
          const partenza = window.scrollY
          reteScorrimento = window.setTimeout(() => {
            reteScorrimento = null
            const fermo = Math.abs(window.scrollY - partenza) < 8
            const lontano = Math.abs(window.scrollY - y) > 8
            if (fermo && lontano) window.scrollTo({ top: y, behavior: 'auto' })
          }, 500)

          history.replaceState(null, '', a)
        }
        return
      }

      // Normalizza «#/admin» in «/admin»: all'app arriva sempre un percorso.
      const rotta = a.startsWith(ANCORA_ROTTA) ? a.slice(1) : a

      if (rotta === percorso) {
        suInCima()
        return
      }

      if (modoAncora()) {
        // In modalità ancora si scrive solo l'hash: il server non c'entra.
        window.location.hash = '/' + rotta.replace(/^\//, '')
      } else {
        window.history.pushState(null, '', rotta)
      }
      setPercorso(rotta)
      suInCima()
    },
    [percorso],
  )

  useEffect(() => {
    const aggiorna = () => {
      setPercorso(percorsoDaUrl())
      suInCima()
    }
    window.addEventListener('popstate', aggiorna)
    window.addEventListener('hashchange', aggiorna)
    return () => {
      window.removeEventListener('popstate', aggiorna)
      window.removeEventListener('hashchange', aggiorna)
    }
  }, [])

  return <Ctx.Provider value={{ percorso, vai }}>{children}</Ctx.Provider>
}

/** Collegamento interno: intercetta il click e delega al router. */
export function Link({
  a,
  children,
  className,
  onClick,
  ...resto
}: {
  a: string
  children: ReactNode
  className?: string
  onClick?: () => void
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'>) {
  const { vai } = useRotta()
  return (
    <a
      href={a}
      className={className}
      onClick={(e) => {
        // Lascia passare ctrl/cmd-click e il tasto centrale: apertura in nuova scheda.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        onClick?.()
        vai(a)
      }}
      {...resto}
    >
      {children}
    </a>
  )
}
