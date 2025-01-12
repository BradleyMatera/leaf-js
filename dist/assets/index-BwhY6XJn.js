(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function o(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(t){if(t.ep)return;t.ep=!0;const n=o(t);fetch(t.href,n)}})();const m=`@vertex
fn main(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4<f32> {
  var pos = array<vec2<f32>, 3>(
    vec2(0.0, 0.5),
    vec2(-0.5, -0.5),
    vec2(0.5, -0.5)
  );

  return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
}`,u=`@fragment
fn main() -> @location(0) vec4<f32> {
  return vec4(1.0, 0.0, 0.0, 1.0);
}`;function d(a,e){const o=navigator.gpu.getPreferredCanvasFormat();a.configure({device:e,format:o,alphaMode:"opaque"});const i=e.createRenderPipeline({layout:"auto",vertex:{module:e.createShaderModule({code:m}),entryPoint:"main"},fragment:{module:e.createShaderModule({code:u}),entryPoint:"main",targets:[{format:o}]},primitive:{topology:"triangle-list"}});function t(){const n=e.createCommandEncoder(),c={colorAttachments:[{view:a.getCurrentTexture().createView(),clearValue:{r:.1,g:.3,b:.3,a:1},loadOp:"clear",storeOp:"store"}]},r=n.beginRenderPass(c);r.setPipeline(i),r.draw(3,1,0,0),r.end(),e.queue.submit([n.finish()]),requestAnimationFrame(t)}requestAnimationFrame(t)}const p=`@vertex
fn main(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4<f32> {
  var pos = array<vec2<f32>, 6>(
    vec2(-0.5, -0.5), // Bottom-left
    vec2(0.5, -0.5),  // Bottom-right
    vec2(-0.5, 0.5),  // Top-left
    vec2(-0.5, 0.5),  // Top-left (second triangle)
    vec2(0.5, -0.5),  // Bottom-right (second triangle)
    vec2(0.5, 0.5)    // Top-right
  );

  return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
}`;function f(a,e){const o=navigator.gpu.getPreferredCanvasFormat();a.configure({device:e,format:o,alphaMode:"opaque"});const i=e.createRenderPipeline({layout:"auto",vertex:{module:e.createShaderModule({code:p}),entryPoint:"main"},fragment:{module:e.createShaderModule({code:u}),entryPoint:"main",targets:[{format:o}]},primitive:{topology:"triangle-list"}});function t(){const n=e.createCommandEncoder(),c={colorAttachments:[{view:a.getCurrentTexture().createView(),clearValue:{r:.1,g:.3,b:.3,a:1},loadOp:"clear",storeOp:"store"}]},r=n.beginRenderPass(c);r.setPipeline(i),r.draw(6,1,0,0),r.end(),e.queue.submit([n.finish()]),requestAnimationFrame(t)}requestAnimationFrame(t)}const v=`@vertex
fn main(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4<f32> {
  var pos = array<vec2<f32>, 15>(
    vec2(0.0, 0.0),       // Center
    vec2(0.0, 0.5),       // Top
    vec2(0.47, 0.15),     // Top-right

    vec2(0.0, 0.0),       // Center
    vec2(0.47, 0.15),     // Top-right
    vec2(0.29, -0.4),     // Bottom-right

    vec2(0.0, 0.0),       // Center
    vec2(0.29, -0.4),     // Bottom-right
    vec2(-0.29, -0.4),    // Bottom-left

    vec2(0.0, 0.0),       // Center
    vec2(-0.29, -0.4),    // Bottom-left
    vec2(-0.47, 0.15),    // Top-left

    vec2(0.0, 0.0),       // Center
    vec2(-0.47, 0.15),    // Top-left
    vec2(0.0, 0.5)        // Top
  );

  return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
}`;function g(a,e){const o=navigator.gpu.getPreferredCanvasFormat();a.configure({device:e,format:o,alphaMode:"opaque"});const i=e.createRenderPipeline({layout:"auto",vertex:{module:e.createShaderModule({code:v}),entryPoint:"main"},fragment:{module:e.createShaderModule({code:u}),entryPoint:"main",targets:[{format:o}]},primitive:{topology:"triangle-list"}});function t(){const n=e.createCommandEncoder(),c={colorAttachments:[{view:a.getCurrentTexture().createView(),clearValue:{r:.1,g:.3,b:.3,a:1},loadOp:"clear",storeOp:"store"}]},r=n.beginRenderPass(c);r.setPipeline(i),r.draw(15,1,0,0),r.end(),e.queue.submit([n.finish()]),requestAnimationFrame(t)}requestAnimationFrame(t)}const h=`@vertex
fn main(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4<f32> {
  var pos = array<vec2<f32>, 12>(
    vec2(0.0, 0.0),       // Center
    vec2(0.0, 0.5),       // Top
    vec2(0.5, 0.0),       // Right
    vec2(0.0, 0.0),       // Center
    vec2(0.5, 0.0),       // Right
    vec2(0.0, -0.5),      // Bottom
    vec2(0.0, 0.0),       // Center
    vec2(0.0, -0.5),      // Bottom
    vec2(-0.5, 0.0),      // Left
    vec2(0.0, 0.0),       // Center
    vec2(-0.5, 0.0),      // Left
    vec2(0.0, 0.5)        // Top
  );

  return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
}`;function x(a,e){const o=navigator.gpu.getPreferredCanvasFormat();a.configure({device:e,format:o,alphaMode:"opaque"});const i=e.createRenderPipeline({layout:"auto",vertex:{module:e.createShaderModule({code:h}),entryPoint:"main"},fragment:{module:e.createShaderModule({code:u}),entryPoint:"main",targets:[{format:o}]},primitive:{topology:"triangle-list"}});function t(){const n=e.createCommandEncoder(),c={colorAttachments:[{view:a.getCurrentTexture().createView(),clearValue:{r:.1,g:.3,b:.3,a:1},loadOp:"clear",storeOp:"store"}]},r=n.beginRenderPass(c);r.setPipeline(i),r.draw(12,1,0,0),r.end(),e.queue.submit([n.finish()]),requestAnimationFrame(t)}requestAnimationFrame(t)}const P=`@vertex
fn main(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4<f32> {
  var pos = array<vec2<f32>, 18>(
    vec2(0.0, 0.0),       // Center
    vec2(0.0, 0.5),       // Top
    vec2(0.43, 0.25),     // Top-right

    vec2(0.0, 0.0),       // Center
    vec2(0.43, 0.25),     // Top-right
    vec2(0.43, -0.25),    // Bottom-right

    vec2(0.0, 0.0),       // Center
    vec2(0.43, -0.25),    // Bottom-right
    vec2(0.0, -0.5),      // Bottom

    vec2(0.0, 0.0),       // Center
    vec2(0.0, -0.5),      // Bottom
    vec2(-0.43, -0.25),   // Bottom-left

    vec2(0.0, 0.0),       // Center
    vec2(-0.43, -0.25),   // Bottom-left
    vec2(-0.43, 0.25),    // Top-left

    vec2(0.0, 0.0),       // Center
    vec2(-0.43, 0.25),    // Top-left
    vec2(0.0, 0.5)        // Top
  );

  return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
}`;function y(a,e){const o=navigator.gpu.getPreferredCanvasFormat();a.configure({device:e,format:o,alphaMode:"opaque"});const i=e.createRenderPipeline({layout:"auto",vertex:{module:e.createShaderModule({code:P}),entryPoint:"main"},fragment:{module:e.createShaderModule({code:u}),entryPoint:"main",targets:[{format:o}]},primitive:{topology:"triangle-list"}});function t(){const n=e.createCommandEncoder(),c={colorAttachments:[{view:a.getCurrentTexture().createView(),clearValue:{r:.1,g:.3,b:.3,a:1},loadOp:"clear",storeOp:"store"}]},r=n.beginRenderPass(c);r.setPipeline(i),r.draw(18,1,0,0),r.end(),e.queue.submit([n.finish()]),requestAnimationFrame(t)}requestAnimationFrame(t)}function b(a,e){if(!a)throw new Error(e)}(async()=>{if(navigator.gpu===void 0){const r=document.querySelector("#title");r.innerText="WebGPU is not supported in this browser.";return}const a=await navigator.gpu.requestAdapter();if(a===null){const r=document.querySelector("#title");r.innerText="No adapter is available for WebGPU.";return}const e=await a.requestDevice(),o=document.querySelector("#webgpu-canvas");b(o!==null),new ResizeObserver(()=>{o.width=o.clientWidth,o.height=o.clientHeight}).observe(o);const t=o.getContext("webgpu"),n={triangle:d,square:f,pentagon:g,diamond:x,hexagon:y};function s(r){const l=n[r];l&&l(t,e)}s("triangle");const c=document.querySelector("#shape-selector");c==null||c.addEventListener("change",r=>{const l=r.target.value;s(l)})})();
