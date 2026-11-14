// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sesselwerkstatt.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/kontakt/danke/'),
    }),
  ],
  // Alte Hugo-URLs weiterleiten, damit bestehende Links und Google-Einträge nicht ins Leere gehen.
  redirects: {
    '/pages/gallery': '/projekte/',
    '/pages/contact': '/kontakt/',
    '/pages/imprint': '/impressum/',
    '/pages/privacy': '/datenschutz/',
    '/posts/post1': '/leistungen/polsterung/',
    '/posts/post2': '/leistungen/wiener-geflecht/',
    '/posts': '/leistungen/',
    '/pages': '/',
  },
});
