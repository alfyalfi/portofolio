"use client";

import { useEffect, useRef } from "react";

type Quad = ReturnType<typeof import("@/lib/gl").createQuad>;

// Deep luxury liquid silk that slowly drifts: domain-warped noise
// infused with rich royal navy and glowing electric cyan specular highlights.
const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uAspect;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p = mat2(1.6, 1.2, -1.2, 1.6) * p;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0) * 1.8;
    float t = uTime * 0.035;

    vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
    vec2 r = vec2(
      fbm(p + 3.8 * q + vec2(1.7, 9.2) + t * 0.7),
      fbm(p + 3.8 * q + vec2(8.3, 2.8) - t * 0.7)
    );
    float f = fbm(p + 4.2 * r);

    // Dynamic glossy ripples
    float gloss = pow(0.5 + 0.5 * sin(f * 10.0 + r.x * 3.5), 5.0);
    float depth = 0.3 * f * f + 0.85 * gloss * length(r);

    // Deep luxury dark palette infused with electric cyan and royal navy tones
    vec3 deepNavy = vec3(0.015, 0.035, 0.08);
    vec3 royalBlue = vec3(0.03, 0.16, 0.38);
    vec3 electricCyan = vec3(0.12, 0.65, 0.95);
    vec3 sparkWhite = vec3(0.90, 0.96, 1.0);

    vec3 col = mix(deepNavy, royalBlue, smoothstep(0.05, 0.55, depth));
    col = mix(col, electricCyan, smoothstep(0.48, 0.92, depth));
    col += sparkWhite * (pow(gloss, 3.5) * 0.65);

    // Subtle edge vignette
    float vig = 1.0 - 0.4 * length(vUv - 0.5);
    col *= vig;

    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Animated marble behind the hero; one still frame with reduced motion. */
export default function HeroBackground({ className }: { className?: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    if (!box || !canvas) return;

    const uniforms = { uTime: { value: 0 }, uAspect: { value: 1 } };
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let quad: Quad | undefined;
    let frame = 0;
    let last = 0;
    let visible = false;
    let disposed = false;

    // ~30fps is plenty for a slow drift, and it only runs while on screen
    const loop = (time: number) => {
      frame = 0;
      if (!visible || !quad) return;
      if (time - last > 30) {
        last = time;
        uniforms.uTime.value = time / 1000;
        quad.render();
      }
      frame = requestAnimationFrame(loop);
    };

    const resize = new ResizeObserver(() => {
      quad?.setSize(box.clientWidth, box.clientHeight);
      uniforms.uAspect.value = box.clientWidth / box.clientHeight;
      quad?.render();
    });
    const onScreen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !still;
      if (visible && !frame) frame = requestAnimationFrame(loop);
    });

    // Loaded and compiled once the page is idle, so the shader never
    // competes with the first load; it fades in over the dark hero
    const start = async () => {
      const { createQuad } = await import("@/lib/gl");
      if (disposed) return;
      try {
        // Half resolution: the swirls are soft, and the GPU does a quarter
        // of the work
        quad = createQuad(canvas, fragment, uniforms, { dpr: 0.5 });
      } catch {
        return; // No hardware WebGL: the hero keeps its plain dark background
      }
      resize.observe(box); // reports the size at once: first frame drawn
      onScreen.observe(box);
      canvas.style.opacity = "1";
    };
    // Safari has no requestIdleCallback
    const hasIdle = typeof requestIdleCallback === "function";
    const idle = hasIdle
      ? requestIdleCallback(() => void start(), { timeout: 3000 })
      : window.setTimeout(() => void start(), 1000);

    return () => {
      disposed = true;
      if (hasIdle) cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      cancelAnimationFrame(frame);
      resize.disconnect();
      onScreen.disconnect();
      quad?.dispose();
    };
  }, []);

  return (
    <div ref={boxRef} aria-hidden="true" className={className}>
      <canvas
        ref={canvasRef}
        className="block opacity-0 transition-opacity duration-1000"
      />
    </div>
  );
}
