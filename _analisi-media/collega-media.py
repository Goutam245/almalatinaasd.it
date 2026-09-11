# Collega i componenti pubblici ai media caricati dal pannello.
# Un file caricato si scrive `media://<id>`: qui i componenti imparano a
# tradurlo nell'URL del blob. Sui percorsi normali non cambia nulla.
import io, os

os.chdir(os.path.join(os.path.dirname(__file__), '..'))

def patch(percorso, coppie, importa=None, dopo=None):
    s = io.open(percorso, encoding='utf-8').read()
    prima = s
    for vecchio, nuovo in coppie:
        s = s.replace(vecchio, nuovo)
    if importa and importa not in s and dopo and dopo in s:
        s = s.replace(dopo, dopo + '\n' + importa, 1)
    io.open(percorso, 'w', encoding='utf-8').write(s)
    print(('  modificato ' if s != prima else '  invariato  ') + percorso)

IMP = "import { eMedia, urlMedia } from '../data/archivio'"

# ── Immagine ──
patch('src/components/Immagine.tsx', [
    ("""  const [caricata, setCaricata] = useState(false)
  const voce = IMG[chiave]""",
     """  const [caricata, setCaricata] = useState(false)

  /* Foto caricata dal pannello: non sta nel manifest ma in IndexedDB.
     Si mostra diretta, senza varianti responsive. */
  if (eMedia(chiave)) {
    return (
      <div className={`relative overflow-hidden bg-carbone ${className}`}>
        <img
          src={urlMedia(chiave)}
          alt={alt}
          loading={priorita ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-cover"
          style={{ objectPosition: fuoco }}
        />
      </div>
    )
  }

  const voce = IMG[chiave]"""),
    ("""export function srcPiuGrande(chiave: string): string | null {
  const voce = IMG[chiave]""",
     """export function srcPiuGrande(chiave: string): string | null {
  if (eMedia(chiave)) return urlMedia(chiave)
  const voce = IMG[chiave]"""),
    ("export const lqipDi = (chiave: string) => IMG[chiave]?.lqip ?? null",
     "export const lqipDi = (chiave: string) => (eMedia(chiave) ? null : IMG[chiave]?.lqip ?? null)"),
], IMP, "import manifest from '../data/manifest.json'")

# ── VideoSfondo ──
patch('src/components/VideoSfondo.tsx', [
    ("style={{ backgroundImage: `url(${poster})`, backgroundPosition: oggetto }}",
     "style={{ backgroundImage: `url(${urlMedia(poster)})`, backgroundPosition: oggetto }}"),
    ("          poster={poster}", "          poster={urlMedia(poster)}"),
    ('<source src={file} type="video/mp4" />', '<source src={urlMedia(file)} type="video/mp4" />'),
], "import { urlMedia } from '../data/archivio'", "import { useEffect, useRef, useState } from 'react'")

# ── Lente ──
patch('src/components/Lente.tsx', [
    ("const percorsoVideo = (s: string) => (s.includes('/') ? `/${s}` : `/video/${s}`)",
     "const percorsoVideo = (s: string) =>\n  eMedia(s) ? urlMedia(s) : s.includes('/') ? `/${s}` : `/video/${s}`"),
    ("poster={voce.poster ? `/poster/${voce.poster}` : undefined}",
     "poster={\n                        voce.poster\n                          ? eMedia(voce.poster)\n                            ? urlMedia(voce.poster)\n                            : `/poster/${voce.poster}`\n                          : undefined\n                      }"),
], IMP, "import { lqipDi, srcPiuGrande } from './Immagine'")

# ── Galleria ──
patch('src/components/Galleria.tsx', [
    ("file={g.video!.includes('/') ? `/${g.video}` : `/video/${g.video}`}",
     "file={\n                      eMedia(g.video!)\n                        ? urlMedia(g.video!)\n                        : g.video!.includes('/')\n                          ? `/${g.video}`\n                          : `/video/${g.video}`\n                    }"),
    ("poster={`/poster/${g.poster}`}",
     "poster={eMedia(g.poster ?? '') ? urlMedia(g.poster!) : `/poster/${g.poster}`}"),
], IMP, "import { useRivela } from '../lib/movimento'")

# ── Corsi ──
patch('src/components/Corsi.tsx', [
    ('<source src={corso.video!.includes(\'/\') ? `/${corso.video}` : `/video/${corso.video}`} type="video/mp4" />',
     '<source\n                src={\n                  eMedia(corso.video!)\n                    ? urlMedia(corso.video!)\n                    : corso.video!.includes(\'/\')\n                      ? `/${corso.video}`\n                      : `/video/${corso.video}`\n                }\n                type="video/mp4"\n              />'),
    ("poster={`/poster/${corso.poster}`}",
     "poster={eMedia(corso.poster ?? '') ? urlMedia(corso.poster!) : `/poster/${corso.poster}`}"),
], IMP, "import { useRivela } from '../lib/movimento'")

# ── Vacugym: foto e volantino gestiti dal pannello ──
patch('src/components/Vacugym.tsx', [
    ("href={VACUGYM.pdf}", "href={urlMedia(VACUGYM.pdf)}"),
    ('chiave="cl-vacugym"', 'chiave={VACUGYM.foto}'),
    ('chiave="cl-vacugym-banner"', 'chiave={VACUGYM.fotoBanner}'),
    ("sorgente: 'cl-vacugym',", "sorgente: VACUGYM.foto,"),
    ("sorgente: 'cl-vacugym-banner',", "sorgente: VACUGYM.fotoBanner,"),
], "import { urlMedia } from '../data/archivio'", "import { useRivela } from '../lib/movimento'")

# ── La maestra ──
patch('src/components/LaMaestra.tsx', [
    ("sorgente: 'cl-maestra',", "sorgente: MAESTRA.foto,"),
    ('chiave="cl-maestra"', 'chiave={MAESTRA.foto}'),
])

# ── Riconoscimenti ──
patch('src/components/Qualifiche.tsx', [
    ("sorgente: 'cl-attestati',", "sorgente: QUALIFICHE.foto,"),
    ('chiave="cl-attestati"', 'chiave={QUALIFICHE.foto}'),
])

# ── nuovi campi media nei contenuti base ──
patch('src/data/contenuti-base.ts', [
    ("  cta: 'Prenota la tua seduta di prova gratuita',\n  pdf: '/doc/vacugym-roll-up.pdf',",
     "  cta: 'Prenota la tua seduta di prova gratuita',\n  foto: 'cl-vacugym',\n  fotoBanner: 'cl-vacugym-banner',\n  pdf: '/doc/vacugym-roll-up.pdf',"),
    ("  tappe: [\n    { anno: '2013', testo: 'Diploma di danza' },",
     "  foto: 'cl-maestra',\n  tappe: [\n    { anno: '2013', testo: 'Diploma di danza' },"),
    ("      'Alma Latina ASD è un’associazione sportiva dilettantistica riconosciuta, con insegnanti titolati. Gli attestati sono esposti in sala: qui sotto ci sono quelli che contano.',",
     "      'Alma Latina ASD è un’associazione sportiva dilettantistica riconosciuta, con insegnanti titolati. Gli attestati sono esposti in sala: qui sotto ci sono quelli che contano.',\n  foto: 'cl-attestati',"),
])

print('\nfatto.')
