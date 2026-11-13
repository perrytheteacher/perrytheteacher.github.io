// @ts-check
// Hlavní nastavení webu. Měníte tu hlavně název a pořadí oddílů v menu.
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

/** Sbalitelná skupina menu, která automaticky obsahuje všechny kapitoly ze složky. */
const oblast = (label, directory) => ({
	label,
	collapsed: true,
	items: [{ autogenerate: { directory } }],
});

export default defineConfig({
	site: 'https://perrytheteacher.github.io',
	// Přesunuté stránky – stará adresa přesměruje na novou.
	redirects: {
		'/chemie/anorganicka-chemie/stavebnice-iontu/': '/chemie/anorganicka-chemie/nazvoslovi/stavebnice-iontu/',
	},
	integrations: [
		starlight({
			title: 'Perry the Teacher',
			description: 'Chemie, biologie a AI pro gymnázia – výklad, procvičování, kritické myšlení a metodika pro učitele.',
			defaultLocale: 'root',
			locales: {
				root: { label: 'Čeština', lang: 'cs' },
			},
			customCss: ['./src/styles/vlastni.css'],
			components: {
				Footer: './src/components/Paticka.astro',
				PageTitle: './src/components/Nadpis.astro',
			},
			// Menu. Pořadí podkapitol se řídí pořadím v seznamech níže.
			// Novou oblast přidáte řádkem oblast('Název', 'cesta/ke/slozce').
			sidebar: [
				{ label: 'Úvod', slug: 'uvod' },
				{ label: 'Novinky', slug: 'novinky' },
				{
					label: 'Chemie',
					collapsed: true,
					items: [
						{ label: 'Přehled', slug: 'chemie' },
						{
							// Obecná chemie má podskupinu Atom (složka atom/). Kapitoly o atomu jsou zatím archivované ve složce archiv/atom/
							// (nejsou na webu); veřejná je jen aplikace k elektronovému obalu.
							// Další kapitoly přidejte do items jako { slug: 'chemie/obecna-chemie/…' }.
							label: 'Obecná chemie',
							collapsed: true,
							items: [
								{ slug: 'chemie/obecna-chemie', label: 'Přehled' },
								{
									// Nové kapitoly o atomu přidejte sem jako { slug: 'chemie/obecna-chemie/atom/…' }.
									label: 'Atom',
									collapsed: true,
									items: [
										{ slug: 'chemie/obecna-chemie/atom/elektronovy-obal/aplikace', label: 'Aplikace: elektronový obal' },
									],
								},
							],
						},
						{
							// Anorganická chemie má podskupinu Názvosloví (složka nazvoslovi/).
							// Další kapitoly mimo názvosloví přidejte do items jako { slug: 'chemie/anorganicka-chemie/…' }.
							label: 'Anorganická chemie',
							collapsed: true,
							items: [
								{ slug: 'chemie/anorganicka-chemie', label: 'Přehled' },
								{
									label: 'Názvosloví',
									collapsed: true,
									items: [{ autogenerate: { directory: 'chemie/anorganicka-chemie/nazvoslovi' } }],
								},
							],
						},
						oblast('Organická chemie', 'chemie/organicka-chemie'),
						oblast('Biochemie', 'chemie/biochemie'),
					],
				},
				{
					label: 'Biologie',
					collapsed: true,
					items: [
						{ label: 'Přehled', slug: 'biologie' },
						oblast('Obecná biologie', 'biologie/obecna-biologie'),
						oblast('Buněčná biologie', 'biologie/bunecna-biologie'),
						oblast('Mykologie', 'biologie/mykologie'),
						oblast('Botanika', 'biologie/botanika'),
						oblast('Zoologie', 'biologie/zoologie'),
						oblast('Antropologie', 'biologie/antropologie'),
						oblast('Genetika', 'biologie/genetika'),
						oblast('Ekologie', 'biologie/ekologie'),
					],
				},
				{
					label: 'Umělá inteligence',
					collapsed: true,
					items: [{ autogenerate: { directory: 'ai' } }],
				},
				{
					label: 'Pro učitele',
					collapsed: true,
					items: [{ autogenerate: { directory: 'pro-ucitele' } }],
				},
			],
		}),
	],
});
