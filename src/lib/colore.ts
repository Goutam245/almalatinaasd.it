/* Sceglie automaticamente inchiostro o bianco sopra una tinta del logo,
   in base alla luminanza relativa (WCAG). Serve alle etichette colorate
   dei corsi: il giallo #FFF200 vuole testo scuro, l'indaco #4D56CD lo
   vuole chiaro. Così ogni etichetta resta leggibile senza sceglierlo
   a mano tinta per tinta. */

const canale = (v: number) => {
  const c = v / 255
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

export function luminanza(hex: string): number {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return 0.2126 * canale(r) + 0.7152 * canale(g) + 0.0722 * canale(b)
}

const INCHIOSTRO = '#0B0B0F'
const BIANCO = '#FFFFFF'

/** Testo leggibile sopra `sfondo`. Sceglie sempre l'opzione col contrasto
 *  più alto fra inchiostro e bianco. */
export function testoSu(sfondo: string): string {
  const L = luminanza(sfondo)
  const conNero = (L + 0.05) / (luminanza(INCHIOSTRO) + 0.05)
  const conBianco = (1.0 + 0.05) / (L + 0.05)
  return conNero >= conBianco ? INCHIOSTRO : BIANCO
}
