# Ottimizza le foto: da 4000-8500px a set responsive WebP + LQIP base64.
import os, json, base64, io
from PIL import Image, ImageFilter

SRC = os.path.join(os.path.dirname(__file__), '..', 'public', 'foto')
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'img')
os.makedirs(OUT, exist_ok=True)

# slug leggibile -> file sorgente  (mappatura verificata a video, foto per foto)
MAP = {
    'ballerina-giro':        'pexels-anastasia-shuraeva-8935204.jpg',
    'ballerina-sbarra':      'pexels-anastasia-shuraeva-8935205.jpg',
    'sala-ballo-notturna':   'pexels-bingqian-li-230971044-35130119.jpg',
    'bambini-sbarra':        'pexels-cottonbro-6714218.jpg',
    'gruppo-urbano':         'pexels-davelexe-5935969.jpg',
    'contemporanea-duo':     'pexels-ganeshadyapady-13610660.jpg',
    'maestra-bambine':       'pexels-gustavo-fring-5888283.jpg',
    'classe-bambine':        'pexels-gustavo-fring-5888334.jpg',
    'tango-riflettore':      'pexels-marko-2188012.jpg',
    'coppia-loft':           'pexels-mart-production-8463001.jpg',
    'coppia-arabesque':      'pexels-mart-production-8463037.jpg',
    'gruppo-specchi':        'pexels-pavel-danilyuk-6926534.jpg',
    'gruppo-diagonale':      'pexels-pavel-danilyuk-6926540.jpg',
    'gruppo-pavimento':      'pexels-pavel-danilyuk-6926599.jpg',
    'solista-punte':         'pexels-ruben-ostria-baltazar-582280249-17029891.jpg',
    'coppia-bianconero':     'pexels-tessacharles-14453787.jpg',
    'salsa-orchestra':       'pexels-tkirkgoz-11605478.jpg',
    'salsa-giro':            'pexels-tkirkgoz-16763609.jpg',
}

WIDTHS = [640, 1080, 1600]
manifest = {}

for slug, fname in MAP.items():
    p = os.path.join(SRC, fname)
    if not os.path.exists(p):
        print('MANCA', fname); continue
    im = Image.open(p).convert('RGB')
    w0, h0 = im.size
    entry = {'w': w0, 'h': h0, 'ratio': round(w0 / h0, 4), 'src': fname, 'sizes': {}}

    for w in WIDTHS:
        if w > w0:
            continue
        h = round(h0 * w / w0)
        r = im.resize((w, h), Image.LANCZOS)
        out = os.path.join(OUT, f'{slug}-{w}.webp')
        r.save(out, 'WEBP', quality=80, method=6)
        entry['sizes'][w] = round(os.path.getsize(out) / 1024)

    # LQIP: 20px, sfocato, base64 -> nessun flash bianco durante il caricamento
    lq = im.resize((20, max(1, round(20 * h0 / w0))), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.6))
    buf = io.BytesIO(); lq.save(buf, 'WEBP', quality=52)
    entry['lqip'] = 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()

    manifest[slug] = entry
    print(f"{slug:22} {w0}x{h0} -> {list(entry['sizes'].items())}  lqip {len(entry['lqip'])}B")

with open(os.path.join(OUT, 'manifest.json'), 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=1)
print('\nfatto:', len(manifest), 'immagini')
