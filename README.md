# Sesselwerkstatt

Website von [sesselwerkstatt.com](https://sesselwerkstatt.com) – gebaut mit [Astro](https://astro.build), gehostet auf GitHub Pages, Inhalte pflegbar über [Pages CMS](https://pagescms.org).

## Entwicklung

```sh
nvm use          # Node 22 (siehe .nvmrc)
npm install
npm run dev      # http://localhost:4321
npm run build    # Typcheck + statischer Build nach dist/
```

## Struktur

| Pfad | Inhalt |
| --- | --- |
| `src/content/projekte/*.md` | Ein Projekt pro Datei → `/projekte/<dateiname>/` |
| `src/content/leistungen/*.md` | Leistungsseiten → `/leistungen/<dateiname>/` |
| `src/content/seiten/*.md` | Impressum, Datenschutz |
| `src/data/site.json` | Name, Adresse, E-Mail |
| `worker/` | Cloudflare Worker für das Kontaktformular (`/api/kontakt`), siehe [docs/KONTAKTFORMULAR.md](docs/KONTAKTFORMULAR.md) |
| `src/assets/projekte/` | Projekt- und Leistungsbilder (Upload-Ordner des CMS) |
| `src/assets/site/` | Feste Bilder für Startseite, Logo, Kontakt |
| `src/content.config.ts` | Schema aller Inhalte (muss zu `.pages.yml` passen) |
| `.pages.yml` | Formulare für Pages CMS |

Bilder werden beim Build automatisch verkleinert und nach AVIF/WebP konvertiert.
Deploy: jeder Push auf `main` baut und veröffentlicht über `.github/workflows/deploy.yml`.

Anleitung für die Redaktion: [docs/INHALTE-PFLEGEN.md](docs/INHALTE-PFLEGEN.md)
