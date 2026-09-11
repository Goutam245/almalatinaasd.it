/* PIÈ DI PAGINA. Nessun indirizzo (sede legale dichiarata incerta),
   nessun prezzo. Firma richiesta in fondo. */
import { CORSI, CREDITO, NAV, SCUOLA, whatsappUrl } from '../data/contenuti'
import { Link } from '../lib/router'
import { Onda } from './Onda'
import { IconaWhatsapp } from './Testata'

export function PiePagina({ versoSezione }: { versoSezione: (id: string) => void }) {
  const anno = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-inchiostro">
      <Onda altezza="h-12 sm:h-14" opacita={0.75} />

      <div className="contenitore pb-8 pt-14 sm:pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* ── Marchio ── */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo/marchio-quadrato.webp"
                alt=""
                width={48}
                height={48}
                className="h-11 w-11 rounded-[9px] object-cover ring-1 ring-white/20"
              />
              <span className="flex flex-col leading-none">
                <span className="font-display text-2xl font-extrabold uppercase tracking-[0.02em] text-panna">
                  Alma Latina
                </span>
                <span className="mt-1 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-nebbia">
                  ASD · Danza &amp; Fitness
                </span>
              </span>
            </div>

            <p className="mt-5 max-w-[38ch] font-sans text-sm leading-relaxed text-nebbia">
              Scuola di danza e fitness. Undici corsi, dalle danze latine al Pilates.
              Con il voucher Regione Campania si fa sport gratis.
            </p>

            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-verde mt-6 w-full sm:w-auto"
            >
              <IconaWhatsapp className="h-[19px] w-[19px]" />
              {SCUOLA.telefono}
            </a>
          </div>

          {/* ── Corsi ── */}
          <nav className="lg:col-span-4" aria-label="Corsi">
            <h2 className="mb-4 font-sans text-[0.7rem] font-bold uppercase tracking-[0.24em] text-cenere">
              Corsi
            </h2>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-2 xs:grid-cols-2">
              {CORSI.map((c) => (
                <li key={c.slug}>
                  <button
                    onClick={() => versoSezione('corsi')}
                    className="group flex items-center gap-2 text-left font-sans text-sm text-nebbia transition-colors hover:text-panna"
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-150"
                      style={{ background: c.colore }}
                    />
                    {c.nome}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Pagine + social ── */}
          <div className="lg:col-span-4">
            <h2 className="mb-4 font-sans text-[0.7rem] font-bold uppercase tracking-[0.24em] text-cenere">
              Pagine
            </h2>
            <ul className="space-y-2">
              {NAV.map((v) => (
                <li key={v.id}>
                  <button
                    onClick={() => versoSezione(v.id)}
                    className="font-sans text-sm text-nebbia transition-colors hover:text-panna"
                  >
                    {v.etichetta}
                  </button>
                </li>
              ))}
              <li>
                <Link a="/privacy" className="font-sans text-sm text-nebbia transition-colors hover:text-panna">
                  Privacy
                </Link>
              </li>
              <li>
                <Link a="/cookie" className="font-sans text-sm text-nebbia transition-colors hover:text-panna">
                  Cookie
                </Link>
              </li>
            </ul>

            <h2 className="mb-3 mt-7 font-sans text-[0.7rem] font-bold uppercase tracking-[0.24em] text-cenere">
              Seguici
            </h2>
            <ul className="flex flex-wrap gap-2">
              {[
                { n: 'Instagram', u: SCUOLA.social.instagram },
                { n: 'Facebook', u: SCUOLA.social.facebook },
                { n: 'TikTok', u: SCUOLA.social.tiktok },
              ].map((s) => (
                <li key={s.n}>
                  <a
                    href={s.u}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full border border-white/15 px-4 py-2 font-sans text-[0.78rem]
                               text-nebbia transition-colors hover:border-white/40 hover:text-panna"
                  >
                    {s.n}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-[0.78rem] text-cenere">
            © {anno} {SCUOLA.nomeCompleto} · {SCUOLA.dominio}
          </p>
          <p className="font-sans text-[0.78rem] text-cenere">
            <a
              href="https://onlinepertutti.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-nebbia"
            >
              {CREDITO}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
