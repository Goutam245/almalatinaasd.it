/* CONTATTI — modulo che arriva via mail + scorciatoie WhatsApp e social.
   Esattamente i tre canali chiesti in call, nient'altro.

   🚫 Nessun prezzo.
   🚫 Nessun indirizzo: la sede legale è stata dichiarata incerta dal
      cliente stesso, quindi non se ne scrive nessuno.

   ⚙️  ENDPOINT DEL MODULO — da collegare prima della pubblicazione.
       Serve l'indirizzo mail dove il cliente vuole ricevere le richieste
       (NON le credenziali Jimdo trovate in chat: quelle sono un accesso).
       Basta incollare qui l'URL del servizio di inoltro. Finché è null,
       il modulo non finge di funzionare: passa il messaggio a WhatsApp,
       così nessuna richiesta si perde. */
const ENDPOINT_MODULO: string | null = null

import { useState, type FormEvent } from 'react'
import { CORSI, SCUOLA, whatsappUrl } from '../data/contenuti'
import { IconaWhatsapp } from './Testata'
import { useRivela } from '../lib/movimento'

type Stato = 'fermo' | 'invio' | 'fatto' | 'errore'

export function Contatti() {
  const rif = useRivela<HTMLElement>({ scaglione: 0.07 })
  const [stato, setStato] = useState<Stato>('fermo')

  async function invia(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const dati = new FormData(e.currentTarget)

    // Trappola anti-spam: i robot compilano tutto, le persone non vedono questo campo.
    if (dati.get('sito')) return

    const nome = String(dati.get('nome') ?? '')
    const recapito = String(dati.get('recapito') ?? '')
    const corso = String(dati.get('corso') ?? '')
    const messaggio = String(dati.get('messaggio') ?? '')

    if (!ENDPOINT_MODULO) {
      // Nessun endpoint ancora collegato: la richiesta non va persa, va su WhatsApp.
      const testo =
        `Nuova richiesta dal sito\n\n` +
        `Nome: ${nome}\n` +
        `Recapito: ${recapito}\n` +
        (corso ? `Corso: ${corso}\n` : '') +
        (messaggio ? `\n${messaggio}` : '')
      window.open(whatsappUrl(testo), '_blank', 'noopener')
      setStato('fatto')
      return
    }

    try {
      setStato('invio')
      const r = await fetch(ENDPOINT_MODULO, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: dati,
      })
      setStato(r.ok ? 'fatto' : 'errore')
      if (r.ok) e.currentTarget.reset()
    } catch {
      setStato('errore')
    }
  }

  return (
    <section id="contatti" ref={rif} className="relative scroll-mt-24 bg-inchiostro py-20 sm:py-28 lg:py-32">
      <div className="contenitore">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ── Colonna sinistra ── */}
          <div className="lg:col-span-5">
            <p data-rivela className="occhiello mb-5 flex items-center gap-3 text-magenta">
              <span className="h-px w-8 bg-magenta/60" />
              Contatti
            </p>
            <h2 data-rivela className="titolo-sezione text-panna">
              Prenota ora <em className="corsivo text-arancio">la tua prova</em>
            </h2>
            <p data-rivela className="mt-6 max-w-[46ch] font-sans leading-relaxed text-nebbia">
              Scrivi il corso che ti interessa e il modo migliore per richiamarti.
              Rispondiamo con orari, livello e posti liberi.
            </p>

            <div data-rivela className="mt-9 space-y-3">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-white/12 bg-white/[0.04] p-4
                           transition-colors hover:border-white/30 hover:bg-white/[0.08]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366]">
                  <IconaWhatsapp className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-sans text-[0.7rem] uppercase tracking-[0.18em] text-cenere">
                    WhatsApp e telefono
                  </span>
                  <span className="block truncate font-sans text-lg font-semibold text-panna">
                    {SCUOLA.telefono}
                  </span>
                </span>
              </a>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { n: 'Instagram', u: SCUOLA.social.instagram, h: SCUOLA.social.handleFbIg, c: '#EB008C', i: <IconaInstagram /> },
                  { n: 'Facebook', u: SCUOLA.social.facebook, h: SCUOLA.social.handleFbIg, c: '#4D56CD', i: <IconaFacebook /> },
                  { n: 'TikTok', u: SCUOLA.social.tiktok, h: SCUOLA.social.handleTiktok, c: '#00AEEF', i: <IconaTikTok /> },
                ].map((s) => (
                  <a
                    key={s.n}
                    href={s.u}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.04]
                               p-4 text-center transition-colors hover:border-white/30 hover:bg-white/[0.08]"
                  >
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-full"
                      style={{ background: `${s.c}1f`, color: s.c }}
                    >
                      {s.i}
                    </span>
                    <span className="font-sans text-[0.74rem] font-semibold text-panna">{s.n}</span>
                    <span className="w-full truncate font-sans text-[0.62rem] text-cenere">{s.h}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Modulo ── */}
          <div className="lg:col-span-7">
            <form
              data-rivela
              onSubmit={invia}
              className="rounded-3xl border border-white/12 bg-carbone p-5 sm:p-8"
              noValidate={false}
            >
              {/* campo trappola, invisibile e fuori dal percorso di tabulazione */}
              <div className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
                <label htmlFor="sito">Non compilare</label>
                <input id="sito" name="sito" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Campo id="nome" nome="nome" etichetta="Nome" placeholder="Come ti chiami" richiesto />
                <Campo
                  id="recapito"
                  nome="recapito"
                  etichetta="Telefono o e-mail"
                  placeholder="Dove ti richiamiamo"
                  richiesto
                />
              </div>

              <div className="mt-4">
                <label htmlFor="corso" className="mb-2 block font-sans text-[0.78rem] font-semibold text-nebbia">
                  Corso che ti interessa
                </label>
                <select
                  id="corso"
                  name="corso"
                  className="w-full rounded-xl border border-white/15 bg-inchiostro px-4 py-3.5 font-sans
                             text-[0.95rem] text-panna transition-colors focus:border-magenta focus:outline-none"
                  defaultValue=""
                >
                  <option value="">Non lo so ancora / voglio un consiglio</option>
                  {CORSI.map((c) => (
                    <option key={c.slug} value={c.nome}>
                      {c.nome}
                    </option>
                  ))}
                  <option value="Voucher Regione Campania">Informazioni sul voucher</option>
                </select>
              </div>

              <div className="mt-4">
                <label htmlFor="messaggio" className="mb-2 block font-sans text-[0.78rem] font-semibold text-nebbia">
                  Messaggio <span className="font-normal text-cenere">(facoltativo)</span>
                </label>
                <textarea
                  id="messaggio"
                  name="messaggio"
                  rows={4}
                  placeholder="Scrivi qui la tua domanda"
                  className="w-full resize-y rounded-xl border border-white/15 bg-inchiostro px-4 py-3.5
                             font-sans text-[0.95rem] text-panna placeholder:text-cenere
                             transition-colors focus:border-magenta focus:outline-none"
                />
              </div>

              <label className="mt-5 flex items-start gap-3">
                <input
                  type="checkbox"
                  name="consenso"
                  required
                  className="mt-1 h-[18px] w-[18px] shrink-0 accent-magenta"
                />
                <span className="font-sans text-[0.8rem] leading-relaxed text-nebbia">
                  Ho letto l’
                  <a href="/privacy" className="text-azzurro underline underline-offset-2">
                    informativa privacy
                  </a>{' '}
                  e acconsento a essere ricontattato.
                </span>
              </label>

              <button type="submit" disabled={stato === 'invio'} className="btn-primario mt-6 w-full disabled:opacity-60">
                {stato === 'invio' ? 'Invio in corso…' : 'Invia la richiesta'}
              </button>

              {/* Esiti — sempre annunciati anche ai lettori di schermo. */}
              <p role="status" aria-live="polite" className="mt-4 min-h-[1.25rem] text-center font-sans text-sm">
                {stato === 'fatto' && (
                  <span className="text-lime">
                    Richiesta pronta. Ti rispondiamo appena possibile.
                  </span>
                )}
                {stato === 'errore' && (
                  <span className="text-rosso">
                    L’invio non è riuscito.{' '}
                    <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="underline">
                      Scrivici su WhatsApp
                    </a>
                    .
                  </span>
                )}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function Campo({
  id,
  nome,
  etichetta,
  placeholder,
  richiesto,
}: {
  id: string
  nome: string
  etichetta: string
  placeholder: string
  richiesto?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-sans text-[0.78rem] font-semibold text-nebbia">
        {etichetta} {richiesto && <span className="text-magenta">*</span>}
      </label>
      <input
        id={id}
        name={nome}
        type="text"
        required={richiesto}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/15 bg-inchiostro px-4 py-3.5 font-sans
                   text-[0.95rem] text-panna placeholder:text-cenere transition-colors
                   focus:border-magenta focus:outline-none"
      />
    </div>
  )
}

/* ── Icone social ── */
const IconaInstagram = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zm0 5.68a4.16 4.16 0 1 0 0 8.32 4.16 4.16 0 0 0 0-8.32zm0 6.86a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4zm5.31-7.03a.97.97 0 1 1-1.94 0 .97.97 0 0 1 1.94 0z" />
  </svg>
)
const IconaFacebook = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.5-3.9 3.77-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
  </svg>
)
const IconaTikTok = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
    <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-1.79-2.46V9.8a5.77 5.77 0 1 0 4.88 5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.24-1.48z" />
  </svg>
)
