/* ════════════════════════════════════════════════════════════════════
   PANNELLO DI CONTROLLO — /admin

   Come funziona il salvataggio:
   · le modifiche si accumulano in memoria mentre si lavora (bozza);
   · «Salva» le scrive in localStorage e ricarica l'anteprima;
   · il sito pubblico le legge al caricamento successivo.

   Chi lavora vede sempre se ci sono modifiche non salvate, e il browser
   avvisa prima di chiudere la scheda con del lavoro in sospeso.
   ════════════════════════════════════════════════════════════════════ */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CONTENUTI_ATTUALI, CONTENUTI_BASE } from '../data/contenuti'
import {
  azzeraModifiche,
  esportaBackup,
  importaBackup,
  leggiModifiche,
  scriviModifiche,
  spazioUsato,
  type Modifiche,
} from '../data/archivio'
import { SEZIONI, leggiPercorso, scriviPercorso, type Campo } from './campi'
import { cambiaCredenziali, credenzialiPersonalizzate, entra, esci, minutiRimasti, sessioneValida } from './accesso'
import { Avviso, Bottone, CampoElenco, CampoRiga, CampoTesto, Scheda, pesoLeggibile } from './ui'
import { SelettoreMedia } from './SelettoreMedia'
import { EditorCorsi, EditorGalleria } from './EditorElenco'

/* ═══════════════════════ ACCESSO ═══════════════════════ */

function Accesso({ onEntrato }: { onEntrato: () => void }) {
  const [utente, setUtente] = useState('')
  const [password, setPassword] = useState('')
  const [errore, setErrore] = useState('')
  const [attesa, setAttesa] = useState(false)

  async function invia(e: React.FormEvent) {
    e.preventDefault()
    setErrore('')
    setAttesa(true)
    try {
      const ok = await entra(utente, password)
      if (ok) onEntrato()
      else setErrore('Nome utente o password non corretti.')
    } catch {
      setErrore('Accesso non riuscito. Riprova.')
    } finally {
      setAttesa(false)
      setPassword('')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-5">
      <form
        onSubmit={invia}
        className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <img
            src="/logo/marchio-quadrato.webp"
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 rounded-lg object-cover ring-1 ring-white/20"
          />
          <div>
            <h1 className="text-lg font-bold leading-tight text-white">Alma Latina</h1>
            <p className="text-[0.76rem] uppercase tracking-widest text-slate-500">
              Pannello di controllo
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <CampoRiga etichetta="Nome utente" valore={utente} onCambia={setUtente} segnaposto="admin" />
          <CampoRiga
            etichetta="Password"
            tipo="password"
            valore={password}
            onCambia={setPassword}
            segnaposto="••••••••"
          />
        </div>

        {errore && (
          <div className="mt-4">
            <Avviso tono="errore">{errore}</Avviso>
          </div>
        )}

        <Bottone tipo="submit" variante="primario" className="mt-6 w-full" disabilitato={attesa}>
          {attesa ? 'Verifico…' : 'Entra'}
        </Bottone>

        <p className="mt-5 text-center text-[0.74rem] leading-relaxed text-slate-600">
          Da qui si modificano testi, foto e video del sito.
          <br />
          <a href="/" className="underline hover:text-slate-400">
            Torna al sito
          </a>
        </p>
      </form>
    </main>
  )
}

/* ═══════════════════════ ANTEPRIMA ═══════════════════════ */

function Anteprima({
  ancora,
  ricarica,
}: {
  ancora?: string
  ricarica: number
}) {
  const rif = useRef<HTMLIFrameElement>(null)
  const src = `/${ancora ? `#${ancora}` : ''}`

  useEffect(() => {
    /* Il numero di versione va nella QUERY, prima del cancelletto.
       Se sta dopo il cancelletto cambia solo il frammento: il riquadro
       scorre ma non ricarica, e continuerebbe a mostrare i testi vecchi. */
    if (rif.current) {
      rif.current.src = `/?v=${ricarica}${ancora ? `#${ancora}` : ''}`
    }
  }, [ricarica, ancora])

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 px-3 py-2">
        <span className="text-[0.76rem] font-semibold text-slate-400">Anteprima dal vivo</span>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[0.74rem] text-slate-500 underline hover:text-slate-300"
        >
          apri in una scheda
        </a>
      </div>
      <iframe
        ref={rif}
        title="Anteprima del sito"
        src={src}
        className="h-[62vh] w-full border-0 bg-white lg:h-[70vh]"
      />
    </div>
  )
}

/* ═══════════════════════ EDITOR DI UNA SEZIONE ═══════════════════════ */

function CampoAuto({
  campo,
  valore,
  onCambia,
}: {
  campo: Campo
  valore: unknown
  onCambia: (v: unknown) => void
}) {
  switch (campo.tipo) {
    case 'testo':
      return (
        <CampoTesto
          etichetta={campo.etichetta}
          valore={String(valore ?? '')}
          onCambia={onCambia}
          aiuto={campo.aiuto}
        />
      )
    case 'elenco':
      return (
        <CampoElenco
          etichetta={campo.etichetta}
          valori={Array.isArray(valore) ? (valore as string[]) : []}
          onCambia={onCambia}
          aiuto={campo.aiuto}
        />
      )
    case 'media':
      return (
        <SelettoreMedia
          etichetta={campo.etichetta}
          valore={String(valore ?? '')}
          onCambia={onCambia}
          accetta={campo.accetta}
          aiuto={campo.aiuto}
        />
      )
    default:
      return (
        <CampoRiga
          etichetta={campo.etichetta}
          valore={String(valore ?? '')}
          onCambia={onCambia}
          aiuto={campo.aiuto}
        />
      )
  }
}

/* ═══════════════════════ IMPOSTAZIONI ═══════════════════════ */

function Impostazioni({ onRipristina }: { onRipristina: () => void }) {
  const [utente, setUtente] = useState('admin')
  const [pw1, setPw1] = useState('')
  const [pw2, setPw2] = useState('')
  const [esito, setEsito] = useState<{ tono: 'ok' | 'errore'; testo: string } | null>(null)
  const [spazio, setSpazio] = useState({ testiByte: 0, mediaByte: 0, numeroMedia: 0 })
  const rifFile = useRef<HTMLInputElement>(null)

  useEffect(() => {
    spazioUsato().then(setSpazio).catch(() => {})
  }, [])

  async function salvaCredenziali(e: React.FormEvent) {
    e.preventDefault()
    if (pw1 !== pw2) {
      setEsito({ tono: 'errore', testo: 'Le due password non coincidono.' })
      return
    }
    const r = await cambiaCredenziali(utente, pw1)
    setEsito(
      r.ok
        ? { tono: 'ok', testo: 'Credenziali aggiornate. Valgono dal prossimo accesso.' }
        : { tono: 'errore', testo: r.errore ?? 'Non riuscito.' },
    )
    if (r.ok) {
      setPw1('')
      setPw2('')
    }
  }

  async function scarica() {
    const b = await esportaBackup()
    const url = URL.createObjectURL(new Blob([JSON.stringify(b)], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `alma-latina-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function ripristina(file: File | undefined) {
    if (!file) return
    try {
      await importaBackup(JSON.parse(await file.text()))
      setEsito({ tono: 'ok', testo: 'Backup ripristinato. Ricarico il pannello…' })
      setTimeout(() => location.reload(), 900)
    } catch (e) {
      setEsito({ tono: 'errore', testo: e instanceof Error ? e.message : 'File non valido.' })
    }
  }

  return (
    <div className="space-y-4">
      <Scheda
        titolo="Copia di sicurezza"
        sottotitolo="Scarica un file con tutti i testi e i file caricati. Serve per spostare il lavoro su un altro computer o per tornare indietro."
      >
        <div className="flex flex-wrap gap-2">
          <Bottone variante="primario" onClick={scarica}>
            Scarica backup
          </Bottone>
          <Bottone onClick={() => rifFile.current?.click()}>Ripristina da file</Bottone>
          <input
            ref={rifFile}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => ripristina(e.target.files?.[0])}
          />
        </div>
        <p className="mt-3 text-[0.8rem] text-slate-500">
          Spazio in uso: {pesoLeggibile(spazio.testiByte)} di testi ·{' '}
          {pesoLeggibile(spazio.mediaByte)} in {spazio.numeroMedia} file caricati.
        </p>
      </Scheda>

      <Scheda
        titolo="Nome utente e password"
        sottotitolo="Cambia le credenziali di accesso al pannello."
      >
        <form onSubmit={salvaCredenziali} className="grid gap-4 sm:grid-cols-2">
          <CampoRiga etichetta="Nome utente" valore={utente} onCambia={setUtente} />
          <div />
          <CampoRiga etichetta="Nuova password" tipo="password" valore={pw1} onCambia={setPw1} />
          <CampoRiga etichetta="Ripeti la password" tipo="password" valore={pw2} onCambia={setPw2} />
          <div className="sm:col-span-2">
            <Bottone tipo="submit" variante="primario">
              Aggiorna credenziali
            </Bottone>
          </div>
        </form>
        {!credenzialiPersonalizzate() && (
          <div className="mt-4">
            <Avviso tono="attenzione">
              Stai usando le credenziali di fabbrica. Cambiale prima di mettere il sito online.
            </Avviso>
          </div>
        )}
      </Scheda>

      <Scheda
        titolo="Torna ai contenuti originali"
        sottotitolo="Cancella tutte le modifiche fatte dal pannello e rimette il sito com'era alla consegna. I file caricati restano nell'archivio."
      >
        <Bottone
          variante="pericolo"
          onClick={() => {
            if (confirm('Cancellare TUTTE le modifiche e tornare ai contenuti originali?')) {
              azzeraModifiche()
              onRipristina()
            }
          }}
        >
          Ripristina tutto
        </Bottone>
      </Scheda>

      {esito && <Avviso tono={esito.tono}>{esito.testo}</Avviso>}

      <Scheda titolo="Come funziona la protezione">
        <Avviso tono="attenzione">
          Questo pannello vive dentro il sito, che è un sito statico: il controllo della password
          avviene nel browser. Tiene fuori i curiosi, ma chi è esperto può aggirarlo. Prima di
          pubblicare conviene proteggere l’indirizzo <code>/admin</code> con Cloudflare Access
          (gratuito): è una schermata di accesso vera, prima ancora che la pagina venga scaricata.
          Le istruzioni sono in <code>CONSEGNA.md</code>.
        </Avviso>
      </Scheda>
    </div>
  )
}

/* ═══════════════════════ PANNELLO ═══════════════════════ */

const ICONE: Record<string, string> = {
  copertina: '🎬', scuola: '🏫', persona: '🩰', corsi: '💃', attrezzo: '🏋️',
  voucher: '🎟️', medaglia: '🏅', galleria: '🖼️', virgolette: '❝', contatti: '📞',
}

export function Pannello() {
  const [dentro, setDentro] = useState(() => sessioneValida())
  const [sezioneId, setSezioneId] = useState(SEZIONI[0].id)
  const [menuAperto, setMenuAperto] = useState(false)
  const [bozza, setBozza] = useState<Modifiche>(() => leggiModifiche())
  const [sporco, setSporco] = useState(false)
  const [salvato, setSalvato] = useState(false)
  const [versione, setVersione] = useState(0)

  /* Contenuti visti dal pannello: base + bozza in lavorazione. */
  const contenuti = useMemo(() => {
    let out: Record<string, unknown> = { ...CONTENUTI_ATTUALI }
    for (const [k, v] of Object.entries(bozza)) out[k] = v
    return out
  }, [bozza])

  const sezione = SEZIONI.find((s) => s.id === sezioneId) ?? SEZIONI[0]

  const modifica = useCallback((percorso: string, valore: unknown) => {
    setBozza((b) => {
      const radice = percorso.split('.')[0]
      const partenza = (b[radice] ?? (CONTENUTI_ATTUALI as Record<string, unknown>)[radice]) as Record<
        string,
        unknown
      >
      const dentroPercorso = percorso.slice(radice.length + 1)
      const nuovo = dentroPercorso
        ? scriviPercorso(partenza, dentroPercorso, valore)
        : (valore as Record<string, unknown>)
      return { ...b, [radice]: nuovo }
    })
    setSporco(true)
    setSalvato(false)
  }, [])

  const salva = useCallback(() => {
    const r = scriviModifiche(bozza)
    if (r.ok) {
      setSporco(false)
      setSalvato(true)
      setVersione((v) => v + 1)
      setTimeout(() => setSalvato(false), 2600)
    } else {
      alert(
        'Salvataggio non riuscito: ' +
          (r.errore ?? '') +
          '\n\nProbabile spazio esaurito. Scarica un backup e togli qualche file pesante.',
      )
    }
  }, [bozza])

  /* Avviso del browser se si chiude con modifiche non salvate. */
  useEffect(() => {
    if (!sporco) return
    const h = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', h)
    return () => window.removeEventListener('beforeunload', h)
  }, [sporco])

  /* Ctrl/Cmd+S salva. */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        if (sporco) salva()
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [sporco, salva])

  /* Se la sessione scade mentre si lavora, si torna all'accesso. */
  useEffect(() => {
    if (!dentro) return
    const t = setInterval(() => {
      if (!sessioneValida()) setDentro(false)
    }, 30_000)
    return () => clearInterval(t)
  }, [dentro])

  if (!dentro) return <Accesso onEntrato={() => setDentro(true)} />

  const valore = (p: string) => leggiPercorso(contenuti, p)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* ── barra in alto ── */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-4 py-3">
          <button
            onClick={() => setMenuAperto((v) => !v)}
            aria-label="Menu delle sezioni"
            aria-expanded={menuAperto}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700 lg:hidden"
          >
            ☰
          </button>

          <img
            src="/logo/marchio-quadrato.webp"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-lg object-cover ring-1 ring-white/15"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.94rem] font-bold leading-tight">Pannello di controllo</p>
            <p className="truncate text-[0.72rem] text-slate-500">
              Alma Latina ASD · sessione per altri {minutiRimasti()} min
            </p>
          </div>

          {salvato && (
            <span className="hidden rounded-full bg-emerald-950 px-3 py-1.5 text-[0.76rem] font-semibold text-emerald-300 sm:inline">
              ✓ Salvato
            </span>
          )}
          {sporco && (
            <span className="hidden rounded-full bg-amber-950 px-3 py-1.5 text-[0.76rem] font-semibold text-amber-300 sm:inline">
              Modifiche non salvate
            </span>
          )}

          <Bottone variante="primario" onClick={salva} disabilitato={!sporco}>
            Salva
          </Bottone>
          <Bottone
            variante="fantasma"
            onClick={() => {
              if (sporco && !confirm('Ci sono modifiche non salvate. Uscire comunque?')) return
              esci()
              setDentro(false)
            }}
          >
            Esci
          </Bottone>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1500px] gap-6 px-4 py-6">
        {/* ── menu laterale ── */}
        <nav
          className={`${menuAperto ? 'block' : 'hidden'} fixed inset-x-0 bottom-0 top-[64px] z-20
                      overflow-y-auto bg-slate-950 p-4 lg:static lg:block lg:w-56 lg:shrink-0 lg:p-0`}
          aria-label="Sezioni"
        >
          <ul className="space-y-1">
            {SEZIONI.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => {
                    setSezioneId(s.id)
                    setMenuAperto(false)
                  }}
                  aria-current={s.id === sezioneId ? 'true' : undefined}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[0.88rem]
                              transition-colors ${
                                s.id === sezioneId
                                  ? 'bg-fuchsia-950/60 font-semibold text-white ring-1 ring-fuchsia-800'
                                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                              }`}
                >
                  <span aria-hidden="true">{ICONE[s.icona] ?? '•'}</span>
                  {s.nome}
                </button>
              </li>
            ))}
            <li className="pt-2">
              <button
                onClick={() => {
                  setSezioneId('impostazioni')
                  setMenuAperto(false)
                }}
                aria-current={sezioneId === 'impostazioni' ? 'true' : undefined}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[0.88rem]
                            transition-colors ${
                              sezioneId === 'impostazioni'
                                ? 'bg-fuchsia-950/60 font-semibold text-white ring-1 ring-fuchsia-800'
                                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                            }`}
              >
                <span aria-hidden="true">⚙️</span> Impostazioni
              </button>
            </li>
          </ul>
        </nav>

        {/* ── area di lavoro ── */}
        <main className="min-w-0 flex-1">
          {sezioneId === 'impostazioni' ? (
            <Impostazioni
              onRipristina={() => {
                setBozza({})
                setSporco(false)
                setVersione((v) => v + 1)
              }}
            />
          ) : (
            <div className="grid gap-5 xl:grid-cols-2">
              <div className="space-y-5">
                <Scheda titolo={sezione.nome} sottotitolo={sezione.descrizione}>
                  <div className="space-y-5">
                    {sezione.campi.map((c) => (
                      <CampoAuto
                        key={c.percorso}
                        campo={c}
                        valore={valore(c.percorso)}
                        onCambia={(v) => modifica(c.percorso, v)}
                      />
                    ))}
                    {sezione.campi.length === 0 && !sezione.elenco && (
                      <p className="text-[0.86rem] text-slate-500">Niente da modificare qui.</p>
                    )}
                  </div>
                </Scheda>

                {sezione.elenco === 'CORSI' && (
                  <Scheda
                    titolo="Elenco dei corsi"
                    sottotitolo="Trascina per riordinare, oppure usa le frecce. Ogni corso ha nome, colore, foto e video."
                  >
                    <EditorCorsi
                      corsi={contenuti.CORSI as never}
                      onCambia={(c) => modifica('CORSI', c)}
                    />
                  </Scheda>
                )}

                {sezione.elenco === 'GALLERIA' && (
                  <Scheda
                    titolo="Elementi della galleria"
                    sottotitolo="Foto e video mostrati nella galleria. Trascina per cambiare l'ordine."
                  >
                    <EditorGalleria
                      voci={contenuti.GALLERIA as never}
                      onCambia={(v) => modifica('GALLERIA', v)}
                    />
                  </Scheda>
                )}
              </div>

              <div className="xl:sticky xl:top-[92px] xl:self-start">
                <Anteprima ancora={sezione.ancora} ricarica={versione} />
                <p className="mt-2 text-[0.78rem] leading-relaxed text-slate-500">
                  L’anteprima si aggiorna quando premi <strong>Salva</strong>. Le modifiche non
                  salvate restano solo qui nel pannello.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

/* Esportato per il controllo automatico: confronta bozza e base. */
export const differenzeDaBase = (b: Modifiche) =>
  Object.keys(b).filter(
    (k) => JSON.stringify(b[k]) !== JSON.stringify((CONTENUTI_BASE as Record<string, unknown>)[k]),
  )
