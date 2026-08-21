import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Luxe invitation and confirmed event details", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Anthony/);
  assert.match(html, /Alexandra/);
  assert.match(html, /05 · 12 · 2026/);
  assert.match(html, /4:00 p\. m\./);
  assert.match(html, /Finca Amada/);
  assert.match(html, /San Sebastián, Puerto Rico/);
  assert.match(html, /Abrir pin en Google Maps/);
  assert.match(html, /Añadir al calendario/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("publishes the guest rules clearly", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /Solamente rosa nude o blanco/);
  assert.match(html, /Ningún otro color/);
  assert.match(html, /un solo acompañante/i);
  assert.match(html, /No niños/);
  assert.match(html, /exclusivamente para adultos/i);
});

test("renders the interactive Love Story with fourteen wedding photographs", async () => {
  const response = await render();
  const html = await response.text();
  const tunnelCards = html.match(/class="loveTunnelCard"/g) ?? [];

  assert.equal(tunnelCards.length, 14);
  assert.match(html, /El comienzo de/);
  assert.match(html, /nuestro <em>para siempre<\/em>/);
  assert.match(html, /Acelerar los recuerdos/);
  assert.match(html, /Mantén presionada la galería para avanzar/);
  assert.match(html, /love-story%2Flove-14\.jpeg/);
});

test("keeps responsive, reduced-motion, and private dashboard safeguards", async () => {
  const [css, loveStory, dashboard, auth] = await Promise.all([
    readFile(new URL("app/globals.css", projectRoot), "utf8"),
    readFile(new URL("app/components/LoveStoryTunnel.tsx", projectRoot), "utf8"),
    readFile(new URL("app/dashboard/page.tsx", projectRoot), "utf8"),
    readFile(new URL("app/chatgpt-auth.ts", projectRoot), "utf8"),
  ]);

  assert.match(css, /@media\(max-width:520px\)/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(loveStory, /aria-pressed=\{accelerated\}/);
  assert.match(dashboard, /export const dynamic = "force-dynamic"/);
  assert.match(dashboard, /DASHBOARD_ALLOWED_EMAILS/);
  assert.match(auth, /oai-authenticated-user-email/);
});
