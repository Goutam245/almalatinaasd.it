/* Mappa di ciò che si può modificare dal pannello.

   Il pannello non conosce la struttura dei contenuti: legge questa mappa
   e costruisce i moduli da sola. Per rendere modificabile un testo nuovo
   basta aggiungere una riga qui — nessun componente da toccare. */

export type TipoCampo = 'riga' | 'testo' | 'elenco' | 'colore' | 'media'

export interface Campo {
  /** Percorso dentro i contenuti, es. "CHI_SIAMO.titolo" o "CORSI.3.nome". */
  percorso: string
  etichetta: string
  tipo: TipoCampo
  aiuto?: string
  /** Per i media: che tipo di file accetta. */
  accetta?: string
}

export interface Sezione {
  id: string
  nome: string
  icona: string
  /** Ancora della sezione sul sito pubblico, per l'anteprima. */
  ancora?: string
  descrizione: string
  campi: Campo[]
  /** Elenchi gestiti a parte (corsi, galleria): il pannello mostra un
   *  editor dedicato con aggiunta, rimozione e riordino. */
  elenco?: 'CORSI' | 'GALLERIA'
}

export const SEZIONI: Sezione[] = [
  {
    id: 'hero',
    nome: 'Copertina',
    icona: 'copertina',
    ancora: 'inizio',
    descrizione: 'La prima schermata: titolo grande, frase di presentazione e video di sfondo.',
    campi: [
      { percorso: 'HERO.occhiello', etichetta: 'Sopra-titolo', tipo: 'riga' },
      { percorso: 'HERO.parole', etichetta: 'Titolo (una riga per capoverso)', tipo: 'elenco',
        aiuto: 'Ogni riga diventa una riga del titolo. L’ultima è quella colorata.' },
      { percorso: 'HERO.sottotitolo', etichetta: 'Frase di presentazione', tipo: 'testo' },
      { percorso: 'HERO.pulsanteCorsi', etichetta: 'Testo del pulsante «corsi»', tipo: 'riga' },
      { percorso: 'HERO.pulsanteProva', etichetta: 'Testo del pulsante «prova»', tipo: 'riga' },
      { percorso: 'HERO.video', etichetta: 'Video di sfondo', tipo: 'media', accetta: 'video/*' },
      { percorso: 'HERO.poster', etichetta: 'Immagine di attesa del video', tipo: 'media', accetta: 'image/*' },
    ],
  },
  {
    id: 'chi-siamo',
    nome: 'Chi siamo',
    icona: 'scuola',
    ancora: 'chi-siamo',
    descrizione: 'Presentazione della scuola e i tre numeri in evidenza.',
    campi: [
      { percorso: 'CHI_SIAMO.occhiello', etichetta: 'Sopra-titolo', tipo: 'riga' },
      { percorso: 'CHI_SIAMO.titolo', etichetta: 'Titolo', tipo: 'riga' },
      { percorso: 'CHI_SIAMO.titoloCorsivo', etichetta: 'Titolo in corsivo', tipo: 'riga' },
      { percorso: 'CHI_SIAMO.paragrafi', etichetta: 'Paragrafi', tipo: 'elenco' },
    ],
  },
  {
    id: 'maestra',
    nome: 'La maestra',
    icona: 'persona',
    ancora: 'la-maestra',
    descrizione: 'Il racconto dell’insegnante e la sua fotografia.',
    campi: [
      { percorso: 'MAESTRA.occhiello', etichetta: 'Sopra-titolo', tipo: 'riga' },
      { percorso: 'MAESTRA.titolo', etichetta: 'Titolo', tipo: 'riga' },
      { percorso: 'MAESTRA.titoloCorsivo', etichetta: 'Titolo in corsivo', tipo: 'riga' },
      { percorso: 'MAESTRA.paragrafi', etichetta: 'Racconto (un paragrafo per riga)', tipo: 'elenco' },
      { percorso: 'MAESTRA.foto', etichetta: 'Fotografia', tipo: 'media', accetta: 'image/*' },
    ],
  },
  {
    id: 'corsi',
    nome: 'Corsi',
    icona: 'corsi',
    ancora: 'corsi',
    descrizione: 'I corsi in programma: nome, famiglia, colore, foto e descrizione.',
    campi: [],
    elenco: 'CORSI',
  },
  {
    id: 'vacugym',
    nome: 'Vacugym',
    icona: 'attrezzo',
    ancora: 'vacugym',
    descrizione: 'La sezione dedicata al macchinario, con foto e volantino PDF.',
    campi: [
      { percorso: 'VACUGYM.occhiello', etichetta: 'Sopra-titolo', tipo: 'riga' },
      { percorso: 'VACUGYM.titolo', etichetta: 'Titolo', tipo: 'riga' },
      { percorso: 'VACUGYM.sottotitolo', etichetta: 'Sottotitolo', tipo: 'riga' },
      { percorso: 'VACUGYM.paragrafi', etichetta: 'Paragrafi', tipo: 'elenco' },
      { percorso: 'VACUGYM.punti', etichetta: 'Punti elenco', tipo: 'elenco' },
      { percorso: 'VACUGYM.cta', etichetta: 'Testo del pulsante', tipo: 'riga' },
      { percorso: 'VACUGYM.foto', etichetta: 'Foto della macchina', tipo: 'media', accetta: 'image/*' },
      { percorso: 'VACUGYM.fotoBanner', etichetta: 'Foto del volantino', tipo: 'media', accetta: 'image/*' },
      { percorso: 'VACUGYM.pdf', etichetta: 'Volantino in PDF', tipo: 'media', accetta: 'application/pdf' },
    ],
  },
  {
    id: 'voucher',
    nome: 'Sport gratis',
    icona: 'voucher',
    ancora: 'voucher',
    descrizione: 'Il voucher della Regione Campania.',
    campi: [
      { percorso: 'VOUCHER.occhiello', etichetta: 'Sopra-titolo', tipo: 'riga' },
      { percorso: 'VOUCHER.titolo', etichetta: 'Titolo', tipo: 'riga' },
      { percorso: 'VOUCHER.sottotitolo', etichetta: 'Sottotitolo', tipo: 'riga' },
      { percorso: 'VOUCHER.righe', etichetta: 'Paragrafi', tipo: 'elenco' },
      { percorso: 'VOUCHER.cta', etichetta: 'Testo del pulsante', tipo: 'riga' },
    ],
  },
  {
    id: 'qualifiche',
    nome: 'Riconoscimenti',
    icona: 'medaglia',
    ancora: 'qualifiche',
    descrizione: 'CONI, laurea, diplomi e affiliazioni.',
    campi: [
      { percorso: 'QUALIFICHE.occhiello', etichetta: 'Sopra-titolo', tipo: 'riga' },
      { percorso: 'QUALIFICHE.titolo', etichetta: 'Titolo', tipo: 'riga' },
      { percorso: 'QUALIFICHE.titoloCorsivo', etichetta: 'Titolo in corsivo', tipo: 'riga' },
      { percorso: 'QUALIFICHE.intro', etichetta: 'Introduzione', tipo: 'testo' },
      { percorso: 'QUALIFICHE.foto', etichetta: 'Foto degli attestati', tipo: 'media', accetta: 'image/*' },
    ],
  },
  {
    id: 'galleria',
    nome: 'Galleria',
    icona: 'galleria',
    ancora: 'galleria',
    descrizione: 'Tutte le foto e i video della galleria: aggiungi, togli, riordina.',
    campi: [
      { percorso: 'ASPETTATIVE.titolo', etichetta: 'Titolo «cosa aspettarti»', tipo: 'riga' },
      { percorso: 'ASPETTATIVE.testo', etichetta: 'Testo «cosa aspettarti»', tipo: 'testo' },
    ],
    elenco: 'GALLERIA',
  },
  {
    id: 'citazione',
    nome: 'Citazione',
    icona: 'virgolette',
    descrizione: 'La frase in grande prima dei contatti.',
    campi: [
      { percorso: 'CITAZIONE.occhiello', etichetta: 'Sopra-titolo', tipo: 'riga' },
      { percorso: 'CITAZIONE.testo', etichetta: 'Frase', tipo: 'testo' },
      { percorso: 'CITAZIONE.firma', etichetta: 'Firma', tipo: 'riga' },
    ],
  },
  {
    id: 'contatti',
    nome: 'Contatti',
    icona: 'contatti',
    ancora: 'contatti',
    descrizione: 'Telefono, WhatsApp, social e indirizzo.',
    campi: [
      { percorso: 'SCUOLA.telefono', etichetta: 'Telefono mostrato', tipo: 'riga',
        aiuto: 'Come appare sul sito, es. +39 349 5682356' },
      { percorso: 'SCUOLA.telefonoTastiera', etichetta: 'Numero per WhatsApp', tipo: 'riga',
        aiuto: 'Solo cifre con il prefisso, es. +393495682356' },
      { percorso: 'SCUOLA.social.instagram', etichetta: 'Instagram (indirizzo)', tipo: 'riga' },
      { percorso: 'SCUOLA.social.facebook', etichetta: 'Facebook (indirizzo)', tipo: 'riga' },
      { percorso: 'SCUOLA.social.tiktok', etichetta: 'TikTok (indirizzo)', tipo: 'riga' },
      { percorso: 'SCUOLA.social.handleFbIg', etichetta: 'Nome utente Facebook/Instagram', tipo: 'riga' },
      { percorso: 'SCUOLA.social.handleTiktok', etichetta: 'Nome utente TikTok', tipo: 'riga' },
      { percorso: 'SCUOLA.indirizzo', etichetta: 'Indirizzo della sede', tipo: 'riga',
        aiuto: 'Lascia vuoto per non mostrarlo. Compare nei contatti e nel piè di pagina.' },
      { percorso: 'SCUOLA.emailModulo', etichetta: 'E-mail che riceve il modulo', tipo: 'riga',
        aiuto: 'Finché è vuota, le richieste del modulo vengono inoltrate su WhatsApp.' },
    ],
  },
]

/* ── lettura e scrittura per percorso ── */

export function leggiPercorso(radice: unknown, percorso: string): unknown {
  return percorso.split('.').reduce<unknown>((acc, p) => {
    if (acc === null || acc === undefined) return undefined
    return (acc as Record<string, unknown>)[p]
  }, radice)
}

/** Scrive il valore creando i livelli mancanti, senza mutare l'originale. */
export function scriviPercorso<T extends Record<string, unknown>>(
  radice: T,
  percorso: string,
  valore: unknown,
): T {
  const parti = percorso.split('.')
  const copia: Record<string, unknown> = { ...radice }
  let punto = copia
  for (let i = 0; i < parti.length - 1; i++) {
    const p = parti[i]
    const attuale = punto[p]
    punto[p] = Array.isArray(attuale) ? [...attuale] : { ...(attuale as object) }
    punto = punto[p] as Record<string, unknown>
  }
  punto[parti[parti.length - 1]] = valore
  return copia as T
}
