import { Mesh, Program, Renderer, Triangle } from "ogl";

// Callers import this module dynamically, so ogl stays out of the first load
export { Texture } from "ogl";

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

/**
 * One triangle covering `canvas`, drawn by `fragment` (which gets `vUv`):
 * the base of every WebGL effect on the page. Throws when there is no
 * hardware WebGL, so callers keep their plain fallback: software rendering
 * (no GPU, or a blocklisted one) would draw every frame on the CPU.
 */
export function createQuad(
  canvas: HTMLCanvasElement,
  fragment: string,
  uniforms: Record<string, { value: unknown }>,
  {
    dpr = Math.min(window.devicePixelRatio, 2),
    premultipliedAlpha = false,
  } = {},
) {
  // Created here with the caveat flag; ogl then reuses this context
  const attributes = {
    alpha: true,
    antialias: false,
    depth: false,
    premultipliedAlpha,
    failIfMajorPerformanceCaveat: true,
  };
  const context = (canvas.getContext("webgl2", attributes) ??
    canvas.getContext("webgl", attributes)) as WebGLRenderingContext | null;
  // The flag alone lets Chrome's software renderer through (SwiftShader,
  // e.g. headless Chrome and PageSpeed), so check the renderer by name too
  const info = context?.getExtension("WEBGL_debug_renderer_info");
  const name = context && String(context.getParameter(info?.UNMASKED_RENDERER_WEBGL ?? context.RENDERER));
  if (!context || /swiftshader|llvmpipe|software|basic render/i.test(name ?? "")) {
    throw new Error("No hardware-accelerated WebGL");
  }

  const renderer = new Renderer({ canvas, alpha: true, premultipliedAlpha, dpr });
  const { gl } = renderer;
  const geometry = new Triangle(gl);
  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms,
    depthTest: false,
    depthWrite: false,
  });
  const mesh = new Mesh(gl, { geometry, program });

  return {
    gl,
    setSize: (width: number, height: number) => renderer.setSize(width, height),
    render: () => renderer.render({ scene: mesh }),
    dispose: () => {
      geometry.remove();
      program.remove();
    },
  };
}
