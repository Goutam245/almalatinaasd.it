/* ════════════════════════════════════════════════════════════════════
   ARCHIVIO — dove il pannello di controllo salva le modifiche.

   Due depositi separati, per un motivo pratico:

   · i TESTI stanno in localStorage. Sono pochi kilobyte, si leggono in
     modo sincrono e quindi la pagina può partire già con le modifiche
     applicate, senza sfarfallii.

   · le FOTO e i VIDEO caricati dal pannello stanno in IndexedDB. Un solo
     video riempirebbe da solo i ~5MB di localStorage; IndexedDB regge
     centinaia di megabyte e conserva i file come blob, senza gonfiarli
     del 33% come farebbe la codifica base64.

   Nei contenuti un file caricato si scrive `media://<id>`. Chi disegna
   la pagina non deve sapere altro: `urlMedia()` traduce l'id nell'URL
   temporaneo del blob.
   ════════════════════════════════════════════════════════════════════ */

const CHIAVE_TESTI = 'alma-latina:contenuti'
const DB_NOME = 'alma-latina-media'
const DB_DEPOSITO = 'file'
const DB_VERSIONE = 1

export const PREFISSO_MEDIA = 'media://'

/* ─────────────────────────── TESTI ─────────────────────────── */

export type Modifiche = Record<string, unknown>

export function leggiModifiche(): Modifiche {
  try {
    const grezzo = localStorage.getItem(CHIAVE_TESTI)
    return grezzo ? (JSON.parse(grezzo) as Modifiche) : {}
  } catch {
    // Modalità privata, quota piena o JSON corrotto: si riparte dai valori base.
    return {}
  }
}

export function scriviModifiche(m: Modifiche): { ok: boolean; errore?: string } {
  try {
    localStorage.setItem(CHIAVE_TESTI, JSON.stringify(m))
    return { ok: true }
  } catch (e) {
    return { ok: false, errore: e instanceof Error ? e.message : 'salvataggio non riuscito' }
  }
}

export function azzeraModifiche() {
  try {
    localStorage.removeItem(CHIAVE_TESTI)
  } catch {
    /* niente da fare */
  }
}

/** Fonde le modifiche sopra i valori base.
 *  Gli oggetti si fondono campo per campo; gli array vengono sostituiti
 *  per intero, perché su un elenco (corsi, galleria) il pannello lavora
 *  per aggiunte, rimozioni e riordini: fondere elemento per elemento
 *  darebbe risultati imprevedibili. */
export function fondi<T>(base: T, sopra: unknown): T {
  if (sopra === undefined || sopra === null) return base
  if (Array.isArray(base)) return sopra as T
  if (typeof base === 'object' && typeof sopra === 'object') {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) }
    for (const [k, v] of Object.entries(sopra as Record<string, unknown>)) {
      out[k] = k in out ? fondi((base as Record<string, unknown>)[k], v) : v
    }
    return out as T
  }
  return sopra as T
}

/* ─────────────────────────── MEDIA ─────────────────────────── */

export interface VoceMedia {
  id: string
  nome: string
  tipo: string // MIME
  peso: number
  creato: number
  blob: Blob
}

function apriDb(): Promise<IDBDatabase> {
  return new Promise((risolvi, rifiuta) => {
    const req = indexedDB.open(DB_NOME, DB_VERSIONE)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(DB_DEPOSITO)) {
        db.createObjectStore(DB_DEPOSITO, { keyPath: 'id' })
      }
    }
    req.onsuccess = () => risolvi(req.result)
    req.onerror = () => rifiuta(req.error)
  })
}

async function conDeposito<T>(
  modo: IDBTransactionMode,
  azione: (d: IDBObjectStore) => IDBRequest,
): Promise<T> {
  const db = await apriDb()
  return new Promise<T>((risolvi, rifiuta) => {
    const tx = db.transaction(DB_DEPOSITO, modo)
    const req = azione(tx.objectStore(DB_DEPOSITO))
    req.onsuccess = () => risolvi(req.result as T)
    req.onerror = () => rifiuta(req.error)
    tx.oncomplete = () => db.close()
  })
}

export const nuovoId = () =>
  `m${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`

export async function salvaMedia(file: File): Promise<VoceMedia> {
  const voce: VoceMedia = {
    id: nuovoId(),
    nome: file.name,
    tipo: file.type,
    peso: file.size,
    creato: Date.now(),
    blob: file,
  }
  await conDeposito('readwrite', (d) => d.put(voce))
  registraUrl(voce)
  return voce
}

export async function elencoMedia(): Promise<VoceMedia[]> {
  const tutti = await conDeposito<VoceMedia[]>('readonly', (d) => d.getAll())
  return (tutti ?? []).sort((a, b) => b.creato - a.creato)
}

export async function eliminaMedia(id: string) {
  await conDeposito('readwrite', (d) => d.delete(id))
  const url = urlPerId.get(id)
  if (url) {
    URL.revokeObjectURL(url)
    urlPerId.delete(id)
  }
}

/* ── Traduzione id → URL utilizzabile in <img> e <video> ──
   Gli URL dei blob si creano una volta sola e restano validi per tutta
   la vita della pagina. La mappa viene riempita da `preparaMedia()`
   PRIMA del primo disegno, così i componenti possono leggerla in modo
   sincrono e non serve un secondo giro di rendering. */
const urlPerId = new Map<string, string>()

function registraUrl(v: VoceMedia) {
  if (!urlPerId.has(v.id)) urlPerId.set(v.id, URL.createObjectURL(v.blob))
}

export async function preparaMedia() {
  try {
    const tutti = await elencoMedia()
    tutti.forEach(registraUrl)
  } catch {
    // Senza IndexedDB il sito mostra i media di partenza: nessun blocco.
  }
}

/** Se la stringa è un riferimento `media://`, restituisce l'URL del blob.
 *  Altrimenti restituisce la stringa così com'è (percorso normale). */
export function urlMedia(rif: string | undefined | null): string {
  if (!rif) return ''
  if (!rif.startsWith(PREFISSO_MEDIA)) return rif
  return urlPerId.get(rif.slice(PREFISSO_MEDIA.length)) ?? ''
}

export const eMedia = (rif: string | undefined | null): boolean =>
  !!rif && rif.startsWith(PREFISSO_MEDIA)

/* ─────────────────────── COPIA DI SICUREZZA ─────────────────────── */

export interface Backup {
  versione: 1
  creato: string
  contenuti: Modifiche
  media: Array<{ id: string; nome: string; tipo: string; dati: string }>
}

const blobInBase64 = (b: Blob): Promise<string> =>
  new Promise((risolvi, rifiuta) => {
    const l = new FileReader()
    l.onload = () => risolvi(String(l.result))
    l.onerror = () => rifiuta(l.error)
    l.readAsDataURL(b)
  })

export async function esportaBackup(): Promise<Backup> {
  const media = await elencoMedia()
  return {
    versione: 1,
    creato: new Date().toISOString(),
    contenuti: leggiModifiche(),
    media: await Promise.all(
      media.map(async (m) => ({
        id: m.id,
        nome: m.nome,
        tipo: m.tipo,
        dati: await blobInBase64(m.blob),
      })),
    ),
  }
}

const base64InBlob = async (d: string): Promise<Blob> => (await fetch(d)).blob()

export async function importaBackup(b: Backup) {
  if (!b || b.versione !== 1) throw new Error('File di backup non riconosciuto')
  scriviModifiche(b.contenuti ?? {})
  for (const m of b.media ?? []) {
    const blob = await base64InBlob(m.dati)
    const voce: VoceMedia = {
      id: m.id,
      nome: m.nome,
      tipo: m.tipo,
      peso: blob.size,
      creato: Date.now(),
      blob,
    }
    await conDeposito('readwrite', (d) => d.put(voce))
    registraUrl(voce)
  }
}

/** Spazio occupato, per mostrarlo nel pannello. */
export async function spazioUsato() {
  const media = await elencoMedia()
  const testi = new Blob([JSON.stringify(leggiModifiche())]).size
  return {
    testiByte: testi,
    mediaByte: media.reduce((s, m) => s + m.peso, 0),
    numeroMedia: media.length,
  }
}
