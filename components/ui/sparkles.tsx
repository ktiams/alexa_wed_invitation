"use client";

import { useEffect, useRef } from "react";

// Destellos de fondo con profundidad. Misma idea que el SparklesCore de tsparticles,
// pero en un canvas propio para no sumar framer-motion ni tsparticles al celular.
//
// Cada destello tiene una profundidad z (0 = lejos, 1 = cerca):
// - lejos: pequeño, nítido, lento y tenue;
// - medio: más grande, a veces con forma de estrella de cuatro puntas;
// - cerca: grande, desenfocado (bokeh) y rápido.
// Todos suben flotando con un vaivén suave, y al hacer scroll los cercanos se desplazan
// más que los lejanos (parallax). Se pausa fuera de pantalla, no responde a clics y con
// prefers-reduced-motion se dibuja quieto.

type SparklesProps = {
  id?: string;
  className?: string;
  /** Colores de los destellos; se reparten entre todos. */
  particleColors?: string[];
  /** Radio en px de los destellos más lejanos. */
  minSize?: number;
  /** Radio en px de los destellos más cercanos (bokeh). */
  maxSize?: number;
  /** Destellos por cada 400 × 400 px. En pantallas de menos de 640 px se usa el 60 %. */
  particleDensity?: number;
  /** Multiplicador de velocidad de subida y titileo (1 = normal). */
  speed?: number;
  /** Opacidad máxima. */
  maxOpacity?: number;
  /** Parte de los destellos de profundidad media que se dibuja como estrella (0 a 1). */
  starRatio?: number;
  /** Intensidad del parallax al hacer scroll (0 = sin parallax). */
  parallax?: number;
};

type Particle = {
  x: number;
  y: number;
  z: number;
  r: number;
  a: number;
  da: number;
  vy: number;
  sway: number;
  phase: number;
  sprite: HTMLCanvasElement;
};

const SPRITE = 64;

/** Punto con núcleo brillante y halo; `soft` lo desenfoca para los cercanos. */
function dotSprite(color: string, soft: boolean) {
  const c = document.createElement("canvas");
  c.width = c.height = SPRITE;
  const g = c.getContext("2d")!;
  const h = SPRITE / 2;
  const grad = g.createRadialGradient(h, h, 0, h, h, h);
  if (soft) {
    grad.addColorStop(0, color);
    grad.addColorStop(0.45, color + "aa");
    grad.addColorStop(1, color + "00");
  } else {
    grad.addColorStop(0, "#fffdf6");
    grad.addColorStop(0.18, color);
    grad.addColorStop(0.42, color + "55");
    grad.addColorStop(1, color + "00");
  }
  g.fillStyle = grad;
  g.fillRect(0, 0, SPRITE, SPRITE);
  return c;
}

/** Estrella de cuatro puntas con lados curvos (✦) y un halo suave. */
function starSprite(color: string) {
  const c = document.createElement("canvas");
  c.width = c.height = SPRITE;
  const g = c.getContext("2d")!;
  const h = SPRITE / 2;
  const halo = g.createRadialGradient(h, h, 0, h, h, h * 0.55);
  halo.addColorStop(0, color + "66");
  halo.addColorStop(1, color + "00");
  g.fillStyle = halo;
  g.fillRect(0, 0, SPRITE, SPRITE);
  const s = h * 0.95;
  g.fillStyle = color;
  g.beginPath();
  g.moveTo(h, h - s);
  g.quadraticCurveTo(h, h, h + s, h);
  g.quadraticCurveTo(h, h, h, h + s);
  g.quadraticCurveTo(h, h, h - s, h);
  g.quadraticCurveTo(h, h, h, h - s);
  g.fill();
  g.fillStyle = "#fffdf6";
  g.beginPath();
  g.arc(h, h, h * 0.08, 0, Math.PI * 2);
  g.fill();
  return c;
}

export function SparklesCore({
  id,
  className = "",
  particleColors = ["#c49a4e"],
  minSize = 0.8,
  maxSize = 7,
  particleDensity = 70,
  speed = 1,
  maxOpacity = 1,
  starRatio = 0.25,
  parallax = 0.35,
}: SparklesProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const colorsKey = particleColors.join(",");

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const colors = colorsKey.split(",");
    const sprites = colors.map((color) => ({
      sharp: dotSprite(color, false),
      soft: dotSprite(color, true),
      star: starSprite(color),
    }));
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let onScreen = false;
    let frame = 0;
    let lastTime = 0;
    let lastScroll = window.scrollY;

    const spawn = (i: number, anywhere: boolean): Particle => {
      // Más destellos lejanos que cercanos, como en una escena real.
      const z = Math.pow(Math.random(), 1.6);
      const set = sprites[i % sprites.length];
      const near = z > 0.78;
      const midStar = !near && z > 0.3 && Math.random() < starRatio;
      const r = minSize + z * z * (maxSize - minSize) * (midStar ? 0.55 : 1);
      return {
        x: Math.random() * width,
        y: anywhere ? Math.random() * height : height + r * 2,
        z,
        r,
        a: Math.random(),
        da: (0.012 + Math.random() * 0.028) * speed * (Math.random() < 0.5 ? -1 : 1),
        // px por segundo hacia arriba: lejos ~8, cerca ~60
        vy: (8 + z * 52) * speed,
        sway: 4 + z * 14,
        phase: Math.random() * Math.PI * 2,
        sprite: near ? set.soft : midStar ? set.star : set.sharp,
      };
    };

    const draw = (dt: number, time: number) => {
      const scrollNow = window.scrollY;
      const dy = scrollNow - lastScroll;
      lastScroll = scrollNow;

      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        if (dt > 0) {
          p.y -= p.vy * dt;
          // Parallax: los lejanos se quedan atrás y los cercanos se adelantan al hacer scroll.
          p.y += dy * (0.5 - p.z) * parallax;
          p.a += p.da * dt * 60;
          if (p.a > 1 || p.a < 0.15) {
            p.da *= -1;
            p.a = Math.min(1, Math.max(0.15, p.a));
          }
          if (p.y < -p.r * 3 || p.y > height + p.r * 3) {
            p = particles[i] = spawn(i, false);
            if (dy > 0) p.y = height + p.r * 2;
          }
        }
        const x = p.x + Math.sin(time / 1000 + p.phase) * p.sway;
        // Los cercanos (bokeh) son más tenues para no distraer.
        const depthAlpha = p.z > 0.78 ? 0.38 : 0.45 + p.z * 0.55;
        ctx.globalAlpha = Math.min(1, p.a * depthAlpha * maxOpacity);
        // El sprite incluye el halo, así que se dibuja más grande que el radio del destello.
        const size = p.r * 4.4;
        ctx.drawImage(p.sprite, x - size / 2, p.y - size / 2, size, size);
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = width < 640 ? particleDensity * 0.6 : particleDensity;
      const count = Math.round((density * width * height) / (400 * 400));
      particles = Array.from({ length: count }, (_, i) => spawn(i, true));
      draw(0, performance.now());
    };

    const loop = (time: number) => {
      frame = requestAnimationFrame(loop);
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
      lastTime = time;
      if (!onScreen) {
        lastScroll = window.scrollY;
        return;
      }
      draw(dt, time);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    visibility.observe(canvas);

    resize();
    canvas.style.opacity = "1";
    if (!still) frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
    };
  }, [colorsKey, minSize, maxSize, particleDensity, speed, maxOpacity, starRatio, parallax]);

  return (
    <canvas
      id={id}
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none opacity-0 transition-opacity duration-1000 ${className}`}
    />
  );
}
