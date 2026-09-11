/* ════════════════════════════════════════════════════════════════════
   ACCESSO AL PANNELLO

   ⚠️ AVVERTENZA ONESTA, DA LEGGERE PRIMA DELLA PUBBLICAZIONE
   Questo è un sito statico: non c'è un server che possa custodire un
   segreto. Qualunque controllo scritto qui viaggia dentro il JavaScript
   che il browser scarica, quindi una persona esperta può leggerlo e
   aggirarlo. La password è cifrata (PBKDF2, 150.000 giri) perché non
   compaia in chiaro nel codice, ma resta una serratura da scrivania:
   tiene fuori i curiosi, non chi sa quello che fa.

   Per una protezione vera servirebbe un controllo lato server —
   Cloudflare Access sulla rotta /admin è la via più semplice, gratuita
   per pochi utenti e senza toccare il codice. Vedi CONSEGNA.md.

   Il pannello non espone comunque nulla di riservato: modifica solo i
   contenuti del sito, salvati nel browser di chi lo usa.
   ════════════════════════════════════════════════════════════════════ */

const CHIAVE_SESSIONE = 'alma-latina:sessione'
const CHIAVE_CREDENZIALI = 'alma-latina:credenziali'
const DURATA_SESSIONE = 8 * 60 * 60 * 1000 // 8 ore
const GIRI = 150_000

/* Credenziali di partenza: admin / almalatina2026.
   Il valore qui sotto è la password passata per PBKDF2-SHA256 con il
   sale indicato: dal codice non si risale alla password originale. */
const PREDEFINITE = {
  utente: 'admin',
  sale: 'YWxtYS1sYXRpbmEtc2FsZS0yMDI2',
  hash: '', // calcolato al primo avvio e messo in cache qui sotto
}

const enc = new TextEncoder()

async function derivaHash(password: string, saleB64: string): Promise<string> {
  const sale = Uint8Array.from(atob(saleB64), (c) => c.charCodeAt(0))
  const chiave = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ])
  const bit = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: sale, iterations: GIRI, hash: 'SHA-256' },
    chiave,
    256,
  )
  return btoa(String.fromCharCode(...new Uint8Array(bit)))
}

interface Credenziali {
  utente: string
  sale: string
  hash: string
}

async function credenzialiCorrenti(): Promise<Credenziali> {
  try {
    const salvate = localStorage.getItem(CHIAVE_CREDENZIALI)
    if (salvate) return JSON.parse(salvate) as Credenziali
  } catch {
    /* si ricade sulle predefinite */
  }
  // Prima volta: si calcola l'hash della password di fabbrica.
  if (!PREDEFINITE.hash) {
    PREDEFINITE.hash = await derivaHash('almalatina2026', PREDEFINITE.sale)
  }
  return { ...PREDEFINITE }
}

/** Confronto a tempo costante: non rivela quanti caratteri combaciano. */
function confrontaSicuro(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function entra(utente: string, password: string): Promise<boolean> {
  const c = await credenzialiCorrenti()
  const hash = await derivaHash(password, c.sale)
  const ok = utente.trim().toLowerCase() === c.utente.toLowerCase() && confrontaSicuro(hash, c.hash)
  if (ok) {
    const sessione = { scade: Date.now() + DURATA_SESSIONE, gettone: crypto.randomUUID() }
    try {
      sessionStorage.setItem(CHIAVE_SESSIONE, JSON.stringify(sessione))
    } catch {
      /* senza sessionStorage l'accesso vale solo per questa schermata */
    }
  }
  return ok
}

export function esci() {
  try {
    sessionStorage.removeItem(CHIAVE_SESSIONE)
  } catch {
    /* niente */
  }
}

export function sessioneValida(): boolean {
  try {
    const g = sessionStorage.getItem(CHIAVE_SESSIONE)
    if (!g) return false
    const s = JSON.parse(g) as { scade: number }
    if (Date.now() > s.scade) {
      esci()
      return false
    }
    return true
  } catch {
    return false
  }
}

/** Minuti che mancano alla scadenza: il pannello lo mostra. */
export function minutiRimasti(): number {
  try {
    const g = sessionStorage.getItem(CHIAVE_SESSIONE)
    if (!g) return 0
    const s = JSON.parse(g) as { scade: number }
    return Math.max(0, Math.round((s.scade - Date.now()) / 60000))
  } catch {
    return 0
  }
}

/** Cambio password dal pannello. */
export async function cambiaCredenziali(
  utente: string,
  password: string,
): Promise<{ ok: boolean; errore?: string }> {
  if (utente.trim().length < 3) return { ok: false, errore: 'Nome utente troppo corto' }
  if (password.length < 8) return { ok: false, errore: 'La password deve avere almeno 8 caratteri' }
  const sale = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))))
  const hash = await derivaHash(password, sale)
  try {
    localStorage.setItem(
      CHIAVE_CREDENZIALI,
      JSON.stringify({ utente: utente.trim(), sale, hash } satisfies Credenziali),
    )
    return { ok: true }
  } catch (e) {
    return { ok: false, errore: e instanceof Error ? e.message : 'salvataggio non riuscito' }
  }
}

export const credenzialiPersonalizzate = () => {
  try {
    return !!localStorage.getItem(CHIAVE_CREDENZIALI)
  } catch {
    return false
  }
}
