// PDF verze prezentací: po sestavení webu (npm run build) otevře každou dist/prezentace/<nazev>/offline.html
// v prohlížeči Chromium a uloží ji jako dist/prezentace/<nazev>/<nazev>.pdf (snímek = stránka 16:9, všechny kroky odkryté).
// Spouští se automaticky při publikování (GitHub Actions). Ručně: npm run pdf (vyžaduje npx playwright install chromium).
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

let chromium;
try {
	({ chromium } = await import('playwright'));
} catch {
	console.warn('[prezentace-pdf] Playwright není nainstalovaný – PDF prezentací se nevytvoří.');
	process.exit(0);
}

const SLOZKA = path.resolve('dist/prezentace');
const nazvy = fs.readdirSync(SLOZKA).filter((n) => fs.existsSync(path.join(SLOZKA, n, 'offline.html')));

const prohlizec = await chromium.launch();
const stranka = await prohlizec.newPage({ viewport: { width: 1280, height: 720 } });
for (const nazev of nazvy) {
	await stranka.goto(pathToFileURL(path.join(SLOZKA, nazev, 'offline.html')).href, { waitUntil: 'load' });
	await stranka.evaluate(() => document.fonts.ready);
	const cil = path.join(SLOZKA, nazev, `${nazev}.pdf`);
	await stranka.pdf({ path: cil, preferCSSPageSize: true, printBackground: true });
	console.log(`[prezentace-pdf] ${nazev}.pdf (${Math.round(fs.statSync(cil).size / 1024)} kB)`);
}
await prohlizec.close();
