import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const categories = {
  'wiener-geflecht': 'Wiener Geflecht',
  polsterung: 'Polsterung & Bespannung',
  holz: 'Holzrestaurierung',
} as const;

const categoryKey = z.enum(Object.keys(categories) as [keyof typeof categories]);

const projekte = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projekte' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        category: categoryKey,
        date: z.coerce.date(),
        summary: z.string().max(200),
        cover: image(),
        coverAlt: z.string(),
        images: z.array(z.object({ src: image(), alt: z.string() })).default([]),
        before: image().optional(),
        beforeAlt: z.string().optional(),
        after: image().optional(),
        afterAlt: z.string().optional(),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
      })
      .refine((p) => !p.before === !p.after, {
        message: 'Vorher- und Nachher-Bild müssen beide gesetzt sein (oder beide leer).',
      }),
});

const leistungen = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/leistungen' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: categoryKey,
      order: z.number(),
      summary: z.string().max(200),
      image: image(),
      imageAlt: z.string(),
    }),
});

const seiten = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/seiten' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { projekte, leistungen, seiten };
