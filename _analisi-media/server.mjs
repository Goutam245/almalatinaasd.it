// Zero-dependency static server WITH byte-range support (required for video seeking).
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOTS = [path.resolve(__dirname), path.resolve(__dirname, '..', 'public')]

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
}

function resolveFile(urlPath) {
  const rel = decodeURIComponent(urlPath.split('?')[0]).replace(/^\/+/, '')
  for (const root of ROOTS) {
    const p = path.resolve(root, rel)
    if (!p.startsWith(root)) continue
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return p
  }
  return null
}

http
  .createServer((req, res) => {
    // POST /save  { name, data:"data:image/webp;base64,..." }  -> public/poster/<name>
    if (req.method === 'POST' && req.url === '/save') {
      let body = ''
      req.on('data', c => (body += c))
      req.on('end', () => {
        try {
          const { name, data } = JSON.parse(body)
          const safe = path.basename(name)
          const b64 = data.slice(data.indexOf(',') + 1)
          const dir = path.resolve(__dirname, '..', 'public', 'poster')
          fs.mkdirSync(dir, { recursive: true })
          const out = path.join(dir, safe)
          fs.writeFileSync(out, Buffer.from(b64, 'base64'))
          res.writeHead(200, { 'content-type': 'text/plain' })
          res.end('OK ' + Math.round(fs.statSync(out).size / 1024) + 'KB')
        } catch (e) {
          res.writeHead(500, { 'content-type': 'text/plain' })
          res.end('ERR ' + e.message)
        }
      })
      return
    }

    let urlPath = req.url === '/' ? '/index.html' : req.url
    const file = resolveFile(urlPath)
    if (!file) {
      res.writeHead(404, { 'content-type': 'text/plain' })
      return res.end('404 ' + urlPath)
    }

    const stat = fs.statSync(file)
    const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream'
    const range = req.headers.range

    if (range) {
      const m = /bytes=(\d*)-(\d*)/.exec(range)
      const start = m[1] ? parseInt(m[1], 10) : 0
      const end = m[2] ? parseInt(m[2], 10) : stat.size - 1
      res.writeHead(206, {
        'content-type': type,
        'content-range': `bytes ${start}-${end}/${stat.size}`,
        'accept-ranges': 'bytes',
        'content-length': end - start + 1,
        'cache-control': 'no-store',
      })
      return fs.createReadStream(file, { start, end }).pipe(res)
    }

    res.writeHead(200, {
      'content-type': type,
      'content-length': stat.size,
      'accept-ranges': 'bytes',
      'cache-control': 'no-store',
    })
    fs.createReadStream(file).pipe(res)
  })
  .listen(4599, () => console.log('media-analysis server on http://localhost:4599'))
