import { useCallback, useEffect } from 'react'
import { lazy, Suspense } from 'react'
import { Caricamento } from './components/Caricamento'
import { ProviderLente } from './components/Lente'
import { Testata } from './components/Testata'
import { PiePagina } from './components/PiePagina'
import { Home } from './pages/Home'
import { Cookie, NonTrovata, Privacy } from './pages/Legale'
import { Router, useRotta } from './lib/router'
import { ScrollTrigger } from './lib/movimento'

/* Il pannello si scarica solo quando serve: chi visita il sito non
   paga il peso di un'area che non aprirà mai. */
const Pannello = lazy(() => import('./admin/Pannello').then((m) => ({ default: m.Pannello })))

function Corpo() {
  const { percorso, vai } = useRotta()

  /* Il pannello vive fuori dal sito: niente testata, niente piè di
     pagina, niente animazioni della vetrina. */
  if (percorso === '/admin' || percorso.startsWith('/admin/')) {
    return (
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
            Carico il pannello…
          </div>
        }
      >
        <Pannello />
      </Suspense>
    )
  }

  /* Vale dalla home e da qualsiasi altra pagina. */
  const versoSezione = useCallback(
    (id: string) => {
      if (percorso === '/') {
        vai(`#${id}`)
      } else {
        vai('/')
        setTimeout(() => vai(`#${id}`), 90)
      }
    },
    [percorso, vai],
  )

  /* Cambiando pagina cambia l'altezza del documento: ScrollTrigger va
     ricalcolato, altrimenti le animazioni scattano nel punto sbagliato. */
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 220)
    return () => clearTimeout(t)
  }, [percorso])

  /* Titolo della scheda coerente con la pagina aperta. */
  useEffect(() => {
    const titoli: Record<string, string> = {
      '/': 'Alma Latina ASD — Scuola di danza e fitness',
      '/privacy': 'Informativa privacy — Alma Latina ASD',
      '/cookie': 'Cookie — Alma Latina ASD',
    }
    document.title = titoli[percorso] ?? 'Pagina non trovata — Alma Latina ASD'
  }, [percorso])

  return (
    <>
      <Caricamento />
      <Testata />
      {percorso === '/' && (
        <main id="contenuto">
          <Home versoSezione={versoSezione} />
        </main>
      )}
      {percorso === '/privacy' && <Privacy />}
      {percorso === '/cookie' && <Cookie />}
      {!['/', '/privacy', '/cookie'].includes(percorso) && <NonTrovata />}
      <PiePagina versoSezione={versoSezione} />
    </>
  )
}

export default function App() {
  return (
    <Router>
      <ProviderLente>
        <Corpo />
      </ProviderLente>
    </Router>
  )
}
