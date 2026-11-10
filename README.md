# Perry the Teacher – chemie, biologie a AI pro gymnázia

Web: https://perrytheteacher.github.io

## Kde co je

- `src/content/docs/chemie/<oblast>/`, `biologie/<oblast>/`, `ai/` – kapitoly podle předmětů a oblastí (jeden soubor = jedna kapitola; nová oblast se přidává i do menu v `astro.config.mjs`)
- Dlaždice: `<Mrizka><Dlazdice href="/chemie/" nazev="Chemie" popis="..." ikona="chemie" barva="modra" /></Mrizka>`
- `src/content/docs/pro-ucitele/` – metodická vrstva pro učitele
- `public/aplikace/` – vlastní HTML aplikace (každá ve své složce se souborem `index.html`)
- `public/obrazky/` – obrázky (vložíte je do kapitoly zápisem `![popis](/obrazky/nazev.png)`)
- `astro.config.mjs` – název webu a menu

## Co lze v kapitole používat

- Aplikace: `<Aplikace src="/aplikace/nazev/" title="Popis" vyska={600} />`
- Video: `<YouTube id="KÓD_VIDEA" title="Název" />`
- Otázka: `<Otazka zadani="..." moznosti={["A", "B"]} spravne={0} vysvetleni="..." />`
- Rámeček: `:::note`, `:::tip`, `:::caution` … `:::`
- Chemické vzorce: `H<sub>2</sub>SO<sub>4</sub>`

## Úprava obsahu

Otevřete soubor na GitHubu, klikněte na tužku, upravte a dejte **Commit changes**.
Web se sám aktualizuje zhruba do dvou minut (průběh vidíte na záložce **Actions**).
