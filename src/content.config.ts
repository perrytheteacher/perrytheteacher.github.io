import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema({
		// novinky: false – stránka se nezobrazí v sekci Novinky
		// prezentace: <nazev> – kapitola dostane nahoře tlačítko na /prezentace/<nazev>/
		extend: z.object({ novinky: z.boolean().optional(), prezentace: z.string().optional() }),
	}) }),
};
