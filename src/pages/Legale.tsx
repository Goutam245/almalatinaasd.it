/* Pagine legali — testi neutri e veri per la configurazione attuale del sito.
   ⚠️ DA_CONFERMARE prima della pubblicazione: denominazione completa
   dell'associazione, codice fiscale/P.IVA e sede legale. In call il cliente
   ha detto di non essere sicuro che la sede sia ancora quella, quindi qui
   non compare nessun indirizzo. */
import { SCUOLA } from '../data/contenuti'
import { Link } from '../lib/router'

function Guscio({ titolo, children }: { titolo: string; children: React.ReactNode }) {
  return (
    <main id="contenuto" className="bg-inchiostro" style={{ paddingTop: 'calc(var(--h-testata) + 2.5rem)' }}>
      <div className="contenitore pb-24">
        <Link
          a="/"
          className="mb-8 inline-flex items-center gap-2 font-sans text-sm text-nebbia transition-colors hover:text-panna"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M13 8H3M7 4L3 8l4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Torna alla home
        </Link>

        <h1 className="titolo-sezione max-w-[16ch] text-panna">{titolo}</h1>

        <div className="mt-10 max-w-[68ch] space-y-6 font-sans leading-relaxed text-nebbia [&_h2]:pt-4 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:uppercase [&_h2]:text-panna [&_strong]:text-panna">
          {children}
        </div>
      </div>
    </main>
  )
}

export function Privacy() {
  return (
    <Guscio titolo="Informativa privacy">
      <p>
        Questa pagina spiega come {SCUOLA.nomeCompleto} tratta i dati di chi visita{' '}
        {SCUOLA.dominio} e di chi scrive tramite il modulo di contatto.
      </p>

      <h2>Chi tratta i dati</h2>
      <p>
        Il titolare del trattamento è {SCUOLA.nomeCompleto}, contattabile al numero{' '}
        <a href={`tel:${SCUOLA.telefonoTastiera}`} className="text-azzurro underline underline-offset-2">
          {SCUOLA.telefono}
        </a>
        .
        {/* DA_CONFERMARE: denominazione completa, codice fiscale e sede legale
            dell'associazione, da inserire qui prima della messa online. */}
      </p>

      <h2>Quali dati e perché</h2>
      <p>
        Dal modulo di contatto raccogliamo <strong>nome</strong>, un{' '}
        <strong>recapito</strong> (telefono o e-mail), il <strong>corso di interesse</strong> e
        l’eventuale <strong>messaggio</strong>. Servono soltanto a rispondere alla richiesta.
        Non li usiamo per invii pubblicitari e non li cediamo a terzi.
      </p>

      <h2>Per quanto tempo</h2>
      <p>
        Conserviamo le richieste per il tempo necessario a gestirle e, in caso di iscrizione,
        per gli obblighi di legge legati all’attività dell’associazione.
      </p>

      <h2>WhatsApp e social</h2>
      <p>
        I pulsanti WhatsApp, Instagram, Facebook e TikTok aprono applicazioni e siti gestiti da
        terzi: da quel momento vale la loro informativa, non questa.
      </p>

      <h2>I tuoi diritti</h2>
      <p>
        Puoi chiedere in ogni momento di accedere ai tuoi dati, correggerli o cancellarli.
        Basta scrivere al recapito indicato sopra.
      </p>
    </Guscio>
  )
}

export function Cookie() {
  return (
    <Guscio titolo="Cookie">
      <p>
        Questo sito è volutamente essenziale: <strong>non usa cookie di profilazione</strong>,
        non traccia la navigazione e non ospita pixel pubblicitari.
      </p>

      <h2>Cosa viene salvato</h2>
      <p>
        Nulla che permetta di riconoscere chi visita il sito. Non ci sono cookie di terze parti
        installati dalle pagine.
      </p>

      <h2>Contenuti esterni</h2>
      <p>
        I tipi di carattere sono serviti da Google Fonts. I collegamenti a WhatsApp, Instagram,
        Facebook e TikTok portano fuori da questo sito: le rispettive piattaforme applicano le
        proprie regole sui cookie.
      </p>

      <h2>Domande</h2>
      <p>
        Per qualsiasi chiarimento scrivi al numero{' '}
        <a href={`tel:${SCUOLA.telefonoTastiera}`} className="text-azzurro underline underline-offset-2">
          {SCUOLA.telefono}
        </a>
        .
      </p>
    </Guscio>
  )
}

export function NonTrovata() {
  return (
    <Guscio titolo="Pagina non trovata">
      <p>L’indirizzo che hai aperto non esiste. Torna alla home e riparti da lì.</p>
      <Link a="/" className="btn-primario mt-4">
        Vai alla home
      </Link>
    </Guscio>
  )
}
