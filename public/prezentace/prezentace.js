/* Perry the Teacher – prezentace na hodinu (sdílený engine pro public/prezentace/*)
   Ovládání: → / mezerník / PgDn další krok · ← / PgUp zpět · Home/End · F celá obrazovka · N poznámky
             O přehled snímků · T časovač (data-cas="minuty") · B černá obrazovka · H nápověda · číslo + Enter skok */
(function () {
	const W = 1280, H = 720;
	const deck = document.querySelector('.deck');
	const slides = [...deck.querySelectorAll('.slide')];
	let i = 0, krok = 0;

	// --- UI ---
	const prubeh = el('div', 'prubeh');
	const casovac = el('div', 'casovac');
	const panel = el('div', 'panel-poznamky');
	const cerna = el('div', 'cerna');
	const prehled = el('div', 'prehled');
	const napoveda = el('div', 'napoveda');
	napoveda.innerHTML = `<div class="in"><h3 style="margin-top:0">Ovládání prezentace</h3><table>
	<tr><td><kbd>→</kbd> <kbd>mezerník</kbd> <kbd>PgDn</kbd></td><td>další krok / snímek (funguje i prezentér)</td></tr>
	<tr><td><kbd>←</kbd> <kbd>PgUp</kbd></td><td>zpět</td></tr>
	<tr><td><kbd>F</kbd></td><td>celá obrazovka</td></tr>
	<tr><td><kbd>N</kbd></td><td>poznámky pro učitele (otázky, postup, miskoncepce)</td></tr>
	<tr><td><kbd>T</kbd></td><td>spustit / zastavit časovač aktivity</td></tr>
	<tr><td><kbd>O</kbd></td><td>přehled snímků</td></tr>
	<tr><td><kbd>B</kbd></td><td>černá obrazovka (pozornost na tabuli)</td></tr>
	<tr><td><kbd>Home</kbd> <kbd>End</kbd></td><td>první / poslední snímek</td></tr>
	<tr><td>číslo + <kbd>Enter</kbd></td><td>skok na snímek</td></tr></table>
	<p style="margin-bottom:0">Na dotykovém zařízení přejeďte prstem doleva/doprava. Kliknutím kamkoli zavřete.</p></div>`;
	const lista = el('div', 'lista');
	lista.innerHTML = `<button data-a="zpet" title="Zpět (←)">◀</button><button data-a="dal" title="Další (→)">▶</button>
	<span class="cislo"></span><span class="nazev"></span>
	<button data-a="cas" title="Časovač aktivity (T)">⏱ <span class="cas-txt"></span></button>
	<button data-a="poz" title="Poznámky pro učitele (N)">Poznámky</button>
	<button data-a="pre" title="Přehled snímků (O)">Přehled</button>
	<button data-a="fs" title="Celá obrazovka (F)">⛶ Celá obrazovka</button>
	<button data-a="nap" title="Nápověda (H)">?</button>`;
	document.body.append(prubeh, casovac, panel, cerna, prehled, napoveda, lista);

	// --- aplikace v PDF / tisku: pod každé okno aplikace odkaz na online verzi (zobrazí se jen při tisku) ---
	document.querySelectorAll('iframe.app').forEach((f) => {
		const url = f.dataset.online || (f.dataset.src ? new URL(f.dataset.src, 'https://perrytheteacher.github.io').href : '');
		const t = el('div', 'app-tisk');
		t.innerHTML = `<div>Interaktivní aplikace <b>„${f.title || 'aplikace'}“</b></div>` + (url ? `<a href="${url}">${url}</a>` : '');
		f.after(t);
	});
	function el(tag, cls) { const e = document.createElement(tag); e.className = cls; return e; }

	// --- škálování 16:9 ---
	function meritko() {
		const s = Math.min(innerWidth / W, innerHeight / H);
		slides.forEach((sl) => (sl.style.transform = `scale(${s})`));
	}
	addEventListener('resize', meritko);

	// --- navigace ---
	const frag = (sl) => [...sl.querySelectorAll('.f')];
	function ukaz(n, k) {
		n = Math.max(0, Math.min(slides.length - 1, n));
		if (n !== i) zastavCas();
		slides[i].classList.remove('on');
		i = n;
		const sl = slides[i];
		sl.classList.add('on');
		const fr = frag(sl);
		krok = k === 'konec' ? fr.length : k || 0;
		fr.forEach((f, j) => { f.classList.toggle('vid', j < krok); f.classList.toggle('minula', j < krok - 1); });
		sl.querySelectorAll('iframe[data-src]').forEach((f) => { if (!f.src) f.src = f.dataset.src; });
		prubeh.style.width = ((i + 1) / slides.length) * 100 + '%';
		lista.querySelector('.cislo').textContent = `${i + 1} / ${slides.length}`;
		lista.querySelector('.nazev').textContent = titulek(sl);
		const cas = sl.dataset.cas;
		lista.querySelector('[data-a=cas]').style.display = cas ? '' : 'none';
		lista.querySelector('.cas-txt').textContent = cas ? cas + ' min' : '';
		const p = sl.querySelector('.poznamky');
		panel.innerHTML = `<h4>Poznámky pro učitele · snímek ${i + 1}</h4>` + (p ? p.innerHTML : '<p>K tomuto snímku nejsou poznámky.</p>');
		history.replaceState(null, '', '#' + (i + 1));
		prehled.querySelectorAll('.nahled').forEach((x, j) => x.classList.toggle('akt', j === i));
	}
	function dal() { const fr = frag(slides[i]); if (krok < fr.length) { krok++; fr.forEach((f, j) => { f.classList.toggle('vid', j < krok); f.classList.toggle('minula', j < krok - 1); }); } else if (i < slides.length - 1) ukaz(i + 1); }
	function zpet() { const fr = frag(slides[i]); if (krok > 0) { krok--; fr.forEach((f, j) => { f.classList.toggle('vid', j < krok); f.classList.toggle('minula', j < krok - 1); }); } else if (i > 0) ukaz(i - 1, 'konec'); }
	function titulek(sl) { const h = sl.querySelector('h1,h2'); return sl.dataset.titulek || (h ? h.textContent.trim() : ''); }

	// --- časovač ---
	let tmr = null, zbyva = 0;
	function startCas() {
		const m = parseFloat(slides[i].dataset.cas || '0'); if (!m) return;
		if (tmr) { zastavCas(); return; }
		zbyva = Math.round(m * 60); casovac.classList.add('bezi'); casovac.classList.remove('konec'); kresli();
		tmr = setInterval(() => { zbyva--; kresli(); if (zbyva <= 0) { clearInterval(tmr); tmr = null; casovac.classList.add('konec'); setTimeout(() => casovac.classList.remove('bezi', 'konec'), 6000); } }, 1000);
		lista.querySelector('[data-a=cas]').classList.add('on');
	}
	function zastavCas() { if (tmr) clearInterval(tmr); tmr = null; casovac.classList.remove('bezi', 'konec'); lista.querySelector('[data-a=cas]').classList.remove('on'); }
	function kresli() { const z = Math.max(0, zbyva); casovac.textContent = Math.floor(z / 60) + ':' + String(z % 60).padStart(2, '0'); }

	// --- přepínače ---
	function fs() { if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {}); else document.exitFullscreen?.(); }
	function poz() { panel.classList.toggle('on'); lista.querySelector('[data-a=poz]').classList.toggle('on', panel.classList.contains('on')); }
	function pre() {
		if (!prehled.childElementCount) prehled.innerHTML = slides.map((s, j) => `<div class="nahled" data-j="${j}"><span class="n">${j + 1}</span>${titulek(s)}<span class="t">${s.dataset.typ ? typText(s) : ''}${s.dataset.cas ? ' · ' + s.dataset.cas + ' min' : ''}</span></div>`).join('');
		prehled.classList.toggle('on'); prehled.querySelectorAll('.nahled').forEach((x, j) => x.classList.toggle('akt', j === i));
	}
	function typText(s) { return getComputedStyle(s, '::before').content.replace(/^"|"$/g, ''); }
	prehled.addEventListener('click', (e) => { const n = e.target.closest('.nahled'); if (!n) return; prehled.classList.remove('on'); ukaz(+n.dataset.j); });
	napoveda.addEventListener('click', () => napoveda.classList.remove('on'));
	cerna.addEventListener('click', () => cerna.classList.remove('on'));
	lista.addEventListener('click', (e) => {
		const b = e.target.closest('button'); if (!b) return; b.blur();
		({ zpet, dal, cas: startCas, poz, pre, fs, nap: () => napoveda.classList.toggle('on') })[b.dataset.a]();
	});

	// --- klávesy ---
	let cislo = '';
	addEventListener('keydown', (e) => {
		if (e.target.closest && e.target.closest('input,textarea,select')) return;
		const k = e.key;
		if (/^[0-9]$/.test(k)) { cislo += k; return; }
		if (k === 'Enter' && cislo) { ukaz(+cislo - 1); cislo = ''; return; }
		cislo = '';
		if (['ArrowRight', 'PageDown', ' ', 'Enter', 'ArrowDown'].includes(k)) { e.preventDefault(); dal(); }
		else if (['ArrowLeft', 'PageUp', 'ArrowUp', 'Backspace'].includes(k)) { e.preventDefault(); zpet(); }
		else if (k === 'Home') ukaz(0);
		else if (k === 'End') ukaz(slides.length - 1);
		else if (k === 'f' || k === 'F') fs();
		else if (k === 'n' || k === 'N') poz();
		else if (k === 'o' || k === 'O' || k === 'Escape') { if (k === 'Escape') { prehled.classList.remove('on'); napoveda.classList.remove('on'); cerna.classList.remove('on'); } else pre(); }
		else if (k === 't' || k === 'T') startCas();
		else if (k === 'b' || k === 'B' || k === '.') cerna.classList.toggle('on');
		else if (k === 'h' || k === 'H' || k === '?') napoveda.classList.toggle('on');
	});
	// klik na snímek = další krok (mimo odkazy, tlačítka a aplikace)
	deck.addEventListener('click', (e) => { if (e.target.closest('a,button,iframe,input,select,details')) return; dal(); });
	// dotyk
	let tx = null;
	deck.addEventListener('touchstart', (e) => (tx = e.touches[0].clientX), { passive: true });
	deck.addEventListener('touchend', (e) => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) (dx < 0 ? dal : zpet)(); tx = null; });
	// lišta se v celé obrazovce schová, když se nehýbe myš
	let skryj;
	function lis() { lista.classList.remove('skryta'); clearTimeout(skryj); if (document.fullscreenElement) skryj = setTimeout(() => { if (!panel.classList.contains('on')) lista.classList.add('skryta'); }, 2500); }
	addEventListener('mousemove', lis); document.addEventListener('fullscreenchange', () => { lis(); lista.querySelector('[data-a=fs]').classList.toggle('on', !!document.fullscreenElement); });

	meritko();
	const start = parseInt(location.hash.slice(1), 10);
	slides.forEach((s) => s.classList.remove('on'));
	slides[0].classList.add('on');
	ukaz(isNaN(start) ? 0 : start - 1);
})();
