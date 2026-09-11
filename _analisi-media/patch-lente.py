# Rende cliccabili i media di Chi Siamo e Voucher, collegandoli alla lente.
import io, os, sys

BASE = os.path.join(os.path.dirname(__file__), '..')
sys.stdout.reconfigure(encoding='utf-8')


def leggi(rel):
    with io.open(os.path.join(BASE, rel), encoding='utf-8') as f:
        return f.read()


def scrivi(rel, s):
    with io.open(os.path.join(BASE, rel), 'w', encoding='utf-8') as f:
        f.write(s)


def sostituisci(s, vecchio, nuovo, etichetta):
    if vecchio not in s:
        print('  ! NON TROVATO:', etichetta)
        return s
    print('  ok:', etichetta)
    return s.replace(vecchio, nuovo, 1)


# ══════════════════ CHI SIAMO ══════════════════
print('ChiSiamo.tsx')
p = 'src/components/ChiSiamo.tsx'
s = leggi(p)

s = sostituisci(
    s,
    "import { useParallasse, useRivela } from '../lib/movimento'",
    "import { useParallasse, useRivela } from '../lib/movimento'\n"
    "import { useLente } from './Lente'\n"
    "import { DISCIPLINE } from '../data/contenuti'",
    'import lente',
)

s = sostituisci(
    s,
    "  const rifPar = useParallasse<HTMLDivElement>(9)",
    "  const rifPar = useParallasse<HTMLDivElement>(9)\n"
    "  const { apri } = useLente()\n"
    "  const latine = DISCIPLINE['danze-latine']\n"
    "  const classica = DISCIPLINE['danza-moderna-e-classica']\n"
    "  const salsa = DISCIPLINE['salsa-e-bachata']",
    'hook lente',
)

s = sostituisci(
    s,
    '              <figure className="relative col-span-5 aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-white/12 sm:col-span-3 sm:aspect-[4/5]">\n'
    '                <VideoSfondo',
    '              <figure className="group relative col-span-5 aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-white/12 sm:col-span-3 sm:aspect-[4/5]">\n'
    '                <button\n'
    '                  type="button"\n'
    '                  onClick={() =>\n'
    "                    apri({ tipo: 'video', sorgente: 'v10-latin-dance-1.mp4', poster: 'v10-orchestra.webp',\n"
    "                           etichetta: 'Musica dal vivo', titolo: latine.nome, testo: latine.testo, colore: latine.colore })\n"
    '                  }\n'
    '                  aria-label="Ingrandisci: musica dal vivo"\n'
    '                  className="absolute inset-0 z-20 cursor-zoom-in"\n'
    '                />\n'
    '                <VideoSfondo',
    'video orchestra cliccabile',
)

s = sostituisci(
    s,
    '                <figure className="relative aspect-square overflow-hidden rounded-2xl ring-1 ring-white/12 sm:aspect-[4/5]">\n'
    '                  <Immagine\n'
    '                    chiave="ballerina-giro"',
    '                <button\n'
    '                  type="button"\n'
    '                  onClick={() =>\n'
    "                    apri({ tipo: 'foto', sorgente: 'ballerina-giro', etichetta: 'Sala grande',\n"
    '                           titolo: classica.nome, testo: classica.testo, colore: classica.colore })\n'
    '                  }\n'
    '                  aria-label="Ingrandisci: ballerina nella sala grande"\n'
    '                  className="relative block aspect-square overflow-hidden rounded-2xl ring-1 ring-white/12\n'
    '                             transition-transform duration-500 ease-onda hover:-translate-y-1 sm:aspect-[4/5]"\n'
    '                >\n'
    '                  <Immagine\n'
    '                    chiave="ballerina-giro"',
    'foto ballerina cliccabile (apertura)',
)

s = sostituisci(
    s,
    '                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"\n'
    '                  />\n'
    '                </figure>\n'
    '                <figure className="relative aspect-square overflow-hidden rounded-2xl ring-1 ring-white/12 sm:aspect-[4/3]">\n'
    '                  <Immagine\n'
    '                    chiave="coppia-bianconero"',
    '                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"\n'
    '                  />\n'
    '                </button>\n'
    '                <button\n'
    '                  type="button"\n'
    '                  onClick={() =>\n'
    "                    apri({ tipo: 'foto', sorgente: 'coppia-bianconero', etichetta: 'Passo a due',\n"
    '                           titolo: salsa.nome, testo: salsa.testo, colore: salsa.colore })\n'
    '                  }\n'
    '                  aria-label="Ingrandisci: coppia di ballerini"\n'
    '                  className="relative block aspect-square overflow-hidden rounded-2xl ring-1 ring-white/12\n'
    '                             transition-transform duration-500 ease-onda hover:-translate-y-1 sm:aspect-[4/3]"\n'
    '                >\n'
    '                  <Immagine\n'
    '                    chiave="coppia-bianconero"',
    'foto bianconero cliccabile (chiusura + apertura)',
)

s = sostituisci(
    s,
    '                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"\n'
    '                  />\n'
    '                </figure>\n'
    '              </div>',
    '                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"\n'
    '                  />\n'
    '                </button>\n'
    '              </div>',
    'chiusura seconda foto',
)
scrivi(p, s)

# ══════════════════ VOUCHER ══════════════════
print('Voucher.tsx')
p = 'src/components/Voucher.tsx'
s = leggi(p)

s = sostituisci(
    s,
    "import { useRivela } from '../lib/movimento'",
    "import { useRivela } from '../lib/movimento'\n"
    "import { useLente } from './Lente'\n"
    "import { DISCIPLINE } from '../data/contenuti'",
    'import lente',
)

s = sostituisci(
    s,
    "  const rif = useRivela<HTMLElement>({ scaglione: 0.09 })",
    "  const rif = useRivela<HTMLElement>({ scaglione: 0.09 })\n"
    "  const { apri } = useLente()\n"
    "  const classica = DISCIPLINE['danza-moderna-e-classica']",
    'hook lente',
)

s = sostituisci(
    s,
    '            <figure className="relative col-span-3 aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-white/12">\n'
    '              <VideoSfondo',
    '            <figure className="group relative col-span-3 aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-white/12">\n'
    '              <button\n'
    '                type="button"\n'
    '                onClick={() =>\n'
    "                  apri({ tipo: 'video', sorgente: 'v06-dance-class-3.mp4', poster: 'v06-bambini.webp',\n"
    "                         etichetta: 'Corsi per bambini', titolo: classica.nome, testo: classica.testo, colore: classica.colore })\n"
    '                }\n'
    '                aria-label="Ingrandisci: corso per bambini"\n'
    '                className="absolute inset-0 z-20 cursor-zoom-in"\n'
    '              />\n'
    '              <VideoSfondo',
    'video bambini cliccabile',
)

s = sostituisci(
    s,
    '              <figure className="relative aspect-[3/4] flex-1 overflow-hidden rounded-2xl ring-1 ring-white/12">\n'
    '                <Immagine\n'
    '                  chiave="classe-bambine"',
    '              <button\n'
    '                type="button"\n'
    '                onClick={() =>\n'
    "                  apri({ tipo: 'foto', sorgente: 'classe-bambine', etichetta: 'Corso bambini',\n"
    '                         titolo: classica.nome, testo: classica.testo, colore: classica.colore })\n'
    '                }\n'
    '                aria-label="Ingrandisci: lezione per bambine"\n'
    '                className="relative block aspect-[3/4] flex-1 overflow-hidden rounded-2xl ring-1 ring-white/12\n'
    '                           transition-transform duration-500 ease-onda hover:-translate-y-1"\n'
    '              >\n'
    '                <Immagine\n'
    '                  chiave="classe-bambine"',
    'foto classe cliccabile (apertura)',
)

s = sostituisci(
    s,
    '                  sizes="(max-width: 1024px) 34vw, 20vw"\n'
    '                />\n'
    '              </figure>',
    '                  sizes="(max-width: 1024px) 34vw, 20vw"\n'
    '                />\n'
    '              </button>',
    'chiusura foto classe',
)
scrivi(p, s)
print('fatto')
