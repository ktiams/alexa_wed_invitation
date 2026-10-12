"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";

const PHOTO_COUNT = 16;

const photos = Array.from({ length: PHOTO_COUNT }, (_, index) => ({
  src: `/images/love-story/love-${String(index + 1).padStart(2, "0")}.jpeg`,
}));

// Cada foto viaja por un "carril" distinto del túnel para que no se solapen.
const lanes = [
  { x: "-36vw", y: "-25vh", tilt: "-8deg" },
  { x: "35vw", y: "-21vh", tilt: "9deg" },
  { x: "-39vw", y: "18vh", tilt: "7deg" },
  { x: "38vw", y: "24vh", tilt: "-10deg" },
  { x: "-22vw", y: "-36vh", tilt: "5deg" },
  { x: "24vw", y: "35vh", tilt: "-6deg" },
  { x: "-43vw", y: "2vh", tilt: "-4deg" },
  { x: "43vw", y: "-1vh", tilt: "5deg" },
];

export function LoveStorySection() {
  const [accelerated, setAccelerated] = useState(false);

  return (
    <section className={`love-story${accelerated ? " is-accelerated" : ""}`} id="historia">
      <div
        className="love-story__stage"
        onPointerDown={() => setAccelerated(true)}
        onPointerUp={() => setAccelerated(false)}
        onPointerCancel={() => setAccelerated(false)}
        onPointerLeave={() => setAccelerated(false)}
        aria-hidden="true"
      >
        <div className="love-story__scene">
          {photos.map((photo, index) => {
            const lane = lanes[index % lanes.length];
            const style = {
              "--lane-x": lane.x,
              "--lane-y": lane.y,
              "--tilt": lane.tilt,
              "--delay": `${index * -1.5}s`,
            } as CSSProperties;

            return (
              <figure className="love-story__card" style={style} key={photo.src}>
                <Image src={photo.src} alt="" fill sizes="(max-width: 700px) 46vw, 24vw" />
              </figure>
            );
          })}
        </div>
      </div>

      <div className="love-story__veil" aria-hidden="true" />

      <div className="love-story__copy">
        <p className="mb-5 text-[0.72rem] uppercase tracking-[0.38em] text-silver-light">Nuestra historia</p>
        <p className="mb-6 text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-gold">Dos vidas · una promesa</p>
        <h2>
          El comienzo de
          <br />
          nuestro <em>para siempre</em>
        </h2>
        <p className="love-story__intro">
          Hay personas que se vuelven hogar y promesas que merecen celebrarse. El 5 de diciembre comenzamos el
          capítulo más bonito de nuestra historia.
        </p>
        <div className="love-story__signature">
          <span>Anthony</span>
          <i>&amp;</i>
          <span>Alexandra</span>
        </div>
      </div>

      <button
        className="love-story__control"
        type="button"
        aria-pressed={accelerated}
        onClick={() => setAccelerated((current) => !current)}
      >
        <span aria-hidden="true">{accelerated ? "Ⅱ" : "→"}</span>
        {accelerated ? "Volver al ritmo suave" : "Acelerar los recuerdos"}
      </button>
      <p className="love-story__hint">Mantén presionada la galería para avanzar</p>
    </section>
  );
}
