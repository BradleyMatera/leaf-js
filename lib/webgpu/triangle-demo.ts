import { createHelloTriangleDemo } from "./samples/hello-triangle/main";
import type { DemoInstance } from "./types";

export type ShapeId = "hello-triangle";

type ShapeMeta = {
  id: ShapeId;
  label: string;
  description: string;
  source: {
    title: string;
    url: string;
  };
};

export const availableShapes: ShapeMeta[] = [
  {
    id: "hello-triangle",
    label: "Hello Triangle",
    description:
      "Baseline WebGPU pipeline inspired by the official Hello Triangle sample. Demonstrates vertex buffers, shaders, and render loop fundamentals.",
    source: {
      title: "WebGPU Samples — Hello Triangle",
      url: "https://webgpu.github.io/webgpu-samples/?sample=helloTriangle"
    }
  }
];

type DemoResult =
  | {
      status: "ready";
      cleanup: () => void;
      setShape: (shapeId: ShapeId) => Promise<void>;
      getShape: () => ShapeMeta;
    }
  | { status: "unsupported"; message: string }
  | { status: "error"; message: string; cause?: unknown };

export async function initTriangleDemo(
  canvas: HTMLCanvasElement,
  titleElement: HTMLElement | null
): Promise<DemoResult> {
  try {
    if (typeof navigator === "undefined" || !("gpu" in navigator)) {
      const message = "WebGPU is not supported in this browser.";
      updateTitle(titleElement, message);
      return { status: "unsupported", message };
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      const message = "No adapter is available for WebGPU.";
      updateTitle(titleElement, message);
      return { status: "unsupported", message };
    }

    const device = await adapter.requestDevice();
    const context = canvas.getContext("webgpu") as GPUCanvasContext | null;

    if (!context) {
      const message = "Unable to initialize WebGPU context.";
      updateTitle(titleElement, message);
      return { status: "error", message };
    }

    const format = navigator.gpu.getPreferredCanvasFormat();
    const configureContext = () =>
      configureCanvasContext({
        canvas,
        context,
        device,
        format
      });

    let { width: canvasWidth, height: canvasHeight } = configureContext();

    let depthTexture: GPUTexture | null = null;
    let depthView: GPUTextureView | null = null;
    let animationFrame: number | undefined;
    let currentDemo: DemoInstance | null = null;
    let currentShape = availableShapes[0]!;
    let requestedShape: ShapeId = currentShape.id;
    let loadingShape: Promise<void> | null = null;

    const ensureDepthResources = () => {
      depthTexture?.destroy();
      depthTexture = device.createTexture({
        size: { width: canvasWidth, height: canvasHeight },
        format: "depth24plus",
        usage: GPUTextureUsage.RENDER_ATTACHMENT
      });
      depthView = depthTexture.createView();
    };

    const observer = new ResizeObserver(() => {
      const size = configureContext();
      canvasWidth = size.width;
      canvasHeight = size.height;
      currentDemo?.resize(size.width, size.height);
      if (currentDemo?.requiresDepth) {
        ensureDepthResources();
      }
    });

    observer.observe(canvas);

    const setShape = (shapeId: ShapeId) => {
      requestedShape = shapeId;

      const load = (async () => {
        const nextShape =
          availableShapes.find((shape) => shape.id === shapeId) ?? availableShapes[0]!;

        const newDemo = await createDemoInstance(nextShape.id, device, format);

        if (requestedShape !== shapeId) {
          newDemo.dispose();
          return;
        }

        currentDemo?.dispose();
        currentDemo = newDemo;
        currentShape = nextShape;

        currentDemo.resize(canvasWidth, canvasHeight);
        if (currentDemo.requiresDepth) {
          ensureDepthResources();
        } else {
          depthTexture?.destroy();
          depthTexture = null;
          depthView = null;
        }

        updateTitle(titleElement, `WebGPU Demo — ${nextShape.label}`);
      })().catch((error) => {
        console.error("Failed to load WebGPU shape", error);
        if (requestedShape === shapeId) {
          updateTitle(
            titleElement,
            error instanceof Error ? error.message : "Failed to load WebGPU shape."
          );
        }
      });

      loadingShape = load.finally(() => {
        if (loadingShape === load) {
          loadingShape = null;
        }
      });

      return load;
    };

    const frame = (timestamp: number) => {
      const demo = currentDemo;
      if (!demo) {
        animationFrame = requestAnimationFrame(frame);
        return;
      }

      const encoder = device.createCommandEncoder();
      const textureView = context.getCurrentTexture().createView();

      demo.update(timestamp);

      const passDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [
          {
            view: textureView,
            clearValue: demo.clearColor,
            loadOp: "clear",
            storeOp: "store"
          }
        ]
      };

      if (demo.requiresDepth && depthView) {
        passDescriptor.depthStencilAttachment = {
          view: depthView,
          depthClearValue: 1,
          depthLoadOp: "clear",
          depthStoreOp: "store"
        };
      }

      const pass = encoder.beginRenderPass(passDescriptor);
      demo.render(pass);
      pass.end();

      device.queue.submit([encoder.finish()]);
      animationFrame = requestAnimationFrame(frame);
    };

    setShape(currentShape.id);
    animationFrame = requestAnimationFrame(frame);

    const cleanup = () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      observer.disconnect();
      depthTexture?.destroy();
      currentDemo?.dispose();
    };

    return {
      status: "ready",
      cleanup,
      setShape,
      getShape: () => currentShape
    };
  } catch (error) {
    console.error("WebGPU demo failed to initialise", error);
    const message =
      error instanceof Error ? error.message : "Unexpected WebGPU initialisation error.";
    updateTitle(titleElement, message);
    return { status: "error", message, cause: error };
  }
}

function updateTitle(titleElement: HTMLElement | null, message: string) {
  if (titleElement) {
    titleElement.textContent = message;
  }
}

function configureCanvasContext({
  canvas,
  context,
  device,
  format
}: {
  canvas: HTMLCanvasElement;
  context: GPUCanvasContext;
  device: GPUDevice;
  format: GPUTextureFormat;
}) {
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width * dpr));
  const height = Math.max(1, Math.floor(rect.height * dpr));

  canvas.width = width;
  canvas.height = height;
  canvas.style.width = "100%";
  canvas.style.height = "100%";

  context.configure({
    device,
    format,
    alphaMode: "opaque",
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
  });

  return { width, height };
}

async function createDemoInstance(
  id: ShapeId,
  device: GPUDevice,
  format: GPUTextureFormat
): Promise<DemoInstance> {
  switch (id) {
    case "hello-triangle":
    default:
      return createHelloTriangleDemo(device, format);
  }
}
