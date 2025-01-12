# Leaf-js

## Required Information

- [webgl reference](https://gpuweb.github.io/gpuweb/)
- [webgpu mdn docs](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)
- [wgsl shading lang](https://www.w3.org/TR/WGSL/)

> NOTE: wgsl is basically glsl with some small viritual math differences.

## Adding New Shapes to the WebGPU Project

### Step 1: Create the Vertex Shader

1. Navigate to the shaders directory
2. Create a new file named `<shape>.vert.wgsl` (replace `<shape>` with your shape's name, e.g., `pentagon.vert.wgsl`)
3. Write the vertex shader logic. The vertex shader should define the vertices of the shape. For example:

```wgsl
@vertex
fn main(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4<f32> {
  var pos = array<vec2<f32>, NUM_VERTICES>(
    // Define your vertices here
    vec2(0.0, 0.0), // Example vertex
    ...
  );
  return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
}
```

- Replace `NUM_VERTICES` with the total number of vertices for the shape
- Make sure the vertices form the desired shape using the correct topology

### Step 2: Create the Fragment Shader

1. If the shape requires a unique fragment shader, create a new file named `<shape>.frag.wgsl` in the shaders directory
2. If the existing `red.frag.wgsl` is sufficient, reuse it

### Step 3: Add the Shape Initialization Logic

1. Create a new file in the root directory (e.g., `test-<shape>.ts`)
2. Add the following logic to initialize and render the shape:

```typescript
import shapeVertWGSL from './shaders/<shape>.vert.wgsl';
import fragWGSL from './shaders/red.frag.wgsl'; // Or your custom fragment shader

export default function init(
  context: GPUCanvasContext,
  device: GPUDevice
): void {
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
  context.configure({
    device,
    format: presentationFormat,
    alphaMode: 'opaque',
  });

  const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: device.createShaderModule({
        code: shapeVertWGSL,
      }),
      entryPoint: 'main',
    },
    fragment: {
      module: device.createShaderModule({
        code: fragWGSL,
      }),
      entryPoint: 'main',
      targets: [
        {
          format: presentationFormat,
        },
      ],
    },
    primitive: {
      topology: 'triangle-list', // Update this if using a different topology
    },
  });

  function frame() {
    const commandEncoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: textureView,
          clearValue: { r: 0.1, g: 0.3, b: 0.3, a: 1.0 },
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.draw(NUM_VERTICES, 1, 0, 0); // Replace NUM_VERTICES with your vertex count
    passEncoder.end();

    device.queue.submit([commandEncoder.finish()]);
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}
```

### Step 4: Update the Main File

1. Open `main.ts`
2. Import the new shape initialization function:

```typescript
import init<Shape> from './test-<shape>';
```

Replace `<Shape>` with the shape name (e.g., `initPentagon`).

3. Add the new shape to the commented-out testing section:

```typescript
// Uncomment one of the following lines to test a specific shape:
initTriangle(context, device); // Test Triangle
// init<Shape>(context, device); // Test Your Shape
```

### Step 5: Test the Shape

1. Uncomment the initialization line for your new shape in `main.ts`
2. Run the project
3. Verify the shape renders correctly on the canvas

### Example: Adding a Pentagon

1. Create the Vertex Shader: Add `pentagon.vert.wgsl` to `shaders/` and define the pentagon's vertices
2. Reuse the Fragment Shader: Use `red.frag.wgsl` for coloring
3. Create the Initialization Logic: Add `test-pentagon.ts` and set up the render pipeline
4. Update `main.ts`: Import `initPentagon` and test it by uncommenting its call

This process ensures consistency across all shapes and simplifies future additions.

## Project Overview

This project is a WebGPU-based graphics renderer tailored to render shapes using GPU acceleration. It's a modern take on leveraging the GPU directly in the browser to draw 2D shapes (or potentially 3D in the future) using WebGPU, a cutting-edge API that allows for high-performance graphics and computation.

### What Makes It Different?

#### 1. Leveraging WebGPU
- Modern API: WebGPU is newer than WebGL, designed to offer a more efficient, flexible, and lower-overhead interface for rendering graphics and performing computations
- Future-Proof: While WebGL is widely supported, it's based on older paradigms. WebGPU represents the future of browser-based graphics, aligning with APIs like Vulkan, Metal, and Direct3D 12

#### 2. Fine-Grained Control Over the GPU
- Unlike libraries like Three.js, your project works closer to the GPU itself, giving you fine control over rendering pipelines, shaders, and topology
- This allows for a deeper understanding of GPU programming compared to higher-level abstractions

#### 3. Learning and Experimentation Platform
- This project isn't just about creating shapes—it's about learning how to use WebGPU effectively, from setting up a pipeline to writing WGSL shaders
- It serves as a playground for experimenting with GPU concepts like vertex processing, fragment shaders, and rendering pipelines

#### 4. Extensibility
- The project is structured to easily add new shapes and logic. This flexibility lets you:
  - Define and render any custom shape using a vertex shader
  - Reuse or customize fragment shaders for different visual effects

#### 5. Minimalism
- Unlike frameworks that abstract away most of the complexity (e.g., Three.js, Babylon.js), this project gives you the bare essentials
- You directly control how shapes are drawn, making it a lightweight and educational project for mastering GPU programming

#### 6. Designed for Efficiency
- WebGPU is designed to handle complex rendering and computation tasks more efficiently than WebGL
- It allows you to predefine pipelines for better performance, which is particularly important for applications like games, simulations, or data visualization

#### 7. Unique Educational Value
- By working on this project, you're learning:
  - How to create render pipelines and configure them
  - How vertex shaders map vertices to screen coordinates
  - How fragment shaders colorize pixels
  - This hands-on approach is valuable for both graphics programming enthusiasts and developers aiming to explore advanced browser technologies

### How Is It Different From WebGL or Canvas?

| Feature | WebGPU | WebGL | Canvas API |
|---------|---------|--------|------------|
| Performance | High, GPU-accelerated | Decent, GPU-accelerated | Low, CPU-bound |
| Modern Features | Vulkan/Metal-like, compute shaders | Older OpenGL ES 2.0 standard | Limited to 2D drawing |
| Flexibility | Full control over GPU operations | Limited by WebGL abstraction | Limited to rasterized 2D |
| Learning Curve | Steeper (closer to low-level GPU) | Easier than WebGPU | Easiest (high-level API) |

### Why Build This?

- Future-Proof Skills: WebGPU is gaining adoption, and learning it now positions you ahead of the curve
- Understand GPU Programming: This project dives into how the GPU processes data, which is foundational for graphics and compute-heavy applications
- Customization: You're not locked into a framework. You can define your rendering logic entirely, enabling unique visual effects
- Foundation for Larger Projects: This project can evolve into a game engine, simulation tool, or advanced data visualization platform

In short, you're building something cutting-edge, educational, and foundational for modern web graphics. It combines the challenge of low-level programming with the creative satisfaction of rendering visuals on the GPU.

## Adding New Shapes to the Project

This guide explains the process of adding new shapes to the project, including the necessary files, their locations, and required updates.

### Prerequisites
- Node.js and npm installed
- Project dependencies installed
- Basic understanding of WebGPU and WGSL

---

### Step 1: Create the Vertex Shader

1. Navigate to the `src/shaders/` folder
2. Create a new file named `<shape>.vert.wgsl` (replace `<shape>` with your shape's name, e.g., `octagon.vert.wgsl`)
3. Define the vertices of your shape in the shader:

```wgsl
@vertex
fn main(
    @builtin(vertex_index) VertexIndex: u32
) -> @builtin(position) vec4<f32> {
    // Define vertices for your shape
    var pos = array<vec2<f32>, NUM_VERTICES>(
        // Example vertices - replace with your shape's vertices
        vec2( 0.0,  0.5),  // Top
        vec2(-0.5, -0.5),  // Bottom left
        vec2( 0.5, -0.5)   // Bottom right
    );
    
    return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
}
```

### Step 2: Create the Initialization File

1. Navigate to the `src/` folder
2. Create a new file named `test-<shape>.ts` (e.g., `test-octagon.ts`)
3. Add the following initialization code:

```typescript
import shapeVertWGSL from './shaders/<shape>.vert.wgsl';
import fragWGSL from './shaders/red.frag.wgsl';

export default function init(
    context: GPUCanvasContext,
    device: GPUDevice
): void {
    // Configure the presentation format
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
        device,
        format: presentationFormat,
        alphaMode: 'opaque',
    });

    // Create the render pipeline
    const pipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: {
            module: device.createShaderModule({
                code: shapeVertWGSL,
            }),
            entryPoint: 'main',
        },
        fragment: {
            module: device.createShaderModule({
                code: fragWGSL,
            }),
            entryPoint: 'main',
            targets: [
                {
                    format: presentationFormat,
                },
            ],
        },
        primitive: {
            topology: 'triangle-list', // Update if using a different topology
        },
    });

    // Define the render frame function
    function frame() {
        const commandEncoder = device.createCommandEncoder();
        const textureView = context.getCurrentTexture().createView();

        const renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view: textureView,
                    clearValue: { r: 0.1, g: 0.3, b: 0.3, a: 1.0 },
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(pipeline);
        passEncoder.draw(NUM_VERTICES, 1, 0, 0); // Replace NUM_VERTICES with actual count
        passEncoder.end();

        device.queue.submit([commandEncoder.finish()]);
        requestAnimationFrame(frame);
    }

    // Start the render loop
    requestAnimationFrame(frame);
}
```

### Step 3: Update the Shape Selector

1. Open `index.html`
2. Locate the shape selector element
3. Add your new shape option:

```html
<select id="shape-selector" class="shape-selector">
    <option value="triangle">Triangle</option>
    <option value="square">Square</option>
    <!-- Add your new shape here -->
    <option value="octagon">Octagon</option>
</select>
```

### Step 4: Register the Shape

1. Open `main.ts`
2. Import your new shape initialization function:

```typescript
import initOctagon from './test-octagon';
```

3. Add your shape to the shapes object:

```typescript
const shapes = {
    triangle: initTriangle,
    square: initSquare,
    pentagon: initPentagon,
    diamond: initDiamond,
    hexagon: initHexagon,
    octagon: initOctagon, // Add your shape here
};
```

### Step 5: Testing

1. Start the development server:
```bash
npm run dev
```

2. Open your browser to the local development URL
3. Select your new shape from the dropdown menu
4. Verify that it renders correctly

---

## File Structure Summary

```plaintext
src/
├── shaders/
│   ├── red.frag.wgsl
│   └── <shape>.vert.wgsl    # Your vertex shader
├── test-<shape>.ts          # Your shape initialization
├── main.ts                  # Updated with your shape
└── index.html              # Updated shape selector
```

## Common Issues and Solutions

1. **Shape not appearing:**
   - Verify vertex coordinates are within visible range (-1.0 to 1.0)
   - Check `NUM_VERTICES` matches your vertex array length
   - Ensure topology matches your vertex arrangement

2. **Compilation errors:**
   - Verify WGSL syntax in your vertex shader
   - Check all imports are correctly pathed
   - Ensure TypeScript types are properly defined

3. **Performance issues:**
   - Minimize vertex count when possible
   - Use appropriate primitive topology
   - Consider using indexed drawing for complex shapes

---

Remember to replace `<shape>` with your actual shape name in all file paths and code examples. This process ensures your new shape is fully integrated into the application's rendering pipeline.