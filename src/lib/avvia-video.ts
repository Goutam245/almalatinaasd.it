/* Avvio affidabile dei video di sfondo.

   Il problema che risolve: chiamare `play()` una volta sola al montaggio
   non basta. In quel momento il <source> può non essere ancora agganciato
   e la promessa viene rifiutata con AbortError — silenziosamente, perché
   l'errore va comunque ignorato. Risultato: il video resta fermo sul
   poster anche se il browser lo avrebbe permesso senza problemi.

   Qui si riprova a ogni occasione utile: quando i dati arrivano, quando
   la scheda torna in primo piano, al primo tocco. Tutti i video sono muti,
   quindi nessun browser ha motivo di bloccarli. */

export function avviaVideo(v: HTMLVideoElement): () => void {
  let vivo = true

  const prova = () => {
    if (!vivo || !v.paused) return
    const p = v.play()
    if (p && typeof p.catch === 'function') p.catch(() => {})
  }

  prova()

  // Il momento in cui il video è davvero pronto a partire.
  v.addEventListener('loadeddata', prova)
  v.addEventListener('canplay', prova)
  // Se il browser lo mette in pausa da solo (scheda in background), riparte.
  v.addEventListener('pause', prova)
  document.addEventListener('visibilitychange', prova)
  window.addEventListener('pointerdown', prova, { once: true })
  window.addEventListener('touchstart', prova, { once: true })

  return () => {
    vivo = false
    v.removeEventListener('loadeddata', prova)
    v.removeEventListener('canplay', prova)
    v.removeEventListener('pause', prova)
    document.removeEventListener('visibilitychange', prova)
    window.removeEventListener('pointerdown', prova)
    window.removeEventListener('touchstart', prova)
  }
}
