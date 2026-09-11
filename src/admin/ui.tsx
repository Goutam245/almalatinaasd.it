/* Pezzi di interfaccia condivisi dal pannello.
   Volutamente sobri: il pannello deve essere leggibile e prevedibile,
   non spettacolare come il sito pubblico. */
import type { ReactNode } from 'react'

/* ─────────────────────────── campi ─────────────────────────── */

export function CampoRiga({
  etichetta,
  valore,
  onCambia,
  aiuto,
  tipo = 'text',
  segnaposto,
}: {
  etichetta: string
  valore: string
  onCambia: (v: string) => void
  aiuto?: string
  tipo?: string
  segnaposto?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.82rem] font-semibold text-slate-200">{etichetta}</span>
      <input
        type={tipo}
        value={valore}
        placeholder={segnaposto}
        onChange={(e) => onCambia(e.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-[0.92rem]
                   text-slate-100 placeholder:text-slate-600 transition-colors
                   focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500/40"
      />
      {aiuto && <span className="mt-1 block text-[0.76rem] leading-snug text-slate-500">{aiuto}</span>}
    </label>
  )
}

export function CampoTesto({
  etichetta,
  valore,
  onCambia,
  aiuto,
  righe = 4,
}: {
  etichetta: string
  valore: string
  onCambia: (v: string) => void
  aiuto?: string
  righe?: number
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between text-[0.82rem] font-semibold text-slate-200">
        {etichetta}
        <span className="font-normal tabular-nums text-slate-500">{valore.length} caratteri</span>
      </span>
      <textarea
        rows={righe}
        value={valore}
        onChange={(e) => onCambia(e.target.value)}
        className="w-full resize-y rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5
                   text-[0.92rem] leading-relaxed text-slate-100 transition-colors
                   focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500/40"
      />
      {aiuto && <span className="mt-1 block text-[0.76rem] leading-snug text-slate-500">{aiuto}</span>}
    </label>
  )
}

/** Elenco di righe di testo: paragrafi, punti elenco, righe di titolo. */
export function CampoElenco({
  etichetta,
  valori,
  onCambia,
  aiuto,
}: {
  etichetta: string
  valori: string[]
  onCambia: (v: string[]) => void
  aiuto?: string
}) {
  const cambia = (i: number, v: string) => onCambia(valori.map((x, k) => (k === i ? v : x)))
  const togli = (i: number) => onCambia(valori.filter((_, k) => k !== i))
  const sposta = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= valori.length) return
    const c = [...valori]
    ;[c[i], c[j]] = [c[j], c[i]]
    onCambia(c)
  }

  return (
    <div>
      <span className="mb-1.5 block text-[0.82rem] font-semibold text-slate-200">{etichetta}</span>
      <div className="space-y-2">
        {valori.map((v, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-2.5 w-5 shrink-0 text-right text-[0.72rem] tabular-nums text-slate-600">
              {i + 1}
            </span>
            <textarea
              rows={Math.min(5, Math.max(1, Math.ceil(v.length / 60)))}
              value={v}
              onChange={(e) => cambia(i, e.target.value)}
              className="min-w-0 flex-1 resize-y rounded-lg border border-slate-700 bg-slate-900 px-3 py-2
                         text-[0.9rem] leading-relaxed text-slate-100 transition-colors
                         focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500/40"
            />
            <div className="flex shrink-0 flex-col gap-1">
              <BottoneIcona etichetta="Sposta su" onClick={() => sposta(i, -1)} disabilitato={i === 0}>
                ↑
              </BottoneIcona>
              <BottoneIcona
                etichetta="Sposta giù"
                onClick={() => sposta(i, 1)}
                disabilitato={i === valori.length - 1}
              >
                ↓
              </BottoneIcona>
              <BottoneIcona etichetta="Elimina" onClick={() => togli(i)} pericolo>
                ×
              </BottoneIcona>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onCambia([...valori, ''])}
        className="mt-2 rounded-lg border border-dashed border-slate-600 px-3 py-2 text-[0.82rem]
                   font-medium text-slate-300 transition-colors hover:border-fuchsia-500 hover:text-white"
      >
        + Aggiungi riga
      </button>
      {aiuto && <span className="mt-1.5 block text-[0.76rem] leading-snug text-slate-500">{aiuto}</span>}
    </div>
  )
}

export function CampoColore({
  etichetta,
  valore,
  onCambia,
}: {
  etichetta: string
  valore: string
  onCambia: (v: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.82rem] font-semibold text-slate-200">{etichetta}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={valore}
          onChange={(e) => onCambia(e.target.value)}
          className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-slate-700 bg-slate-900 p-1"
        />
        <input
          type="text"
          value={valore}
          onChange={(e) => onCambia(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5
                     font-mono text-[0.86rem] uppercase text-slate-100 focus:border-fuchsia-500 focus:outline-none"
        />
      </div>
    </label>
  )
}

/* ─────────────────────────── pulsanti ─────────────────────────── */

export function Bottone({
  children,
  onClick,
  variante = 'normale',
  tipo = 'button',
  disabilitato,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  variante?: 'primario' | 'normale' | 'pericolo' | 'fantasma'
  tipo?: 'button' | 'submit'
  disabilitato?: boolean
  className?: string
}) {
  const stili: Record<string, string> = {
    primario:
      'bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white hover:brightness-110 shadow-lg shadow-fuchsia-900/30',
    normale: 'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700',
    pericolo: 'bg-red-950 text-red-200 hover:bg-red-900 border border-red-900/60',
    fantasma: 'text-slate-300 hover:text-white hover:bg-slate-800',
  }
  return (
    <button
      type={tipo}
      onClick={onClick}
      disabled={disabilitato}
      className={`inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg px-4 py-2
                  text-[0.88rem] font-semibold transition-all disabled:cursor-not-allowed
                  disabled:opacity-40 ${stili[variante]} ${className}`}
    >
      {children}
    </button>
  )
}

export function BottoneIcona({
  children,
  onClick,
  etichetta,
  disabilitato,
  pericolo,
}: {
  children: ReactNode
  onClick: () => void
  etichetta: string
  disabilitato?: boolean
  pericolo?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabilitato}
      aria-label={etichetta}
      title={etichetta}
      className={`flex h-7 w-7 items-center justify-center rounded border text-sm leading-none
                  transition-colors disabled:opacity-25
                  ${pericolo
                    ? 'border-red-900/60 bg-red-950/60 text-red-300 hover:bg-red-900'
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
    >
      {children}
    </button>
  )
}

/* ─────────────────────────── contenitori ─────────────────────────── */

export function Scheda({
  titolo,
  sottotitolo,
  children,
  azione,
}: {
  titolo?: string
  sottotitolo?: string
  children: ReactNode
  azione?: ReactNode
}) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
      {(titolo || azione) && (
        <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            {titolo && <h2 className="text-[1.02rem] font-bold text-white">{titolo}</h2>}
            {sottotitolo && (
              <p className="mt-1 max-w-[70ch] text-[0.84rem] leading-relaxed text-slate-400">
                {sottotitolo}
              </p>
            )}
          </div>
          {azione}
        </header>
      )}
      {children}
    </section>
  )
}

export function Avviso({
  tono = 'info',
  children,
}: {
  tono?: 'info' | 'ok' | 'attenzione' | 'errore'
  children: ReactNode
}) {
  const stili: Record<string, string> = {
    info: 'border-sky-900/70 bg-sky-950/50 text-sky-200',
    ok: 'border-emerald-900/70 bg-emerald-950/50 text-emerald-200',
    attenzione: 'border-amber-900/70 bg-amber-950/50 text-amber-200',
    errore: 'border-red-900/70 bg-red-950/50 text-red-200',
  }
  return (
    <div className={`rounded-lg border px-4 py-3 text-[0.86rem] leading-relaxed ${stili[tono]}`}>
      {children}
    </div>
  )
}

export const pesoLeggibile = (b: number) =>
  b < 1024 ? `${b} B` : b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1048576).toFixed(1)} MB`
