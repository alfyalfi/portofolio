"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

type Quad = ReturnType<typeof import("@/lib/gl").createQuad>;

// The hover image spreads from the pointer inside a noisy circle. Both
// images stay still: only the edge of the circle is uneven.
const fragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uMap;
  uniform sampler2D uHoverMap;
  uniform float uProgress;
  uniform vec2 uMouse;
  uniform vec2 uMapRatio;
  uniform vec2 uHoverRatio;
  varying vec2 vUv;

  float random(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(random(i), random(i + vec2(1.0, 0.0)), f.x),
      mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  void main() {
    float radius = mix(-0.12, 1.15, uProgress);
    float edge = distance(vUv, uMouse) + noise(vUv * 7.0) * 0.1;
    float mask = 1.0 - smoothstep(radius - 0.12, radius + 0.08, edge);

    vec4 base = texture2D(uMap, (vUv - 0.5) * uMapRatio + 0.5);
    vec4 hover = texture2D(uHoverMap, (vUv - 0.5) * uHoverRatio + 0.5);
    gl_FragColor = mix(base, hover, mask);
  }
`;

/** object-fit: cover, as a UV scale for a texture of `image` in a w x h box. */
const coverRatio = (width: number, height: number, image: HTMLImageElement) => {
  const box = width / height;
  const picture = image.naturalWidth / image.naturalHeight;
  return box > picture ? [1, picture / box] : [box / picture, 1];
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

/**
 * A work's picture; on hover (mouse only) a WebGL canvas over it reveals
 * `hoverSrc`. Nothing loads or runs until the first hover, and frames are
 * drawn only while the reveal moves or the pointer moves during it.
 */
export default function WorkImage({
  src,
  hoverSrc,
  alt,
}: {
  src: string;
  hoverSrc: string;
  alt: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const image = imageRef.current;
      const canvas = canvasRef.current;
      if (
        !root ||
        !image ||
        !canvas ||
        !matchMedia("(hover: hover) and (pointer: fine)").matches ||
        matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const progress = { value: 0 };
      const mouse = { value: [0.5, 0.5] };
      let quad: Quad | undefined;
      let ready: Promise<void> | undefined;
      let disposed = false;

      // First hover: the base texture is the file the <img> already shows;
      // the hover image goes through the image optimizer like the <img>.
      const setup = async () => {
        const [{ createQuad, Texture }, base, hover] = await Promise.all([
          import("@/lib/gl"),
          loadImage(image.currentSrc || image.src),
          loadImage(hoverSrc),
        ]);
        if (disposed) return;

        const { width, height } = root.getBoundingClientRect();
        const uniforms: Record<string, { value: unknown }> = {
          uProgress: progress,
          uMouse: mouse,
          uMapRatio: { value: coverRatio(width, height, base) },
          uHoverRatio: { value: coverRatio(width, height, hover) },
        };
        quad = createQuad(canvas, fragment, uniforms);
        const { gl } = quad;
        const textureOf = (picture: HTMLImageElement) => ({
          value: new Texture(gl, {
            image: picture,
            generateMipmaps: false,
            minFilter: gl.LINEAR,
          }),
        });
        uniforms.uMap = textureOf(base);
        uniforms.uHoverMap = textureOf(hover);
        quad.setSize(width, height);
        gsap.set(canvas, { opacity: 1 });
      };

      const draw = () => quad?.render();
      const to = (value: number) =>
        gsap.to(progress, {
          value,
          duration: 0.8,
          ease: "power2.inOut",
          overwrite: true,
          onUpdate: draw,
        });

      const enter = () => {
        ready ??= setup().catch(() => {
          // No WebGL or no image: the plain <img> stays, without the effect
        });
        void ready.then(() => to(1));
      };
      const leave = () => void ready?.then(() => to(0));
      const move = (event: PointerEvent) => {
        const bounds = root.getBoundingClientRect();
        mouse.value = [
          (event.clientX - bounds.left) / bounds.width,
          1 - (event.clientY - bounds.top) / bounds.height,
        ];
        if (progress.value > 0 && progress.value < 1) draw();
      };

      root.addEventListener("pointerenter", enter);
      root.addEventListener("pointerleave", leave);
      root.addEventListener("pointermove", move);

      return () => {
        disposed = true;
        root.removeEventListener("pointerenter", enter);
        root.removeEventListener("pointerleave", leave);
        root.removeEventListener("pointermove", move);
        gsap.killTweensOf(progress);
        quad?.dispose();
        quad?.gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    },
    { dependencies: [src, hoverSrc], revertOnUpdate: true },
  );

  return (
    <div ref={rootRef} className="relative size-full overflow-hidden">
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 767px) 72vw, 40vmin"
        className="object-cover"
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full opacity-0"
      />
      {/* A light shade at the bottom, where the title overlaps the image */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-[#0a0a0a]/60 to-transparent"
      />
    </div>
  );
}
