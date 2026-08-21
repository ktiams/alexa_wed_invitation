"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";

const loveStoryImages = Array.from({ length: 14 }, (_, index) => ({
  src: `/images/love-story/love-${String(index + 1).padStart(2, "0")}.jpeg`,
  alt: `Anthony y Alexandra durante su sesión de fotos, momento ${index + 1}`,
}));

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

export function LoveStoryTunnel() {
  const [accelerated, setAccelerated] = useState(false);

  return (
    <section className={`loveStory${accelerated ? " isAccelerated" : ""}`} id="historia">
      <div
        className="loveTunnelStage"
        onPointerDown={() => setAccelerated(true)}
        onPointerUp={() => setAccelerated(false)}
        onPointerCancel={() => setAccelerated(false)}
        onPointerLeave={() => setAccelerated(false)}
        aria-hidden="true"
      >
        <div className="loveTunnelScene">
          {loveStoryImages.map((image, index) => {
            const lane = lanes[index % lanes.length];
            const style = {
              "--lane-x": lane.x,
              "--lane-y": lane.y,
              "--tilt": lane.tilt,
              "--delay": `${index * -1.72}s`,
            } as CSSProperties;

            return (
              <figure className="loveTunnelCard" style={style} key={image.src}>
                <Image src={image.src} alt="" fill sizes="(max-width: 700px) 46vw, 24vw" />
              </figure>
            );
          })}
        </div>
      </div>

      <div className="loveStoryVeil" aria-hidden="true" />
      <div className="loveStoryCopy">
        <p className="sectionTag">Nuestra historia</p>
        <p className="loveStoryKicker">Dos vidas · una promesa</p>
        <h2>El comienzo de<br />nuestro <em>para siempre</em></h2>
        <p className="loveStoryIntro">Hay personas que se vuelven hogar y promesas que merecen celebrarse. El 5 de diciembre comenzamos el capítulo más bonito de nuestra historia.</p>
        <div className="loveStorySignature"><span>Anthony</span><i>&</i><span>Alexandra</span></div>
      </div>

      <button
        className="tunnelControl"
        type="button"
        aria-pressed={accelerated}
        onClick={() => setAccelerated((current) => !current)}
      >
        <span aria-hidden="true">{accelerated ? "Ⅱ" : "→"}</span>
        {accelerated ? "Volver al ritmo suave" : "Acelerar los recuerdos"}
      </button>
      <p className="tunnelHint">Mantén presionada la galería para avanzar</p>
    </section>
  );
}
