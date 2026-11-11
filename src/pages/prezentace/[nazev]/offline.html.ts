// Offline verze prezentace: z public/prezentace/<nazev>/index.html vytvoří při sestavení webu
// jeden soběstačný soubor /prezentace/<nazev>/offline.html – styl, skript, obrázky (base64)
// i vložené aplikace jsou uvnitř, takže prezentace běží bez internetu (otevřením souboru v prohlížeči).
// Nic se tu nemusí upravovat: každá nová prezentace v public/prezentace/ dostane offline verzi automaticky.
import type { APIRoute, GetStaticPaths } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

const PUBLIC = path.resolve('public');
const SLOZKA = path.join(PUBLIC, 'prezentace');
const WEB = 'https://perrytheteacher.github.io';

const MIME: Record<string, string> = {
	'.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
	'.svg': 'image/svg+xml', '.webp': 'image/webp',
};

export const getStaticPaths: GetStaticPaths = () =>
	fs.readdirSync(SLOZKA, { withFileTypes: true })
		.filter((d) => d.isDirectory() && fs.existsSync(path.join(SLOZKA, d.name, 'index.html')))
		.map((d) => ({ params: { nazev: d.name } }));

/** Cesta /neco/ nebo /neco/soubor z webu → soubor ve složce public (nebo null). */
function soubor(url: string): string | null {
	const cista = decodeURI(url.split(/[?#]/)[0]);
	let p = path.join(PUBLIC, cista);
	if (cista.endsWith('/')) p = path.join(p, 'index.html');
	return p.startsWith(PUBLIC) && fs.existsSync(p) && fs.statSync(p).isFile() ? p : null;
}

const atribut = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

export const GET: APIRoute = ({ params }) => {
	let html = fs.readFileSync(path.join(SLOZKA, params.nazev!, 'index.html'), 'utf8');

	// 1) sdílený styl a skript vložit přímo do stránky
	html = html.replace(/<link rel="stylesheet" href="(\/[^"]+)"\s*\/?>/g, (cely, url) => {
		const p = soubor(url);
		return p ? `<style>\n${fs.readFileSync(p, 'utf8')}\n</style>` : cely;
	});
	html = html.replace(/<script src="(\/[^"]+)"><\/script>/g, (cely, url) => {
		const p = soubor(url);
		return p ? `<script>\n${fs.readFileSync(p, 'utf8').replace(/<\/script/gi, '<\\/script')}\n</script>` : cely;
	});

	// 2) obrázky prezentace jako base64
	html = html.replace(/(\ssrc=|url\()(["']?)(\/[^"')]+\.(?:png|jpe?g|gif|svg|webp))\2/gi, (cely, pred, uv, url) => {
		const p = soubor(url);
		if (!p) return cely;
		const data = fs.readFileSync(p).toString('base64');
		return `${pred}${uv}data:${MIME[path.extname(p).toLowerCase()]};base64,${data}${uv}`;
	});

	// 3) ostatní odkazy na web (kapitoly, metodika) – plná adresa, aby fungovaly i ze souboru
	html = html.replace(/(\shref=")(\/[^"]*)"/g, (_c, pred, url) => `${pred}${WEB}${url}"`);

	// 4) vložené aplikace: místo odkazu celý soběstačný HTML soubor aplikace (srcdoc);
	//    až nakonec, aby se předchozí úpravy netýkaly vnitřku aplikací
	html = html.replace(/<iframe([^>]*?)\sdata-src="(\/[^"]+)"([^>]*)>/g, (cely, pred, url, po) => {
		const p = soubor(url);
		return p ? `<iframe${pred} data-online="${WEB}${url}" srcdoc="${atribut(fs.readFileSync(p, 'utf8'))}"${po}>` : cely;
	});

	return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
