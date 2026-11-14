interface Env {
  MAILER: SendEmail;
  MAIL_FROM: string;
  MAIL_TO: string;
  SITE: string;
}

/** Schneller abgeschickt als das gilt als Bot (Formular wird beim Laden mit Zeitstempel versehen). */
const MIN_FILL_MS = 3000;
const LIMITS = { name: 200, email: 254, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.replace(/\/$/, '') !== '/api/kontakt') return new Response('Not found', { status: 404 });
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });

    const redirect = (path: string) => Response.redirect(new URL(path, env.SITE).href, 303);
    const failed = (reason: string) => redirect(`/kontakt/?fehler=${reason}#formular`);

    // Nur Einsendungen von der eigenen Seite annehmen.
    const origin = request.headers.get('Origin');
    if (origin && origin !== new URL(env.SITE).origin) return new Response('Forbidden', { status: 403 });

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return failed('eingabe');
    }
    const field = (key: string) => String(form.get(key) ?? '').trim();

    // Spam-Schutz: Köderfeld ausgefüllt oder zu schnell abgeschickt → so tun, als hätte es geklappt.
    const startedAt = Number(field('t'));
    const tooFast = startedAt > 0 && Date.now() - startedAt < MIN_FILL_MS;
    if (field('website') || tooFast) return redirect('/kontakt/danke/');

    // Zeilenumbrüche aus Name entfernen, damit keine Mail-Header eingeschleust werden können.
    const name = field('name').replace(/[\r\n]+/g, ' ');
    const email = field('email');
    const message = field('message');
    const projekt = field('projekt').replace(/[\r\n]+/g, ' ').slice(0, 200);
    const valid =
      name.length > 0 &&
      name.length <= LIMITS.name &&
      email.length <= LIMITS.email &&
      EMAIL_RE.test(email) &&
      message.length > 0 &&
      message.length <= LIMITS.message &&
      form.get('privacy') !== null;
    if (!valid) return failed('eingabe');

    try {
      await env.MAILER.send({
        from: { name: 'Sesselwerkstatt Website', email: env.MAIL_FROM },
        to: env.MAIL_TO,
        replyTo: { name, email },
        subject: projekt ? `Anfrage zu „${projekt}“ von ${name}` : `Kontaktanfrage von ${name}`,
        text: [
          `Name: ${name}`,
          `E-Mail: ${email}`,
          ...(projekt ? [`Projekt: ${projekt}`] : []),
          '',
          message,
          '',
          '—',
          `Gesendet über das Kontaktformular auf ${new URL(env.SITE).host}. „Antworten“ geht direkt an den Absender.`,
        ].join('\n'),
      });
    } catch (error) {
      console.error('Versand fehlgeschlagen', error);
      return failed('versand');
    }

    return redirect('/kontakt/danke/');
  },
} satisfies ExportedHandler<Env>;
