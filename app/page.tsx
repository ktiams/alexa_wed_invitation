import Image from "next/image";
import { Countdown } from "./components/Countdown";
import { LoveStoryTunnel } from "./components/LoveStoryTunnel";
import { calendarUrl, eventDetails, mapsUrl, timeline, weddingFaqs } from "./wedding-data";

export default function Home() {
  return (
    <main>
      <section className="hero" id="inicio">
        <Image className="heroImage" src="/images/pareja-hero.jpeg" alt="Anthony y Alexandra sonriendo juntos" fill priority sizes="100vw" />
        <div className="heroShade" />
        <nav className="nav" aria-label="Navegación principal">
          <a className="monogram" href="#inicio" aria-label="Volver al inicio">A <i>&</i> A</a>
          <div className="navLinks"><a href="#historia">Nosotros</a><a href="#detalles">Detalles</a><a href="#vestimenta">Vestimenta</a><a href="#rsvp">R.S.V.P.</a></div>
        </nav>
        <div className="heroContent">
          <p className="eyebrow">Con mucha alegría, te invitamos a celebrar</p>
          <h1>Anthony<br /><em>& Alexandra</em></h1>
          <div className="heroMeta"><span>05 · 12 · 2026</span><span className="line" /><span>4:00 p. m.</span></div>
        </div>
        <a className="scrollHint" href="#historia"><span>Descubre</span><b>↓</b></a>
      </section>

      <LoveStoryTunnel />

      <section className="details" id="detalles">
        <div className="detailsPhoto"><Image src="/images/venue-deco.jpeg" alt="Inspiración de decoración elegante en tonos nude" fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
        <div className="detailsContent">
          <p className="sectionTag">Reserva la fecha</p><h2>Un día<br /><em>inolvidable</em></h2>
          <p className="detailsLead">Te esperamos para celebrar nuestro amor en el hermoso campo de San Sebastián, Puerto Rico.</p>
          <div className="detailsList">{eventDetails.map((item) => <div className="detailRow" key={item.number}><span>{item.number}</span><p>{item.label}<strong>{item.value}</strong></p></div>)}</div>
          <div className="location"><span className="pin" aria-hidden="true">●</span><div><b>Finca Amada</b><small>San Sebastián, Puerto Rico</small></div></div>
          <a className="mapButton" href={mapsUrl} target="_blank" rel="noreferrer">Abrir pin en Google Maps <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className="timelineSection section" id="itinerario">
        <p className="sectionTag">Itinerario</p><h2>El orden de<br /><em>nuestro gran día</em></h2>
        <p className="sectionIntro">Ya puedes reservar las 4:00 p. m. El horario completo aparecerá aquí tan pronto confirmemos cada momento.</p>
        <div className="timeline">{timeline.map((item, index) => <article key={item.label}><span>{String(index + 1).padStart(2, "0")}</span><time>{item.time}</time><h3>{item.label}</h3><small className={item.status === "Confirmado" ? "confirmed" : "pending"}>{item.status}</small></article>)}</div>
        <a className="calendarButton" href={calendarUrl} target="_blank" rel="noreferrer">Añadir al calendario <span aria-hidden="true">＋</span></a>
      </section>

      <section className="countdownSection" aria-label="Cuenta regresiva">
        <p className="sectionTag">La cuenta regresiva comenzó</p><Countdown target="2026-12-05T16:00:00-04:00" />
      </section>

      <section className="dress section" id="vestimenta">
        <p className="sectionTag">Código de vestimenta</p><h2>Una celebración<br /><em>en rosa & blanco</em></h2>
        <p className="dressLead">La vestimenta es exclusivamente en estos dos colores. Por favor, no utilices ningún otro color.</p>
        <div className="swatches" aria-label="Colores permitidos">
          <div><span className="swatch nude" /><b>Rosa nude</b><small>Permitido</small></div>
          <div><span className="swatch white" /><b>Blanco</b><small>Permitido</small></div>
        </div>
        <div className="dressNotice"><strong>Solamente rosa nude o blanco</strong><span>Ningún otro color</span></div>
      </section>

      <section className="guestPolicy section" id="rsvp">
        <p className="sectionTag">Información importante</p><h2>Una noche<br /><em>solo para adultos</em></h2>
        <div className="policyGrid">
          <article><span>01</span><h3>Tu invitación</h3><p>La invitación es válida únicamente para la persona invitada.</p></article>
          <article><span>02</span><h3>Un acompañante</h3><p>Cada invitado puede asistir con un solo acompañante.</p></article>
          <article><span>03</span><h3>No niños</h3><p>Con mucho cariño, hemos decidido celebrar este evento exclusivamente para adultos.</p></article>
        </div>
        <p className="policyNote">Agradecemos profundamente tu comprensión y que respetes estas indicaciones.</p>
      </section>

      <section className="practical section" id="informacion">
        <p className="sectionTag">Antes de llegar</p><h2>Detalles para<br /><em>disfrutar sin prisa</em></h2>
        <div className="practicalGrid">
          <article><span>01</span><h3>Estacionamiento</h3><p>Indicaciones de acceso y estacionamiento pendientes de confirmar con el lugar.</p><small>Información pendiente</small></article>
          <article><span>02</span><h3>Comida & alergias</h3><p>El formulario RSVP permitirá informar alergias y restricciones alimentarias.</p><small>Menú pendiente</small></article>
          <article><span>03</span><h3>Accesibilidad</h3><p>Confirmaremos rutas accesibles, terreno y cualquier asistencia disponible.</p><small>Información pendiente</small></article>
        </div>
      </section>

      <section className="registry section" id="regalos">
        <div className="registryInner"><p className="sectionTag">Regalos</p><h2>Tu presencia es<br /><em>nuestro mejor regalo</em></h2><p>Anthony y Alexandra definirán si desean una lista de regalos, aportaciones para su luna de miel o simplemente la compañía de sus invitados.</p><span>Preferencia pendiente de los novios</span></div>
      </section>

      <section className="photoAlbum section" id="album">
        <div className="albumCopy"><p className="sectionTag">Experiencia Luxe</p><h2>Un álbum hecho<br /><em>por todos</em></h2><p>Durante la celebración, cada invitado podrá compartir sus mejores fotografías en un álbum privado. Anthony y Alexandra aprobarán las imágenes antes de que aparezcan.</p><button type="button" disabled>El álbum abrirá el día de la boda</button></div>
        <figure><Image src="/images/momento.jpeg" alt="Anthony y Alexandra juntos" fill sizes="(max-width: 800px) 100vw, 46vw" /></figure>
      </section>

      <section className="faq section" id="preguntas">
        <p className="sectionTag">Preguntas frecuentes</p><h2>Todo lo que<br /><em>necesitas saber</em></h2>
        <div className="faqList">{weddingFaqs.map((item, index) => <details key={item.question} open={index === 0}><summary><span>{String(index + 1).padStart(2, "0")}</span>{item.question}<b aria-hidden="true">＋</b></summary><p>{item.answer}</p></details>)}</div>
      </section>

      <section className="rsvp section">
        <p className="sectionTag">Celebra con nosotros</p><h2>Queremos que seas<br />parte de <em>este capítulo</em></h2>
        <p>La confirmación será personalizada para cada invitado y permitirá registrar un acompañante, restricciones alimentarias y un mensaje para los novios.</p>
        <form className="rsvpPreview" aria-label="Vista previa del formulario de confirmación">
          <label>Nombre completo<input type="text" placeholder="Según aparece en tu invitación" disabled /></label>
          <label>Email o teléfono<input type="text" placeholder="Para localizar tu invitación" disabled /></label>
          <label>Restricciones alimentarias<input type="text" placeholder="Alergias, vegetariano, sin gluten…" disabled /></label>
          <label>Mensaje para los novios<textarea placeholder="Escribe unas palabras para Anthony y Alexandra" disabled /></label>
          <button type="button" disabled>Confirmar asistencia · Próximamente</button>
        </form>
        <small className="rsvpStatus">Pendiente: lista de invitados y fecha límite de confirmación</small><div className="signature">Anthony <i>&</i> Alexandra</div>
      </section>
    </main>
  );
}
