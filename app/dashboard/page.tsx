import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { chatGPTSignOutPath, requireChatGPTUser } from "../chatgpt-auth";
import { Countdown } from "../components/Countdown";
import { luxeMissingInfo } from "../wedding-data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Panel privado | Anthony & Alexandra",
  description: "Panel privado de gestión de la boda.",
  robots: { index: false, follow: false },
  openGraph: { title: "Panel privado | Anthony & Alexandra", description: "Panel privado de gestión de la boda.", images: [] },
  twitter: { title: "Panel privado | Anthony & Alexandra", description: "Panel privado de gestión de la boda.", images: [] },
};

async function getAuthorizedUser() {
  if (process.env.NODE_ENV === "development") return { displayName: "Vista local", email: "local@preview", userId: "local", fullName: "Vista local" };
  const user = await requireChatGPTUser("/dashboard");
  const allowed = (process.env.DASHBOARD_ALLOWED_EMAILS ?? "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  if (!allowed.includes(user.email.toLowerCase())) redirect("/");
  return user;
}

export default async function Dashboard() {
  const user = await getAuthorizedUser();
  return (
    <main className="dashboard">
      <aside className="dashSidebar">
        <div className="dashLogo">A <i>&</i> A</div>
        <nav aria-label="Panel privado"><a className="active" href="#resumen">Resumen</a><a href="#invitados">Invitados</a><a href="#pendientes">Pendientes</a><Link href="/">Ver invitación ↗</Link></nav>
        <div className="dashUser"><span>{user.displayName.slice(0, 1).toUpperCase()}</span><div><b>{user.displayName}</b><small>Administrador</small></div></div>
      </aside>
      <div className="dashMain">
        <header className="dashHeader"><div><p>Panel privado</p><h1>La boda de Anthony & Alexandra</h1></div>{process.env.NODE_ENV !== "development" && <a href={chatGPTSignOutPath("/")}>Cerrar sesión</a>}</header>
        <section className="dashHero" id="resumen"><div><span>Sábado</span><strong>05</strong><p>Diciembre · 2026</p></div><div><p>Faltan</p><Countdown target="2026-12-05T16:00:00-04:00" /></div></section>
        <section className="dashStats" id="invitados">
          <article><span>Invitados registrados</span><strong>0</strong><small>Lista por completar</small></article>
          <article><span>Confirmados</span><strong>0</strong><small>R.S.V.P. pendiente</small></article>
          <article><span>Acompañantes</span><strong>0</strong><small>Máximo uno por invitado</small></article>
          <article><span>Fotos por moderar</span><strong>0</strong><small>Álbum privado Luxe</small></article>
          <article><span>Recordatorios</span><strong>0</strong><small>Programación pendiente</small></article>
          <article><span>Presupuesto</span><strong>—</strong><small>Costos por registrar</small></article>
        </section>
        <div className="dashColumns">
          <section className="dashCard"><div className="cardHead"><div><p>Datos del evento</p><h2>Información publicada</h2></div><span>Actualizado</span></div><dl><div><dt>Novios</dt><dd>Anthony Ugarte & Alexandra Vargas</dd></div><div><dt>Fecha</dt><dd>5 de diciembre de 2026</dd></div><div><dt>Hora</dt><dd>4:00 p. m.</dd></div><div><dt>Lugar</dt><dd>Finca Amada · San Sebastián, PR</dd></div><div><dt>Vestimenta</dt><dd>Solo rosa nude o blanco</dd></div></dl></section>
          <section className="dashCard" id="pendientes"><div className="cardHead"><div><p>Preparación Luxe</p><h2>Información pendiente</h2></div><span>{luxeMissingInfo.length} datos</span></div><ul className="taskList">{luxeMissingInfo.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><div><b>{item}</b><small>Solicitar a la novia</small></div></li>)}</ul></section>
        </div>
      </div>
    </main>
  );
}
