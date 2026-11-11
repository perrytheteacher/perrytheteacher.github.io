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

## Novinky

Sekce **Novinky** na titulní stránce (6 posledních) a stránka `/novinky/` (30 posledních) se plní samy z historie gitu při každém sestavení webu – nic se nepíše ručně (komponenta `src/components/Novinky.astro`).

- Nová kapitola nebo metodika = štítek **Nové**, pozdější úprava = **Aktualizováno**.
- Drobnou opravu, která nemá být novinkou, označte ve zprávě commitu `[bez novinky]`.
- Hromadné úpravy (commit měnící víc než 4 kapitoly naráz) a samotné přečíslování se nepočítají.
- Stránku lze z novinek úplně vyřadit ve frontmatteru: `novinky: false`.

## Export do PDF

Každá kapitola (a metodika) má pod nadpisem tlačítka **Export do PDF** (zápis a procvičování bez řešení, s místem na odpovědi) a **PDF s řešením**. Otevřou tiskový dialog prohlížeče, kde se zvolí „Uložit jako PDF“. Aplikace se v PDF nahradí odkazem. Nastavení je v `src/components/Nadpis.astro` a ve `vlastni.css` (část `@media print`).

## Úprava obsahu

Otevřete soubor na GitHubu, klikněte na tužku, upravte a dejte **Commit changes**.
Web se sám aktualizuje zhruba do dvou minut (průběh vidíte na záložce **Actions**).
