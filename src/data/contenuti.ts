/* ════════════════════════════════════════════════════════════════════
   CONTENUTI — quello che il sito legge davvero.

   Prende i valori di partenza da `contenuti-base.ts` e ci sovrappone le
   modifiche salvate dal pannello di controllo (`/admin`).

   La fusione avviene UNA VOLTA, al caricamento del modulo, leggendo
   localStorage in modo sincrono: quando React disegna la prima
   schermata i testi giusti ci sono già, quindi non si vede prima il
   testo vecchio e poi quello nuovo.

   I componenti importano da qui esattamente come prima: nessuno di loro
   sa che esiste un pannello.
   ════════════════════════════════════════════════════════════════════ */

import * as base from './contenuti-base'
import { fondi, leggiModifiche } from './archivio'

const M = leggiModifiche()
const con = <T>(nome: string, valore: T): T => fondi(valore, M[nome])

/* ── tipi: restano quelli del file base ── */
export type { Corso, Famiglia } from './contenuti-base'

/* ── valori, con le modifiche del pannello già applicate ── */
export const SCUOLA = con('SCUOLA', base.SCUOLA)
export const CORSI = con('CORSI', base.CORSI)
export const DISCIPLINE = con('DISCIPLINE', base.DISCIPLINE)
export const MAESTRA = con('MAESTRA', base.MAESTRA)
export const QUALIFICHE = con('QUALIFICHE', base.QUALIFICHE)
export const VACUGYM = con('VACUGYM', base.VACUGYM)
export const CHI_SIAMO = con('CHI_SIAMO', base.CHI_SIAMO)
export const VOUCHER = con('VOUCHER', base.VOUCHER)
export const BANDA = con('BANDA', base.BANDA)
export const ASPETTATIVE = con('ASPETTATIVE', base.ASPETTATIVE)
export const GALLERIA = con('GALLERIA', base.GALLERIA)
export const CITAZIONE = con('CITAZIONE', base.CITAZIONE)
export const NAV = con('NAV', base.NAV)
export const CREDITO = con('CREDITO', base.CREDITO)

/* ── Copertina ──
   Nel file base il testo dell'hero è dentro il componente. Qui diventa
   contenuto modificabile, con gli stessi valori di prima come partenza. */
export const HERO = con('HERO', {
  occhiello: 'Scuola di danza e fitness',
  parole: ['Balla', 'con', 'noi'],
  sottotitolo:
    'Undici corsi fra danza e fitness, dalle danze latine al Pilates. Non serve saper ballare: si comincia con una prova.',
  pulsanteCorsi: 'Guarda i corsi',
  pulsanteProva: 'Prenota ora la tua prova',
  video: '/video/v01-hero-latin-couple.mp4',
  poster: '/poster/v01-hero.webp',
})

/* Il numero per WhatsApp può essere cambiato dal pannello: la funzione
   deve leggerlo da SCUOLA aggiornato, non dal file base. */
export const whatsappUrl = (testo = 'Ciao! Vorrei informazioni sui corsi di Alma Latina ASD.') =>
  `https://wa.me/${SCUOLA.telefonoTastiera.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(testo)}`

/* ── Contenuti completi, per il pannello ──
   Il pannello ha bisogno sia dei valori attuali sia di quelli di
   partenza, per poter mostrare «modificato» e offrire il ripristino. */
export const CONTENUTI_ATTUALI = {
  SCUOLA, CORSI, DISCIPLINE, MAESTRA, QUALIFICHE, VACUGYM, CHI_SIAMO,
  VOUCHER, BANDA, ASPETTATIVE, GALLERIA, CITAZIONE, NAV, CREDITO, HERO,
}

export const CONTENUTI_BASE = {
  SCUOLA: base.SCUOLA,
  CORSI: base.CORSI,
  DISCIPLINE: base.DISCIPLINE,
  MAESTRA: base.MAESTRA,
  QUALIFICHE: base.QUALIFICHE,
  VACUGYM: base.VACUGYM,
  CHI_SIAMO: base.CHI_SIAMO,
  VOUCHER: base.VOUCHER,
  BANDA: base.BANDA,
  ASPETTATIVE: base.ASPETTATIVE,
  GALLERIA: base.GALLERIA,
  CITAZIONE: base.CITAZIONE,
  NAV: base.NAV,
  CREDITO: base.CREDITO,
  HERO: {
    occhiello: 'Scuola di danza e fitness',
    parole: ['Balla', 'con', 'noi'],
    sottotitolo:
      'Undici corsi fra danza e fitness, dalle danze latine al Pilates. Non serve saper ballare: si comincia con una prova.',
    pulsanteCorsi: 'Guarda i corsi',
    pulsanteProva: 'Prenota ora la tua prova',
    video: '/video/v01-hero-latin-couple.mp4',
    poster: '/poster/v01-hero.webp',
  },
}
