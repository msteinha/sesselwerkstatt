import { getCollection } from 'astro:content';
import site from '../data/site.json';

export { site };

/** Absolute URL for a site-relative path (for canonical, OG and JSON-LD). */
export function absolute(path: string, base: URL | undefined): string {
  return new URL(path, base ?? 'https://sesselwerkstatt.com').href;
}

/** schema.org business entity, used on every page. */
export function businessJsonLd(base: URL | undefined, image: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': absolute('/#business', base),
    name: site.name,
    description: site.description,
    url: absolute('/', base),
    image,
    email: site.email,
    ...(site.phone ? { telephone: site.phone } : {}),
    founder: { '@type': 'Person', name: site.owner },
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.streetAddress,
      postalCode: site.postalCode,
      addressLocality: site.addressLocality,
      addressRegion: site.addressRegion,
      addressCountry: site.addressCountry,
    },
    areaServed: site.areaServed.map((name) => ({ '@type': 'Place', name })),
    knowsAbout: ['Wiener Geflecht', 'Polsterung', 'Bespannung', 'Möbelrestaurierung', 'Bugholzmöbel'],
  };
}

export function breadcrumbJsonLd(items: { name: string; href: string }[], base: URL | undefined) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absolute(item.href, base),
    })),
  };
}

/** Published projects: featured first, then newest first. */
export async function getProjects() {
  const projects = await getCollection('projekte', ({ data }) => !data.draft);
  return projects.sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) ||
      b.data.date.getTime() - a.data.date.getTime() ||
      a.data.title.localeCompare(b.data.title, 'de'),
  );
}

export async function getServices() {
  const services = await getCollection('leistungen');
  return services.sort((a, b) => a.data.order - b.data.order);
}
