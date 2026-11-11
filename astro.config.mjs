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
							// Obecná chemie má podskupinu Atom → Elektronový obal (složka atom/elektronovy-obal/).
							// Další kapitoly přidejte do items jako { slug: 'chemie/obecna-chemie/…' }.
							label: 'Obecná chemie',
							collapsed: true,
							items: [
								{ slug: 'chemie/obecna-chemie', label: 'Přehled' },
								{
									label: 'Atom',
									collapsed: true,
									items: [
										{ slug: 'chemie/obecna-chemie/01-stavba-atomu' },
										{
											label: 'Elektronový obal',
											collapsed: true,
											items: [{ autogenerate: { directory: 'chemie/obecna-chemie/atom/elektronovy-obal' } }],
										},
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
								{ slug: 'chemie/anorganicka-chemie/stavebnice-iontu', label: 'Stavebnice iontů' },
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
