/* Site check — run this before any push.

   It catches the class of bug that has actually shipped on this site, not a
   generic lint:

     1. A page-transition link that animates on one page and not another.
        live-demos.html sat 84 minutes carrying data-page-transition links with
        no #vc2Nav overlay, so every click fell through with no animation while
        the other pages looked fine. Nothing would have caught that but clicking
        every link on every page, so that is what pass 2 does.
     2. An embed that reserves a huge empty box on a phone. Cal's calendar
        reserved 1250px and filled about 350 of it.
     3. Horizontal overflow at phone width.
     4. Broken images, images with no alt, dead internal links, placeholder text.
     5. A JS error, which silently kills every handler below it in the same file.

   Usage:  node check.mjs      (serves the folder itself on a free port)
   Exits 1 on any finding, so it can gate a deploy.
*/
import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { existsSync } from 'fs';
import { extname, join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

/* This folder has no node_modules of its own. Playwright lives in NebulaOS,
   and ESM ignores NODE_PATH, so resolve it by hand instead of asking Wayne
   to npm install anything here. */
const PW_CANDIDATES = [
  'playwright',
  'C:/Users/Wayne/Projects/NEBULA-TRANSFER/NebulaOS/node_modules/playwright/index.js',
  'C:/Users/Wayne/Projects/NEBULA-TRANSFER/carousel-automation/node_modules/playwright/index.js'
];
let chromium = null;
for (const c of PW_CANDIDATES) {
  try {
    const mod = await import(c.startsWith('C:') ? pathToFileURL(c).href : c);
    chromium = (mod.default || mod).chromium;
    if (chromium) break;
  } catch { /* try the next one */ }
}
if (!chromium) {
  console.error('playwright not found — install it, or fix a path in PW_CANDIDATES');
  process.exit(2);
}

const ROOT = dirname(fileURLToPath(import.meta.url));
/* port 0 = let the OS pick a free one. A fixed port collides with a previous
   run that has not fully exited and the whole check dies on EADDRINUSE. */
let PORT = 0;
const PAGES = ['index', 'services', 'about', 'live-demos', 'book', 'intake', 'miami', 'privacy', 'terms']
  .filter(p => existsSync(join(ROOT, p + '.html')));

const TYPES = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.ico': 'image/x-icon', '.json': 'application/json',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.webp': 'image/webp', '.gif': 'image/gif', '.pdf': 'application/pdf'
};

const srv = createServer(async (req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
  const p = join(ROOT, rel);
  try {
    if ((await stat(p)).isDirectory()) throw new Error('dir');
    res.writeHead(200, { 'Content-Type': TYPES[extname(p).toLowerCase()] || 'application/octet-stream' });
    res.end(await readFile(p));
  } catch {
    res.writeHead(404);
    res.end('404');
  }
});
await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
PORT = srv.address().port;
const url = n => 'http://127.0.0.1:' + PORT + '/' + n + '.html';

const found = [];
const note = (pg, msg) => found.push('[' + pg + '] ' + msg);
const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });

/* ── pass 1: per page — JS errors, assets, overflow, empty boxes, phone depth ── */
const linkTargets = new Set();

for (const name of PAGES) {
  for (const vp of [{ n: 'phone', w: 390, h: 844 }, { n: 'desktop', w: 1440, h: 900 }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
    const page = await ctx.newPage();

    page.on('pageerror', e =>
      note(name, 'JS ERROR (' + vp.n + ') — this kills every handler below it in the same script: ' + e.message.slice(0, 100)));
    page.on('response', r => {
      if (r.status() >= 400) note(name, r.status() + ' ' + r.url().replace('http://127.0.0.1:' + PORT + '/', ''));
    });

    await page.goto(url(name), { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3500);
    await page.evaluate(async () => {
      ['vc2Intro', 'vc2Nav'].forEach(i => { const n = document.getElementById(i); if (n) n.remove(); });
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 30));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(600);

    const r = await page.evaluate(() => {
      const o = { imgs: [], links: [], placeholder: [], empty: [], overflow: null, docH: document.documentElement.scrollHeight };
      const d = document.documentElement;

      if (d.scrollWidth > d.clientWidth + 2) {
        o.overflow = {
          w: d.scrollWidth,
          c: d.clientWidth,
          who: Array.from(document.querySelectorAll('*'))
            .filter(e => e.getBoundingClientRect().right > d.clientWidth + 2)
            .slice(0, 4)
            .map(e => e.tagName.toLowerCase() +
              (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/)[0] : ''))
        };
      }

      document.querySelectorAll('img').forEach(i => {
        const s = (i.getAttribute('src') || '?').split('/').pop();
        if (i.complete && i.naturalWidth === 0) o.imgs.push('broken image: ' + s);
        if (!i.alt && i.offsetParent) o.imgs.push('image with no alt: ' + s);
      });

      document.querySelectorAll('a[href]').forEach(a => {
        const h = a.getAttribute('href') || '';
        if (/^(\.\/|\/)?[\w-]+\.html$/.test(h)) o.links.push(h.replace(/^\.?\//, ''));
      });

      const txt = document.body.innerText;
      ['lorem ipsum', 'TODO', 'TBD', 'PLACEHOLDER', 'coming soon'].forEach(w => {
        if (new RegExp(w, 'i').test(txt)) o.placeholder.push(w);
      });

      /* a tall block holding nothing — the Cal-calendar bug, generalised.
         Skips decorative layers (a hero wash, a gradient, a background image):
         those are SUPPOSED to be empty, and a check that flags them every run
         is a check that gets ignored. */
      document.querySelectorAll('section, div, article, iframe').forEach(e => {
        const b = e.getBoundingClientRect();
        if (b.height < 500) return;
        if (e.tagName === 'IFRAME') {
          if (b.height > 900) o.empty.push('iframe reserving ' + Math.round(b.height) + 'px');
          return;
        }
        const cs = getComputedStyle(e);
        const decorative = e.getAttribute('aria-hidden') === 'true' ||
          (cs.backgroundImage && cs.backgroundImage !== 'none') ||
          /-(bg|wash|glow|grid|overlay|backdrop|texture)\b/.test(e.className || '');
        if (decorative) return;
        const kids = e.querySelectorAll('*').length;
        const text = (e.innerText || '').trim().length;
        if (text === 0 && kids < 3 && !e.querySelector('img,video,svg,iframe,canvas')) {
          const label = e.id || (typeof e.className === 'string' && e.className ? e.className.split(' ')[0] : e.tagName);
          o.empty.push(label + ' is ' + Math.round(b.height) + 'px and holds nothing');
        }
      });

      return o;
    });

    if (r.overflow) note(name, 'horizontal overflow (' + vp.n + '): ' + r.overflow.w + ' > ' + r.overflow.c + ' — ' + r.overflow.who.join(', '));
    Array.from(new Set(r.imgs)).forEach(i => note(name, i + ' (' + vp.n + ')'));
    Array.from(new Set(r.placeholder)).forEach(i => note(name, 'placeholder text "' + i + '"'));
    Array.from(new Set(r.empty)).forEach(i => note(name, i + ' (' + vp.n + ')'));
    /* About legitimately runs long. 14000px is roughly 17 phone screens — past
       that something has run away, which is the case worth stopping a push for. */
    if (vp.n === 'phone' && r.docH > 14000) note(name, 'phone page is ' + r.docH + 'px — ' + Math.round(r.docH / 844) + ' screens deep');
    r.links.forEach(l => linkTargets.add(l));

    await ctx.close();
  }
}

for (const l of linkTargets) {
  if (!existsSync(join(ROOT, l))) found.push('DEAD LINK TARGET: ' + l + ' is linked but does not exist');
}

/* ── pass 2: every tagged link must actually animate, from every page ──
   One fresh page load per link. Slower, but it is the only thing that would
   have caught live-demos, and a synthetic click on a page that is about to
   navigate away gives a false pass. */
for (const from of PAGES) {
  const probe = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const pp = await probe.newPage();
  await pp.goto(url(from), { waitUntil: 'domcontentloaded' });
  await pp.waitForTimeout(1200);
  const hasOverlay = await pp.evaluate(() => !!document.getElementById('vc2Nav'));
  const targets = await pp.evaluate(() =>
    Array.from(new Set(Array.from(document.querySelectorAll('a[data-page-transition]'))
      .map(a => a.getAttribute('href')).filter(h => h && h !== '#'))));
  await probe.close();

  if (targets.length && !hasOverlay) {
    note(from, 'has ' + targets.length + ' data-page-transition links but NO #vc2Nav overlay — every click falls through with no animation');
    continue;
  }

  for (const t of targets) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto(url(from), { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2200);
    page.on('dialog', d => d.dismiss());
    await page.evaluate(() => window.addEventListener('beforeunload', e => { e.preventDefault(); e.returnValue = ''; }));

    const res = await page.evaluate(async href => {
      const nav = document.getElementById('vc2Nav');
      const nv = document.getElementById('vc2NavVideo');
      const a = Array.from(document.querySelectorAll('a[data-page-transition]')).find(x => x.getAttribute('href') === href);
      if (!a) return { on: false, why: 'link vanished' };
      a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
      await new Promise(r => setTimeout(r, 1200));
      return { on: nav.classList.contains('on'), played: +nv.currentTime.toFixed(2), op: getComputedStyle(nav).opacity };
    }, t).catch(e => ({ on: false, why: e.message.slice(0, 50) }));

    if (!(res.on && res.played > 0.3 && res.op === '1')) {
      note(from, 'transition did NOT play going to ' + t +
        ' (overlay=' + res.on + ' played=' + res.played + 's opacity=' + res.op + ') ' + (res.why || ''));
    }
    await ctx.close();
  }
}

await browser.close();
srv.close();

if (found.length) {
  console.log('\n' + found.length + ' FINDING(S):\n' + found.map(f => '  * ' + f).join('\n') + '\n');
  process.exit(1);
}
console.log('\nCLEAN — ' + PAGES.length + ' pages, phone and desktop, every page-transition link verified.\n');
