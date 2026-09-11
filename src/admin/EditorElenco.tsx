/* EDITOR DEGLI ELENCHI — corsi e galleria.

   Aggiunge, toglie, riordina e modifica le singole voci.
   Il riordino si fa sia trascinando sia con le frecce: il trascinamento
   è comodo col mouse, le frecce funzionano da tastiera e sul telefono,
   dove trascinare è scomodo e poco preciso. */
import { useState } from 'react'
import type { Corso } from '../data/contenuti'
import { CampoColore, CampoRiga, CampoTesto, Bottone, BottoneIcona } from './ui'
import { SelettoreMedia } from './SelettoreMedia'

type VoceGalleria = {
  tipo: 'foto' | 'video'
  chiave: string
  didascalia: string
  disciplina: string
  titolo?: string
  testo?: string
  video?: string
  poster?: string
  span?: string
}

/* ─────────────── impalcatura comune (riordino + apri/chiudi) ─────────────── */

function Riga({
  indice,
  totale,
  titolo,
  sottotitolo,
  anteprima,
  aperta,
  onApri,
  onSposta,
  onElimina,
  onTrascina,
  children,
}: {
  indice: number
  totale: number
  titolo: string
  sottotitolo: string
  anteprima?: React.ReactNode
  aperta: boolean
  onApri: () => void
  onSposta: (d: -1 | 1) => void
  onElimina: () => void
  onTrascina: (da: number, a: number) => void
  children: React.ReactNode
}) {
  const [sopra, setSopra] = useState(false)

  return (
    <li
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', String(indice))}
      onDragOver={(e) => {
        e.preventDefault()
        setSopra(true)
      }}
      onDragLeave={() => setSopra(false)}
      onDrop={(e) => {
        e.preventDefault()
        setSopra(false)
        const da = parseInt(e.dataTransfer.getData('text/plain'), 10)
        if (!Number.isNaN(da) && da !== indice) onTrascina(da, indice)
      }}
      className={`rounded-lg border bg-slate-900/70 transition-colors
                  ${sopra ? 'border-fuchsia-500' : 'border-slate-800'}`}
    >
      <div className="flex items-center gap-3 p-2.5">
        <span
          aria-hidden="true"
          title="Trascina per riordinare"
          className="cursor-grab select-none px-1 text-slate-600 active:cursor-grabbing"
        >
          ⠿
        </span>

        {anteprima && (
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded border border-slate-700 bg-slate-950">
            {anteprima}
          </div>
        )}

        <button
          type="button"
          onClick={onApri}
          className="min-w-0 flex-1 text-left"
          aria-expanded={aperta}
        >
          <span className="block truncate text-[0.9rem] font-semibold text-slate-100">{titolo}</span>
          <span className="block truncate text-[0.76rem] text-slate-500">{sottotitolo}</span>
        </button>

        <div className="flex shrink-0 items-center gap-1">
          <BottoneIcona etichetta="Sposta su" onClick={() => onSposta(-1)} disabilitato={indice === 0}>
            ↑
          </BottoneIcona>
          <BottoneIcona
            etichetta="Sposta giù"
            onClick={() => onSposta(1)}
            disabilitato={indice === totale - 1}
          >
            ↓
          </BottoneIcona>
          <BottoneIcona etichetta={aperta ? 'Chiudi' : 'Modifica'} onClick={onApri}>
            {aperta ? '▲' : '✎'}
          </BottoneIcona>
          <BottoneIcona etichetta="Elimina" onClick={onElimina} pericolo>
            ×
          </BottoneIcona>
        </div>
      </div>

      {aperta && <div className="space-y-4 border-t border-slate-800 p-4">{children}</div>}
    </li>
  )
}

function riordina<T>(v: T[], da: number, a: number): T[] {
  const c = [...v]
  const [x] = c.splice(da, 1)
  c.splice(a, 0, x)
  return c
}

/* ─────────────────────────── CORSI ─────────────────────────── */

export function EditorCorsi({
  corsi,
  onCambia,
}: {
  corsi: Corso[]
  onCambia: (c: Corso[]) => void
}) {
  const [aperto, setAperto] = useState<number | null>(null)
  const agg = (i: number, patch: Partial<Corso>) =>
    onCambia(corsi.map((c, k) => (k === i ? { ...c, ...patch } : c)))

  return (
    <div>
      <ul className="space-y-2">
        {corsi.map((c, i) => (
          <Riga
            key={c.slug + i}
            indice={i}
            totale={corsi.length}
            titolo={c.nome || '(senza nome)'}
            sottotitolo={c.famiglia === 'danza' ? 'Danza' : 'Fitness'}
            anteprima={
              <div className="h-full w-full" style={{ background: c.colore }} aria-hidden="true" />
            }
            aperta={aperto === i}
            onApri={() => setAperto(aperto === i ? null : i)}
            onSposta={(d) => {
              const j = i + d
              if (j < 0 || j >= corsi.length) return
              onCambia(riordina(corsi, i, j))
              setAperto(null)
            }}
            onElimina={() => {
              if (confirm(`Eliminare il corso «${c.nome}»?`)) {
                onCambia(corsi.filter((_, k) => k !== i))
                setAperto(null)
              }
            }}
            onTrascina={(da, a) => {
              onCambia(riordina(corsi, da, a))
              setAperto(null)
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <CampoRiga etichetta="Nome del corso" valore={c.nome} onCambia={(v) => agg(i, { nome: v })} />
              <label className="block">
                <span className="mb-1.5 block text-[0.82rem] font-semibold text-slate-200">Famiglia</span>
                <select
                  value={c.famiglia}
                  onChange={(e) => agg(i, { famiglia: e.target.value as Corso['famiglia'] })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5
                             text-[0.92rem] text-slate-100 focus:border-fuchsia-500 focus:outline-none"
                >
                  <option value="danza">Danza</option>
                  <option value="fitness">Fitness</option>
                </select>
              </label>
            </div>

            <CampoColore etichetta="Colore" valore={c.colore} onCambia={(v) => agg(i, { colore: v })} />

            <CampoRiga
              etichetta="Nota breve (facoltativa)"
              valore={c.nota ?? ''}
              onCambia={(v) => agg(i, { nota: v || undefined })}
              aiuto="Riga piccola sotto il nome, es. «Sala pesi e cardio»."
            />

            <CampoTesto
              etichetta="Descrizione (facoltativa)"
              valore={c.descrizione ?? ''}
              onCambia={(v) => agg(i, { descrizione: v || undefined })}
              righe={3}
              aiuto="Compare sulla scheda del corso. Lascia vuoto se non serve."
            />

            <SelettoreMedia
              etichetta="Foto della scheda"
              valore={c.immagine}
              onCambia={(v) => agg(i, { immagine: v })}
              accetta="image/*"
            />

            <SelettoreMedia
              etichetta="Video della scheda (facoltativo)"
              valore={c.video ?? ''}
              onCambia={(v) => agg(i, { video: v || undefined })}
              accetta="video/*"
              aiuto="Parte al passaggio del mouse sulla scheda."
            />
          </Riga>
        ))}
      </ul>

      <Bottone
        className="mt-3"
        onClick={() => {
          onCambia([
            ...corsi,
            {
              slug: `corso-${Date.now().toString(36)}`,
              nome: 'Nuovo corso',
              famiglia: 'danza',
              colore: '#EB008C',
              immagine: '',
            },
          ])
          setAperto(corsi.length)
        }}
      >
        + Aggiungi corso
      </Bottone>
    </div>
  )
}

/* ─────────────────────────── GALLERIA ─────────────────────────── */

export function EditorGalleria({
  voci,
  onCambia,
}: {
  voci: VoceGalleria[]
  onCambia: (v: VoceGalleria[]) => void
}) {
  const [aperto, setAperto] = useState<number | null>(null)
  const agg = (i: number, patch: Partial<VoceGalleria>) =>
    onCambia(voci.map((v, k) => (k === i ? { ...v, ...patch } : v)))

  return (
    <div>
      <ul className="space-y-2">
        {voci.map((v, i) => (
          <Riga
            key={v.chiave + i}
            indice={i}
            totale={voci.length}
            titolo={v.titolo || v.didascalia || '(senza titolo)'}
            sottotitolo={v.tipo === 'video' ? 'Video' : 'Foto'}
            aperta={aperto === i}
            onApri={() => setAperto(aperto === i ? null : i)}
            onSposta={(d) => {
              const j = i + d
              if (j < 0 || j >= voci.length) return
              onCambia(riordina(voci, i, j))
              setAperto(null)
            }}
            onElimina={() => {
              if (confirm('Togliere questo elemento dalla galleria?')) {
                onCambia(voci.filter((_, k) => k !== i))
                setAperto(null)
              }
            }}
            onTrascina={(da, a) => {
              onCambia(riordina(voci, da, a))
              setAperto(null)
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[0.82rem] font-semibold text-slate-200">Tipo</span>
                <select
                  value={v.tipo}
                  onChange={(e) => agg(i, { tipo: e.target.value as 'foto' | 'video' })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5
                             text-[0.92rem] text-slate-100 focus:border-fuchsia-500 focus:outline-none"
                >
                  <option value="foto">Foto</option>
                  <option value="video">Video</option>
                </select>
              </label>
              <CampoRiga
                etichetta="Etichetta"
                valore={v.didascalia}
                onCambia={(x) => agg(i, { didascalia: x })}
                aiuto="La scritta sopra la tessera."
              />
            </div>

            {v.tipo === 'foto' ? (
              <SelettoreMedia
                etichetta="Foto"
                valore={v.chiave}
                onCambia={(x) => agg(i, { chiave: x })}
                accetta="image/*"
              />
            ) : (
              <>
                <SelettoreMedia
                  etichetta="Video"
                  valore={v.video ?? ''}
                  onCambia={(x) => agg(i, { video: x })}
                  accetta="video/*"
                />
                <SelettoreMedia
                  etichetta="Immagine di attesa"
                  valore={v.poster ?? ''}
                  onCambia={(x) => agg(i, { poster: x })}
                  accetta="image/*"
                />
              </>
            )}

            <CampoRiga
              etichetta="Titolo nella finestra"
              valore={v.titolo ?? ''}
              onCambia={(x) => agg(i, { titolo: x || undefined })}
              aiuto="Se vuoto usa il nome della disciplina."
            />
            <CampoTesto
              etichetta="Descrizione nella finestra"
              valore={v.testo ?? ''}
              onCambia={(x) => agg(i, { testo: x || undefined })}
              righe={3}
            />
            <CampoRiga
              etichetta="Disciplina collegata"
              valore={v.disciplina}
              onCambia={(x) => agg(i, { disciplina: x })}
              aiuto="Nome tecnico, es. hip-hop, salsa-e-bachata, saggio, sala."
            />
          </Riga>
        ))}
      </ul>

      <Bottone
        className="mt-3"
        onClick={() => {
          onCambia([
            ...voci,
            { tipo: 'foto', chiave: '', didascalia: 'Nuova foto', disciplina: 'sala' },
          ])
          setAperto(voci.length)
        }}
      >
        + Aggiungi elemento
      </Bottone>
    </div>
  )
}
