(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const a of t.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function i(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}})();const u=`@vertex
fn main(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4<f32> {
  var pos = array<vec2<f32>, 3>(
    vec2(0.0, 0.5),
    vec2(-0.5, -0.5),
    vec2(0.5, -0.5)
  );

  return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
}`,l=`@fragment
fn main() -> @location(0) vec4<f32> {
  return vec4(1.0, 0.0, 0.0, 1.0);
}`;function d(o,r){const n=navigator.gpu.getPreferredCanvasFormat();o.configure({device:r,format:n,alphaMode:"opaque"});const i=r.createRenderPipeline({layout:"auto",vertex:{module:r.createShaderModule({code:u}),entryPoint:"main"},fragment:{module:r.createShaderModule({code:l}),entryPoint:"main",targets:[{format:n}]},primitive:{topology:"triangle-list"}});function e(){const t=r.createCommandEncoder(),c={colorAttachments:[{view:o.getCurrentTexture().createView(),clearValue:{r:.1,g:.3,b:.3,a:1},loadOp:"clear",storeOp:"store"}]},s=t.beginRenderPass(c);s.setPipeline(i),s.draw(3,1,0,0),s.end(),r.queue.submit([t.finish()]),requestAnimationFrame(e)}requestAnimationFrame(e)}function f(o,r){if(!o)throw new Error(r)}(async()=>{if(navigator.gpu===void 0){const t=document.querySelector("#title");t.innerText="WebGPU is not supported in this browser.";return}const o=await navigator.gpu.requestAdapter();if(o===null){const t=document.querySelector("#title");t.innerText="No adapter is available for WebGPU.";return}const r=await o.requestDevice(),n=document.querySelector("#webgpu-canvas");f(n!==null),new ResizeObserver(()=>{n.width=n.clientWidth,n.height=n.clientHeight}).observe(n);const e=n.getContext("webgpu");d(e,r)})();
