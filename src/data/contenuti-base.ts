/* ════════════════════════════════════════════════════════════════════════
   CONTENUTI BASE — i valori di partenza, scritti a mano.

   ⚠️ I componenti NON importano questo file: importano `contenuti.ts`,
   che ci sovrappone le modifiche salvate dal pannello di controllo.
   Qui si mette ciò che deve valere quando il pannello non ha ancora
   toccato nulla (e ciò a cui si torna con «ripristina»).

   FONTI AMMESSE: trascrizione della call · roll-up «FAI SPORT GRATIS» ·
   roll-up Vacugym · chat WhatsApp · materiale fotografico del cliente
   (parete attestati) · correzioni scritte del cliente del 10/09/2026.

   🚫 NESSUN PREZZO, in nessun punto del sito (richiesta esplicita:
      «mi serve una vetrina che mostra i corsi che faccio e nemmeno prezzi»).
   🚫 NESSUN INDIRIZZO: in call la sede legale è stata dichiarata incerta.
      Gli attestati appesi in sala ne riportano uno, ma finché non lo
      conferma il cliente non va in pagina.
   ════════════════════════════════════════════════════════════════════════ */

export const SCUOLA = {
  nome: 'Alma Latina',
  sigla: 'ASD',
  nomeCompleto: 'Alma Latina ASD',
  dominio: 'almalatinaasd.it',
  sito: 'https://www.almalatinaasd.it',
  telefono: '+39 349 5682356',
  telefonoTastiera: '+393495682356',
  social: {
    instagram: 'https://www.instagram.com/almalatinaasd/',
    facebook: 'https://www.facebook.com/almalatinaasd',
    tiktok: 'https://www.tiktok.com/@almalatina.asd',
    handleFbIg: '@almalatinaasd',
    handleTiktok: 'almalatina.asd',
  },
  /** DA_CONFERMARE — vedi nota in testa al file. */
  indirizzo: null as string | null,
  /** DA_CONFERMARE — indirizzo mail di destinazione del modulo contatti. */
  emailModulo: null as string | null,
}

/* whatsappUrl vive in `contenuti.ts`: deve leggere il numero aggiornato
   dal pannello, non quello scritto qui sotto. */

/* ─────────────────────────── CORSI ───────────────────────────
   Elenco aggiornato con le correzioni del cliente del 10/09/2026.
   Otto discipline di danza + tre voci fitness.
   Il Vacugym NON è più un corso: ha una sezione sua (vedi VACUGYM).
   ────────────────────────────────────────────────────────────── */

export type Famiglia = 'danza' | 'fitness'

export interface Corso {
  slug: string
  nome: string
  famiglia: Famiglia
  colore: string
  nota?: string
  /** DA_CONFERMARE — descrizioni della scuola, in attesa dal cliente. */
  descrizione?: string
  immagine: string
  video?: string
  poster?: string
  fuoco?: string
}

export const CORSI: Corso[] = [
  {
    slug: 'danze-latine-coreografici-team',
    nome: 'Danze latine coreografici team',
    famiglia: 'danza',
    colore: '#EB008C',
    immagine: 'tango-riflettore',
    fuoco: '58% 45%',
  },
  {
    slug: 'solo-latin',
    nome: 'Solo Latin',
    famiglia: 'danza',
    colore: '#F6931D',
    immagine: 'solista-punte',
    fuoco: '50% 40%',
  },
  {
    slug: 'coppie',
    nome: 'Coppie',
    famiglia: 'danza',
    colore: '#F460A5',
    immagine: 'salsa-orchestra',
    fuoco: '62% 48%',
  },
  {
    slug: 'hip-hop',
    nome: 'Hip Hop',
    famiglia: 'danza',
    colore: '#4D56CD',
    // Foto e video reali della scuola (saggio 2026).
    immagine: 'hh-riflettore',
    video: 'cliente/cv01.mp4',
    poster: 'cv01-hiphop.webp',
    fuoco: '50% 34%',
  },
  {
    slug: 'k-pop',
    nome: 'K-pop',
    famiglia: 'danza',
    colore: '#8285CD',
    immagine: 'cl-kpop-squadra',
    fuoco: '50% 38%',
  },
  {
    slug: 'danza-moderna-e-classica',
    nome: 'Danza moderna e classica',
    famiglia: 'danza',
    colore: '#69DBFF',
    immagine: 'cl-maestra',
    video: 'v03-stock-8933725.mp4',
    poster: 'v03-ballerina.webp',
    fuoco: '52% 34%',
  },
  {
    slug: 'salsa-e-bachata',
    nome: 'Salsa e Bachata',
    famiglia: 'danza',
    colore: '#ED1C23',
    immagine: 'salsa-giro',
    fuoco: '50% 44%',
  },
  {
    slug: 'balli-country',
    nome: 'Balli Country',
    famiglia: 'danza',
    colore: '#FFF200',
    immagine: 'sala-ballo-notturna',
    fuoco: '50% 50%',
  },
  {
    slug: 'percorso-fitness',
    nome: 'Percorso Fitness',
    famiglia: 'fitness',
    colore: '#8CC63F',
    immagine: 'gruppo-pavimento',
    video: 'cliente/cv02.mp4',
    poster: 'cv02-fitness.webp',
    fuoco: '50% 48%',
  },
  {
    slug: 'pilates',
    nome: 'Pilates',
    famiglia: 'fitness',
    colore: '#00A550',
    immagine: 'gruppo-specchi',
    video: 'cliente/cv03.mp4',
    poster: 'cv03-pilates.webp',
    fuoco: '50% 46%',
  },
  {
    slug: 'saletta-attrezzi',
    nome: 'Saletta Attrezzi',
    famiglia: 'fitness',
    colore: '#00AEEF',
    nota: 'Sala pesi e cardio con programmi personalizzati',
    immagine: 'cl-vacugym',
    fuoco: '58% 46%',
  },
]

/* ─────────────────────────── DISCIPLINE ───────────────────────────
   Descrizioni GENERALI di che cos'è ogni stile: servono alla scheda
   che si apre cliccando una foto. Non sono affermazioni sulla scuola —
   niente orari, niente livelli, niente prezzi.
   ─────────────────────────────────────────────────────────────────── */

export const DISCIPLINE: Record<string, { nome: string; colore: string; testo: string }> = {
  'danze-latine-coreografici-team': {
    nome: 'Danze latine coreografici team',
    colore: '#EB008C',
    testo:
      'Il coreografico di squadra prende le danze latine e le porta in formazione: stessi passi, stesso tempo, tutti insieme. Si lavora sulle figure, sugli spostamenti nello spazio e sulla sincronia, perché in scena a colpire è il gruppo che si muove come un corpo solo.',
  },
  'solo-latin': {
    nome: 'Solo Latin',
    colore: '#F6931D',
    testo:
      'Il Solo Latin prende i movimenti delle danze latine e li porta fuori dalla coppia. Si lavora su postura, giri, isolamenti e stile personale: la musica resta la stessa, cambia il fatto che il ritmo lo tiene il corpo da solo.',
  },
  coppie: {
    nome: 'Coppie',
    colore: '#F460A5',
    testo:
      'Ballare in due è una conversazione senza parole: uno propone, l’altro risponde. Si imparano la guida, il contatto e l’ascolto, quel meccanismo per cui due persone che si muovono insieme sembrano averlo deciso nello stesso istante.',
  },
  'hip-hop': {
    nome: 'Hip Hop',
    colore: '#4D56CD',
    testo:
      'L’Hip Hop nasce in strada e porta con sé quel modo di stare in piedi: ginocchia morbide, colpi netti, groove costante. Si impara una coreografia, ma soprattutto si impara a stare dentro il tempo con il proprio stile.',
  },
  'k-pop': {
    nome: 'K-pop',
    colore: '#8285CD',
    testo:
      'Il K-pop è danza da videoclip: coreografie precise, sincronizzate, pensate per essere guardate. Si studiano i passi originali dei brani, la pulizia dei movimenti e l’intesa con il gruppo, perché a colpire è l’insieme.',
  },
  'danza-moderna-e-classica': {
    nome: 'Danza moderna e classica',
    colore: '#69DBFF',
    testo:
      'La danza classica costruisce le fondamenta: sbarra, allineamento, controllo. La moderna prende quella tecnica e la porta a terra, nello spazio, dentro il respiro. Insieme danno un corpo che sa tenere una linea e anche romperla.',
  },
  'salsa-e-bachata': {
    nome: 'Salsa e Bachata',
    colore: '#ED1C23',
    testo:
      'Salsa e Bachata sono balli di coppia che vivono di contatto e di ascolto. La salsa è veloce, fatta di giri e cambi di direzione; la bachata è più lenta e vicina, tutta sul peso e sull’ondeggiare. Si imparano guida e risposta, a turno.',
  },
  'balli-country': {
    nome: 'Balli Country',
    colore: '#FFF200',
    testo:
      'I balli country si danzano in fila o in cerchio, sulle stesse sequenze ripetute da tutti. Non serve un partner: basta entrare nella linea e seguire il conteggio. È il modo più semplice per ballare in gruppo fin dalla prima sera.',
  },
  'percorso-fitness': {
    nome: 'Percorso Fitness',
    colore: '#8CC63F',
    testo:
      'Il percorso fitness lavora su fiato, forza e mobilità con esercizi a corpo libero, step e piccoli attrezzi, a ritmo di musica. È l’allenamento che sta dietro alla danza: gambe che reggono, schiena che tiene, respiro che non manca a metà brano.',
  },
  pilates: {
    nome: 'Pilates',
    colore: '#00A550',
    testo:
      'Il Pilates lavora dal centro verso fuori: addome, pavimento pelvico e schiena, con movimenti lenti e controllati sul tappetino. Pochi esercizi, fatti bene, che rimettono in ordine la postura e restituiscono mobilità alla colonna.',
  },
  'saletta-attrezzi': {
    nome: 'Saletta Attrezzi',
    colore: '#00AEEF',
    testo:
      'La saletta attrezzi è lo spazio per allenarsi con i macchinari, cardio e pesi, seguendo un programma costruito sulla persona. Sta accanto alle sale da ballo: si può usare come allenamento a sé o come supporto ai corsi di danza.',
  },
  saggio: {
    nome: 'Il saggio di fine anno',
    colore: '#EB008C',
    testo:
      'Una volta l’anno tutti i corsi salgono sullo stesso palco: bambini, ragazzi e adulti, dalle danze latine all’hip hop. È il momento in cui il lavoro fatto in sala prende luci, costumi e pubblico.',
  },
  sala: {
    nome: 'Le nostre sale',
    colore: '#8285CD',
    testo:
      'Sale ampie con parquet, specchi a parete e sbarre: lo spazio dove si prova, si sbaglia e si riprova. È qui che passano tutte le discipline, dal primo passo alla prova generale del saggio.',
  },
}

/* ─────────────────────────── LA MAESTRA ───────────────────────────
   Testo fornito integralmente dal cliente il 10/09/2026, riportato
   parola per parola. Il nome non è stato comunicato: DA_CONFERMARE.
   ─────────────────────────────────────────────────────────────────── */

export const MAESTRA = {
  occhiello: 'La maestra',
  titolo: 'Quattro anni,',
  titoloCorsivo: 'e non mi sono più fermata',
  // DA_CONFERMARE — nome e cognome dell'insegnante.
  paragrafi: [
    'La danza è stata la mia casa fin da quando avevo quattro anni. Da quel momento non mi sono più fermata, esplorando la danza classica, moderna e contemporanea in un percorso ininterrotto che mi ha portata a conseguire il diploma nel 2013.',
    'Nel frattempo la mia formazione si è arricchita con stage internazionali, esperienze in compagnia, concorsi e lezioni all’Accademia Nazionale di Danza di Roma.',
    'Dal 2015 ho iniziato a insegnare, senza però mai smettere di danzare e ballare in prima persona. Oggi, il mio mondo è in sala prove, amo condividere la mia passione ogni giorno, guidando allievi di tutte le età, dai bambini di quattro anni fino agli adulti, alla scoperta di quest’arte.',
  ],
  foto: 'cl-maestra',
  tappe: [
    { anno: '2013', testo: 'Diploma di danza' },
    { anno: '2015', testo: 'Primo anno d’insegnamento' },
    { anno: '4–99', testo: 'Età degli allievi in sala' },
  ],
}

/* ─────────────────────────── QUALIFICHE ───────────────────────────
   Riconoscimenti e titoli, letti dagli attestati esposti in sala e
   confermati per iscritto dal cliente. Sono fatti, non autoelogio.
   ─────────────────────────────────────────────────────────────────── */

export const QUALIFICHE = {
  occhiello: 'Riconoscimenti',
  titolo: 'Una scuola',
  titoloCorsivo: 'in regola',
  intro:
    'Alma Latina ASD è un’associazione sportiva dilettantistica riconosciuta, con insegnanti titolati. Gli attestati sono esposti in sala: qui sotto ci sono quelli che contano.',
  foto: 'cl-attestati',
  voci: [
    {
      titolo: 'Riconosciuta dal CONI',
      testo: 'Iscritta al Registro Nazionale delle Attività Sportive Dilettantistiche — Sport e Salute.',
      colore: '#EB008C',
      icona: 'coni',
    },
    {
      titolo: 'Laurea in Scienze Motorie',
      testo: 'Titolo universitario dell’insegnante responsabile dell’attività sportiva.',
      colore: '#00AEEF',
      icona: 'laurea',
    },
    {
      titolo: 'Diploma Maestri di Ballo',
      testo: 'Abilitazione all’insegnamento delle danze latino-americane e del coreographic team.',
      colore: '#F6931D',
      icona: 'diploma',
    },
    {
      titolo: 'Affiliazioni sportive',
      testo: 'CSEN e Centro Nazionale Sportivo Libertas, enti di promozione sportiva riconosciuti.',
      colore: '#8CC63F',
      icona: 'affiliazione',
    },
  ],
}

/* ─────────────────────────── VACUGYM ───────────────────────────
   Sezione a sé: NON è una disciplina di danza, è un macchinario.
   Testi presi dal roll-up ufficiale Vacugym del cliente.
   ⚠️ Il video promozionale fornito NON è utilizzabile: ha un prezzo
      impresso nei fotogrammi («PROMO LANCIO 100 EURO AL MESE») e il
      sito non deve mostrare prezzi.
   ──────────────────────────────────────────────────────────────── */

export const VACUGYM = {
  occhiello: 'Attrezzatura dedicata',
  titolo: 'Vacugym',
  sottotitolo: 'Non è un corso di ballo: è una macchina',
  paragrafi: [
    'Il Vacugym è un macchinario per l’allenamento a pressione negativa: si cammina all’interno della capsula mentre il sistema lavora sulla circolazione della parte inferiore del corpo.',
    'Sta nella saletta attrezzi della scuola, accanto alle sale da ballo, e si usa su appuntamento con un programma costruito sulla persona.',
  ],
  punti: [
    'Sedute da 30 minuti',
    'Programma personalizzato',
    'Su appuntamento',
  ],
  cta: 'Prenota la tua seduta di prova gratuita',
  foto: 'cl-vacugym',
  fotoBanner: 'cl-vacugym-banner',
  pdf: '/doc/vacugym-roll-up.pdf',
  pdfEtichetta: 'Scarica il volantino Vacugym (PDF)',
}

/* ─────────────────────────── CHI SIAMO ─────────────────────────── */

export const CHI_SIAMO = {
  occhiello: 'Chi siamo',
  titolo: 'Una sala, undici corsi,',
  titoloCorsivo: 'lo stesso indirizzo da quindici anni',
  paragrafi: [
    'Alma Latina ASD è una scuola di danza e fitness. Sotto lo stesso tetto convivono le danze latine e la saletta attrezzi, la danza classica e il Pilates, l’Hip Hop e il K-pop.',
    'Lo stesso indirizzo online, almalatinaasd.it, accompagna la scuola da oltre quindici anni. Cambia la veste, resta il posto dove chi balla sa di trovarci.',
    'Chi entra la prima volta non deve sapere già ballare. Si prenota una prova, si guarda una lezione, si decide dopo.',
  ],
  numeri: [
    { valore: '11', etichetta: 'corsi in programma' },
    { valore: '15+', etichetta: 'anni sullo stesso dominio' },
    { valore: '2', etichetta: 'voucher per fare sport gratis' },
  ],
}

/* ─────────────────────────── VOUCHER ─────────────────────────── */

export const VOUCHER = {
  occhiello: 'Convenzione Regione Campania',
  titolo: 'Fai sport gratis',
  sottotitolo: 'con il voucher Regione Campania',
  righe: [
    'Alma Latina è convenzionata con la Regione Campania: in base ai parametri ISEE si può presentare domanda e frequentare i corsi gratuitamente.',
    'A questo si aggiunge un secondo voucher, di origine governativa, pensato anch\'esso per far praticare sport ai ragazzi senza spesa.',
  ],
  cta: 'Verifica se hai diritto al voucher',
}

/* ─────────────────────────── BANDA CINEMATICA ─────────────────────────── */

export const BANDA = {
  parole: ['Il corpo', 'impara prima', 'della testa'],
  coda: 'Poi la testa segue, e diventa ballo.',
  appigli: [
    { titolo: 'Si comincia con una prova', testo: 'Prenoti, vieni a vedere, decidi dopo.' },
    { titolo: 'Danza e fitness insieme', testo: 'Undici corsi nella stessa sala.' },
    { titolo: 'Con il voucher si parte gratis', testo: 'Convenzione Regione Campania.' },
  ],
}

/* ─────────────────────────── GALLERIA ─────────────────────────── */

export const ASPETTATIVE = {
  titolo: 'Cosa aspettarti',
  testo:
    'Si entra, si guarda, si prova. La sala è la stessa per chi balla da anni e per chi non ha mai ballato: cambiano il gruppo e l’orario, non il posto.',
  voci: [
    {
      icona: 'prova',
      titolo: 'La prima volta è una prova',
      testo: 'Prenoti, vieni a vedere come si lavora e decidi con calma.',
      colore: '#EB008C',
    },
    {
      icona: 'gruppo',
      titolo: 'Gruppi per livello',
      testo: 'Dai principianti a chi balla da anni, bambini compresi.',
      colore: '#F6931D',
    },
    {
      icona: 'voucher',
      titolo: 'Il voucher vale anche qui',
      testo: 'Con la convenzione Regione Campania si frequenta gratis.',
      colore: '#FFF200',
    },
  ],
}

export const GALLERIA: Array<{
  tipo: 'foto' | 'video'
  chiave: string
  didascalia: string
  disciplina: string
  /** Titolo e testo specifici di QUESTA foto: se ci sono, hanno la
   *  precedenza sulla scheda generica della disciplina. */
  titolo?: string
  testo?: string
  video?: string
  poster?: string
  span?: string
}> = [
  /* ── Hip Hop: foto del saggio fornite dal cliente il 10/09/2026.
        Hanno sostituito le vecchie immagini della sezione Hip Hop. ── */
  {
    tipo: 'foto', chiave: 'hh-riflettore', disciplina: 'hip-hop',
    didascalia: 'Hip Hop', titolo: 'Assolo sotto il riflettore',
    testo: 'Un fascio di luce, il palco vuoto e un ballerino solo. Nell’hip hop l’assolo è il momento in cui lo stile personale conta più della coreografia: il tempo lo tiene il corpo.',
    span: 'lg:col-span-2 lg:row-span-2',
  },
  {
    tipo: 'foto', chiave: 'hh-duo-colori', disciplina: 'hip-hop',
    didascalia: 'Hip Hop', titolo: 'Botta e risposta',
    testo: 'Due ballerini si rispondono a distanza, uno alza il braccio e l’altro rilancia. È il gioco di chiamata e risposta che l’hip hop si porta dietro dalla strada, portato in scena.',
  },
  {
    tipo: 'foto', chiave: 'hh-duo-ginocchio', disciplina: 'hip-hop',
    didascalia: 'Hip Hop', titolo: 'A tempo, in due',
    testo: 'Stesso passo, stesso istante. Nel lavoro di coppia dell’hip hop la difficoltà non è il movimento in sé, ma farlo cadere esattamente sullo stesso colpo di musica.',
  },
  {
    tipo: 'foto', chiave: 'hh-terra', disciplina: 'hip-hop',
    didascalia: 'Hip Hop', titolo: 'Lavoro a terra',
    testo: 'Il pavimento è parte della danza: ci si appoggia, ci si scivola sopra, ci si rialza. Il lavoro a terra allena equilibrio e forza nelle braccia quanto nelle gambe.',
  },
  {
    tipo: 'foto', chiave: 'hh-solo-blu', disciplina: 'hip-hop',
    didascalia: 'Hip Hop', titolo: 'Il groove',
    testo: 'Ginocchia morbide, spalle sciolte, il peso che passa da un piede all’altro. Prima dei passi si impara il groove: senza quello, la coreografia resta solo una sequenza.',
  },
  {
    tipo: 'foto', chiave: 'hh-duo-bn', disciplina: 'hip-hop',
    didascalia: 'Hip Hop', titolo: 'Movimenti speculari',
    testo: 'Due corpi che disegnano la stessa figura ribaltata. È uno degli esercizi più severi del gruppo: basta un centimetro di scarto e l’effetto specchio si rompe.',
  },
  {
    tipo: 'foto', chiave: 'hh-cappello-bn', disciplina: 'hip-hop',
    didascalia: 'Hip Hop', titolo: 'Chi entra in scena',
    testo: 'Uno davanti, il gruppo che aspetta il proprio turno dietro. Nelle coreografie di squadra ogni ingresso è contato, e chi resta fermo lavora quanto chi balla.',
  },
  {
    tipo: 'foto', chiave: 'hh-gruppo-rosso', disciplina: 'hip-hop',
    didascalia: 'Hip Hop', titolo: 'Il gruppo in tuta rossa',
    testo: 'Braccia aperte a ventaglio da un unico corpo: le figure di gruppo si costruiscono per strati, con chi sta dietro che completa la sagoma di chi sta davanti.',
    span: 'lg:col-span-2',
  },

  // Materiale del cliente in testa: è la scuola vera.
  { tipo: 'video', chiave: 'cv05', didascalia: 'Il saggio', disciplina: 'saggio', video: 'cliente/cv05.mp4', poster: 'cv05-saggio.webp', span: 'lg:col-span-2 lg:row-span-2' },
  { tipo: 'foto',  chiave: 'cl-saggio-1', didascalia: 'Tutti in scena', disciplina: 'saggio' },
  { tipo: 'foto',  chiave: 'cl-kpop-squadra', didascalia: 'La squadra K-pop', disciplina: 'k-pop' },
  { tipo: 'video', chiave: 'cv01', didascalia: 'Hip Hop', disciplina: 'hip-hop',
    titolo: 'Prove in sala',
    testo: 'La stessa coreografia che poi va in scena, provata in sala davanti allo specchio. Si conta a voce, si ripete, si aggiusta: il palco arriva dopo settimane come questa.',
    video: 'cliente/cv01.mp4', poster: 'cv01-hiphop.webp' },
  { tipo: 'foto',  chiave: 'cl-saggio-2', didascalia: 'Finale', disciplina: 'saggio' },
  { tipo: 'video', chiave: 'cv02', didascalia: 'Percorso fitness', disciplina: 'percorso-fitness', video: 'cliente/cv02.mp4', poster: 'cv02-fitness.webp' },
  { tipo: 'foto',  chiave: 'cl-sala-1', didascalia: 'La sala grande', disciplina: 'sala' },
  { tipo: 'foto',  chiave: 'cl-saggio-4', didascalia: 'Sul palco', disciplina: 'saggio', span: 'lg:col-span-2' },
  { tipo: 'video', chiave: 'cv03', didascalia: 'Pilates', disciplina: 'pilates', video: 'cliente/cv03.mp4', poster: 'cv03-pilates.webp' },
  { tipo: 'foto',  chiave: 'cl-sala-sbarra', didascalia: 'La sbarra', disciplina: 'sala' },
  { tipo: 'video', chiave: 'cv06', didascalia: 'Applausi', disciplina: 'saggio', video: 'cliente/cv06.mp4', poster: 'cv06-saggio.webp' },
  { tipo: 'foto',  chiave: 'cl-saggio-5', didascalia: 'Il gruppo', disciplina: 'saggio' },
  { tipo: 'foto',  chiave: 'cl-sala-2', didascalia: 'Le colonne', disciplina: 'sala' },
  // Immagini di repertorio, a completare la griglia.
  { tipo: 'foto',  chiave: 'coppia-bianconero', didascalia: 'Passo a due', disciplina: 'coppie' },
  { tipo: 'foto',  chiave: 'salsa-giro', didascalia: 'Giro di salsa', disciplina: 'salsa-e-bachata' },
]

/* ─────────────────────────── CITAZIONE ─────────────────────────── */

export const CITAZIONE = {
  occhiello: 'Perché si balla',
  testo: 'Nessuno entra qui sapendo già ballare. Si entra per imparare, e si resta perché la sala diventa un posto dove tornare.',
  firma: 'Alma Latina ASD',
}

/* ─────────────────────────── NAVIGAZIONE ─────────────────────────── */

export const NAV = [
  { id: 'chi-siamo', etichetta: 'Chi siamo' },
  { id: 'corsi',     etichetta: 'Corsi' },
  { id: 'vacugym',   etichetta: 'Vacugym' },
  { id: 'voucher',   etichetta: 'Sport gratis' },
  { id: 'galleria',  etichetta: 'Galleria' },
  { id: 'contatti',  etichetta: 'Contatti' },
]

export const CREDITO = 'Sito realizzato da OnlinePerTutti.com'
