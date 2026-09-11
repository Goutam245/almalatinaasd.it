/** Palette estratta pixel per pixel dal logo Alma Latina (francesco logo danza).
 *  Nessun colore inventato: ogni tinta qui sotto esiste nel file del logo. */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // --- tinte del logo ---
        magenta:   '#EB008C',
        rosa:      '#F460A5',
        rosso:     '#ED1C23',
        arancio:   '#F6931D',
        giallo:    '#FFF200',
        lime:      '#8CC63F',
        verde:     '#00A550',
        ciano:     '#00AEEF',
        azzurro:   '#69DBFF',
        indaco:    '#4D56CD',
        pervinca:  '#8285CD',
        // --- fondali derivati dal nero del logo #231F1F ---
        inchiostro: '#0B0B0F',
        carbone:    '#131319',
        grafite:    '#1C1C24',
        fumo:       '#2A2A34',   // superficie/bordo — MAI per il testo
        cenere:     '#7C7C90',   // testo terziario  — 4.7:1 su #0B0B0F
        nebbia:     '#9A9AAA',   // testo secondario — 7.0:1 su #0B0B0F
        panna:      '#F7F5F2',
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', 'Impact', 'Haettenschweiler', 'sans-serif'],
        serif:   ['"Instrument Serif"', 'Georgia', 'Times New Roman', 'serif'],
        sans:    ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: { contenuto: '1280px' },
      screens: { xs: '420px' },
      transitionTimingFunction: {
        onda: 'cubic-bezier(0.22, 1, 0.36, 1)',
        scatto: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      keyframes: {
        scorri: { '0%': { transform: 'translate3d(0,0,0)' }, '100%': { transform: 'translate3d(-50%,0,0)' } },
        pulsa:  { '0%,100%': { opacity: '1' }, '50%': { opacity: '.35' } },
        salta:  { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(6px)' } },
      },
      animation: {
        scorri: 'scorri 42s linear infinite',
        pulsa:  'pulsa 2.4s ease-in-out infinite',
        salta:  'salta 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
