// @ts-check
// Hlavní nastavení webu. Měníte tu hlavně název a pořadí oddílů v menu.
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

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
			},
			sidebar: [
				{ label: 'Úvod', slug: 'uvod' },
				{
					label: 'Chemie',
					items: [{ autogenerate: { directory: 'chemie' } }],
				},
				{
					label: 'Biologie',
					items: [{ autogenerate: { directory: 'biologie' } }],
				},
				{
					label: 'Umělá inteligence',
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
