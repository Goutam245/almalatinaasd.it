import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { preparaMedia } from './data/archivio'

const radice = document.getElementById('root')!

/* I file caricati dal pannello vivono in IndexedDB, che si legge solo in
   modo asincrono. Si preparano PRIMA di disegnare, così i componenti
   possono chiedere l'URL di un media in modo sincrono e non si vede il
   sito prima con le foto vecchie e poi con quelle nuove.

   Se IndexedDB non è disponibile (finestra privata, browser vecchio) si
   disegna comunque: il sito mostra i media originali. */
preparaMedia().finally(() => {
  // Il segnaposto dell'hero sparisce solo ora: niente schermo vuoto.
  radice.innerHTML = ''
  createRoot(radice).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
