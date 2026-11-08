"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Gl = typeof import("@/lib/gl");

// Pixel-grid reveal from the Codrops "gsap-threejs" demo
// (E:\Animmaster\Scroll Animation\11), shader copied with smaller squares: the
// image appears top to bottom behind a band of random #242424 squares.
const fragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform float uProgress;
  uniform vec3 uColor;

  uniform vec2 uContainerRes;

  float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  vec2 squaresGrid(vec2 vUv) {
    float imageAspectX = 1.;
    float imageAspectY = 1.;

    float containerAspectX = uResolution.x/uResolution.y;
    float containerAspectY = uResolution.y/uResolution.x;

    vec2 ratio = vec2(
      min(containerAspectX / imageAspectX, 1.0),
      min(containerAspectY / imageAspectY, 1.0)
    );

    return vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
  }

  void main() {
    float imageAspectX = uResolution.x/uResolution.y;
    float imageAspectY = uResolution.y/uResolution.x;

    float containerAspectX = uContainerRes.x/uContainerRes.y;
    float containerAspectY = uContainerRes.y/uContainerRes.x;

    vec2 ratio = vec2(
      min(containerAspectX / imageAspectX, 1.0),
      min(containerAspectY / imageAspectY, 1.0)
    );

    vec2 coverUvs = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    // generate grid. The demo divides by 20.; 10. halves the squares (Daniel,
    // 2026-10-07). On screen a square is ~1.9x this value for the 2:3 photo
    // at scale-125, so 10. draws ~19px squares.
    vec2 squareUvs = squaresGrid(coverUvs);
    float gridSize = floor(uContainerRes.x/10.);
    vec2 grid = vec2(floor(squareUvs.x*gridSize)/gridSize, floor(squareUvs.y*gridSize)/gridSize);
    vec4 gridTexture = vec4(uColor, 0.);

    // image texture
    vec4 texture = texture2D(uTexture, coverUvs);
    float height = 0.2;

    float progress = (1.+height)-(uProgress*(1.+height+height)); // 1+height to -height

    float dist = 1.-distance(grid.y, progress);
    float clampedDist = smoothstep(height, 0., distance(grid.y, progress));

    float randDist = step(1.-height*random(grid), dist);
    dist = step(1.-height, dist);

    float rand = random(grid);

    float alpha = dist*(clampedDist+rand-0.5*(1.-randDist));
    alpha = max(0., alpha);
    gridTexture.a = alpha;

    texture.rgba *= step(progress, grid.y);

    gl_FragColor = vec4(mix(texture, gridTexture, gridTexture.a));
  }
`;

// next/image whose picture appears with the pixel-grid reveal each time it
// scrolls into view (same toggleActions as the demo: it replays on re-entry).
// A WebGL canvas with the same classes (scale-…) covers the <img> box while
// the reveal plays, then hands back to the <img>: CSS scales the canvas
// bitmap, which blurs it, while the browser draws the <img> sharp. The parent
// must be positioned. Reduced motion, a hidden breakpoint copy, or a WebGL
// failure simply keep the plain image.
export default function RevealImage({ className, alt, ...props }: ImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const image = imageRef.current;
      const canvas = canvasRef.current;
      if (!image || !canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      let quad: ReturnType<Gl["createQuad"]> | undefined;
      let texture: WebGLTexture | undefined;
      let tween: gsap.core.Tween | undefined;
      let loading = false;
      let disposed = false;
      const progress = { value: 0 };
      const containerRes = { value: [1, 1] };
      const render = () => quad?.render();
      const showCanvas = (revealing: boolean) => {
        gsap.set(canvas, { opacity: revealing ? 1 : 0 });
        gsap.set(image, { opacity: revealing ? 0 : 1 });
      };

      const setup = ({ createQuad, Texture }: Gl) => {
        try {
          const uniforms = {
            uTexture: { value: undefined as unknown },
            uResolution: { value: [image.naturalWidth, image.naturalHeight] },
            uContainerRes: containerRes,
            uProgress: progress,
            uColor: { value: [0x24 / 255, 0x24 / 255, 0x24 / 255] },
          };
          // premultipliedAlpha matches three.js, which the demo renders with.
          quad = createQuad(canvas, fragment, uniforms, { premultipliedAlpha: true });
          const { gl } = quad;
          const map = new Texture(gl, { image, generateMipmaps: false, minFilter: gl.LINEAR });
          texture = map.texture;
          uniforms.uTexture.value = map;

          // Drawn only while the tween runs: nothing loops at rest.
          tween = gsap.to(progress, {
            value: 1,
            duration: 1.6,
            ease: "linear",
            onStart: () => showCanvas(true),
            onUpdate: render,
            onComplete: () => showCanvas(false),
            scrollTrigger: {
              trigger: image,
              start: "top bottom",
              end: "bottom top",
              toggleActions: "play reset restart reset",
            },
          });
        } catch {
          quad = undefined; // No hardware WebGL: the plain image stays.
        }
      };

      const fit = () => {
        const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = image;
        if (!offsetWidth || !image.complete || !image.naturalWidth) return;
        if (!quad) {
          // ogl loads only once a photo is ready to reveal
          if (!loading) {
            loading = true;
            void import("@/lib/gl").then((gl) => {
              if (disposed) return;
              setup(gl);
              if (quad) fit();
            });
          }
          return;
        }
        gsap.set(canvas, { left: offsetLeft, top: offsetTop, width: offsetWidth, height: offsetHeight });
        quad.setSize(offsetWidth, offsetHeight);
        containerRes.value = [offsetWidth, offsetHeight];
        render();
        showCanvas(tween?.progress() !== 1);
      };

      const observer = new ResizeObserver(fit);
      observer.observe(image);
      image.addEventListener("load", fit);

      return () => {
        disposed = true;
        observer.disconnect();
        image.removeEventListener("load", fit);
        tween?.scrollTrigger?.kill();
        tween?.kill();
        gsap.set(image, { clearProps: "opacity" });
        // Free the GL objects but keep the context: React reuses this canvas
        // when it remounts (StrictMode does so in dev), and a lost context
        // cannot be revived. The context goes with the canvas element.
        if (texture) quad?.gl.deleteTexture(texture);
        quad?.dispose();
      };
    },
    { dependencies: [props.src], revertOnUpdate: true },
  );

  return (
    <>
      <Image ref={imageRef} alt={alt} className={className} {...props} />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={cn(className, "pointer-events-none absolute opacity-0")}
      />
    </>
  );
}
