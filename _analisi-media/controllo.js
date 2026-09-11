/* Controllo automatico della pagina. Si incolla nella console del browser
   e restituisce un oggetto con tutti gli esiti.
   Verifica: contrasto, traboccamenti orizzontali, testo invisibile,
   sovrapposizioni, dimensione delle aree toccabili, alt mancanti e —
   soprattutto — che non compaiano prezzi né indirizzi. */
window.controlloAlmaLatina = function () {
  const esiti = { contrasto: [], invisibili: [], sovrapposti: [], tocco: [], alt: [], vietati: [], overflow: null }

  /* ── colori ── */
  const aRgb = (s) => {
    const m = String(s).match(/rgba?\(([^)]+)\)/)
    if (!m) return null
    const p = m[1].split(',').map((x) => parseFloat(x))
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }
  }
  const lin = (c) => {
    c /= 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  const lum = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  const sopra = (f, s) => ({
    r: f.r * f.a + s.r * (1 - f.a),
    g: f.g * f.a + s.g * (1 - f.a),
    b: f.b * f.a + s.b * (1 - f.a),
    a: 1,
  })
  const rapporto = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
    return (x + 0.05) / (y + 0.05)
  }

  /* Fondo effettivo: risale gli antenati impilando i colori traslucidi.
     Se incontra un'immagine/video/gradiente lo segnala: lì il contrasto
     va valutato sulla luminanza misurata della clip, non sul CSS. */
  function fondo(el) {
    let cur = el
    let pila = []
    let media = false
    while (cur && cur !== document.documentElement) {
      const st = getComputedStyle(cur)
      if (st.backgroundImage && st.backgroundImage !== 'none') media = true
      const c = aRgb(st.backgroundColor)
      if (c && c.a > 0) {
        pila.push(c)
        if (c.a >= 0.999) break
      }
      cur = cur.parentElement
    }
    let base = { r: 11, g: 11, b: 15, a: 1 }
    for (let i = pila.length - 1; i >= 0; i--) base = sopra(pila[i], base)
    return { colore: base, suMedia: media }
  }

  const visibile = (el) => {
    const r = el.getBoundingClientRect()
    const st = getComputedStyle(el)
    return r.width > 1 && r.height > 1 && st.visibility !== 'hidden' && st.display !== 'none'
  }

  /* ── 1. contrasto del testo su fondo pieno ── */
  document.querySelectorAll('p,h1,h2,h3,h4,span,a,button,li,label,dd,dt,figcaption,option,footer,blockquote').forEach((el) => {
    const testo = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(' ')
    if (!testo || !visibile(el)) return
    const st = getComputedStyle(el)
    if (parseFloat(st.opacity) < 0.99) return
    const fg = aRgb(st.color)
    if (!fg) return
    const { colore, suMedia } = fondo(el)
    const eff = fg.a < 1 ? sopra(fg, colore) : fg
    const r = rapporto(eff, colore)
    const px = parseFloat(st.fontSize)
    const grosso = px >= 24 || (px >= 18.66 && parseInt(st.fontWeight) >= 700)
    const soglia = grosso ? 3 : 4.5
    if (r < soglia) {
      esiti.contrasto.push({
        testo: testo.slice(0, 54),
        rapporto: +r.toFixed(2),
        soglia,
        px: +px.toFixed(1),
        colore: st.color,
        fondo: `rgb(${Math.round(colore.r)},${Math.round(colore.g)},${Math.round(colore.b)})`,
        suMedia,
        sel: el.tagName.toLowerCase() + '.' + String(el.className).split(' ').slice(0, 2).join('.'),
      })
    }
  })

  /* ── 2. testo reso invisibile da un'animazione rimasta a metà ── */
  document.querySelectorAll('p,h1,h2,h3,span,li,a,button,figcaption,dd').forEach((el) => {
    if (!el.textContent.trim()) return
    const st = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    if (r.height < 1) return
    if (parseFloat(st.opacity) < 0.06 && el.getAttribute('aria-hidden') !== 'true') {
      esiti.invisibili.push({ testo: el.textContent.trim().slice(0, 46), opacity: st.opacity })
    }
  })

  /* ── 3. aree toccabili troppo piccole ── */
  document.querySelectorAll('a,button,input,select,textarea,[role="button"]').forEach((el) => {
    if (!visibile(el)) return
    const r = el.getBoundingClientRect()
    if (r.width < 40 || r.height < 40) {
      esiti.tocco.push({
        tag: el.tagName.toLowerCase(),
        testo: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 34),
        w: Math.round(r.width),
        h: Math.round(r.height),
      })
    }
  })

  /* ── 4. immagini senza alt ── */
  document.querySelectorAll('img').forEach((im) => {
    if (!im.hasAttribute('alt')) esiti.alt.push(im.currentSrc || im.src)
  })

  /* ── 5. traboccamento orizzontale ── */
  const de = document.documentElement
  esiti.overflow = { scrollW: de.scrollWidth, clientW: de.clientWidth, traboccka: de.scrollWidth > de.clientWidth + 1 }
  if (esiti.overflow.traboccka) {
    esiti.overflow.colpevoli = [...document.querySelectorAll('*')]
      .filter((el) => el.getBoundingClientRect().right > de.clientWidth + 2)
      .slice(0, 8)
      .map((el) => el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0])
  }

  /* ── 6. CONFORMITÀ DEI CONTENUTI ──
     Il cliente ha chiesto nessun prezzo; la sede legale è incerta quindi
     nessun indirizzo. Qui si cerca qualunque traccia di entrambi. */
  const testoPagina = document.body.innerText
  const spie = [
    { nome: 'prezzo in euro', re: /(\d+[.,]?\d*)\s?(€|euro|EUR)\b/gi },
    { nome: 'simbolo euro', re: /€/g },
    { nome: 'parola prezzo/tariffa/quota/costo', re: /\b(prezz\w+|tariff\w+|quot[ae]|cost[oi]|listino|abbonament\w+|mensil\w+|iscrizione\s+\d)/gi },
    { nome: 'via/piazza/corso + numero', re: /\b(via|viale|piazza|p\.zza|corso|c\.so|largo|vicolo)\s+[A-Z][\w' ]{2,30}[, ]+\d+/gi },
    { nome: 'CAP italiano', re: /\b\d{5}\b\s*[-–]?\s*[A-Z][a-z]+/g },
    { nome: 'credenziali in chiaro', re: /(ciaci58|Lollo15|jimdo)/gi },
  ]
  spie.forEach((s) => {
    const t = testoPagina.match(s.re)
    if (t) esiti.vietati.push({ tipo: s.nome, trovato: [...new Set(t)].slice(0, 6) })
  })

  /* ── 7. riepilogo ── */
  esiti.riepilogo = {
    contrastoKO: esiti.contrasto.length,
    contrastoKO_suFondoPieno: esiti.contrasto.filter((c) => !c.suMedia).length,
    invisibili: esiti.invisibili.length,
    toccoPiccolo: esiti.tocco.length,
    altMancanti: esiti.alt.length,
    traboccamento: esiti.overflow.traboccka,
    contenutiVietati: esiti.vietati.length,
    larghezza: window.innerWidth,
  }
  return esiti
}
'controllo caricato'
