// @ts-check
// Hlavní nastavení webu. Měníte tu hlavně název a pořadí oddílů v menu.
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	// Až budete znát adresu webu, doplňte ji sem, např. 'https://perka-chemie.github.io'
	// site: 'https://vasejmeno.github.io',
	integrations: [
		starlight({
			title: 'Chemie pro gymnázia',
			description: 'Webová učebnice chemie s procvičováním, kritickým myšlením a metodikou pro učitele.',
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
					label: 'Kapitoly',
					items: [{ autogenerate: { directory: 'kapitoly' } }],
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
