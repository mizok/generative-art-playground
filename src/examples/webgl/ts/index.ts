const fragmentShader = require('./shader/fragment.frag');
const vertexShader = require('./shader/vertex.vert');
import * as twgl from 'twgl.js'
import draw from './draw';

function init(){
  const cvs = document.getElementById('canvas');
  if (!(cvs instanceof HTMLCanvasElement)) return;
  const gl  = cvs.getContext('webgl');
  const program = twgl.createProgram(gl,[vertexShader,fragmentShader]);
  const geometryBuffer = twgl.createBufferFromArray(gl,[-1.0,-1.0,1.0,-1.0,-1.0,1.0,1.0,1.0],'buffer');
  gl.useProgram(program);
  const resize = ()=>{
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }
  window.onresize = resize;
  resize();

  requestAnimationFrame(now=>draw(gl, now, {
    geometryBuffer,
    // attributes,
    // uniforms,
  }))
}

window.onload = init;