# Kontaktformular (Cloudflare Worker)

Das Formular auf `/kontakt/` schickt an `https://sesselwerkstatt.com/api/kontakt`. Dort läuft ein kleiner
Cloudflare Worker (`worker/src/index.ts`), der die Eingaben prüft und die Nachricht über
**Cloudflare Email Routing** als E-Mail weiterleitet. Kein externer Formular-Dienst, keine Datenbank.

- Antworten im Mailprogramm gehen direkt an den Absender (Reply-To).
- Spam-Schutz: unsichtbares Köderfeld + Mindest-Ausfüllzeit (3 s). Verdächtige Einsendungen werden still verworfen.
- Fehler (fehlende Felder, Versand fehlgeschlagen) landen wieder auf `/kontakt/?fehler=…` mit Hinweis.

## Einmalige Einrichtung

Voraussetzung: Email Routing ist für sesselwerkstatt.com aktiv (ist es bereits) und die Adresse, an die
`info@` weiterleitet, ist unter **Email → Email Routing → Destination addresses** als *verified* gelistet.

1. **API-Token anlegen** – Cloudflare Dashboard → *My Profile → API Tokens → Create Token* →
   Vorlage **„Edit Cloudflare Workers“**. Bei *Zone Resources* `sesselwerkstatt.com` auswählen.
2. **Account-ID** kopieren – steht rechts auf der Übersichtsseite der Domain.
3. **GitHub-Secrets anlegen** – Repo → *Settings → Secrets and variables → Actions*:
   - `CLOUDFLARE_API_TOKEN` = Token aus Schritt 1
   - `CLOUDFLARE_ACCOUNT_ID` = ID aus Schritt 2
4. **Worker einmal deployen** – Repo → *Actions → Deploy contact worker → Run workflow*
   (danach passiert das automatisch bei jeder Änderung unter `worker/`).
5. **Zieladresse als Secret setzen** – einmalig lokal:
   ```sh
   cd worker
   npm install
   npx wrangler login
   npx wrangler secret put MAIL_TO   # die verifizierte Zieladresse eingeben
   ```
   (Alternativ im Dashboard: *Workers & Pages → sesselwerkstatt-kontakt → Settings → Variables and Secrets*.)
6. **Testen** – auf sesselwerkstatt.com/kontakt/ eine Nachricht schicken (nicht zu schnell 😉).

Fehlersuche: *Workers & Pages → sesselwerkstatt-kontakt → Logs* bzw. lokal `npx wrangler tail`.

## Lokal entwickeln

```sh
cd worker
npx wrangler dev          # Worker auf http://localhost:8787, Mails werden nur simuliert
```
