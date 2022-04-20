// This demo is from an anonymous Codepen.
// It has been modified to stop it having dependencies
// and been split up into seperate files.
// This is probably not a good resource to learn
// from as it has not been well thought out!
// https://codepen.io/anon/pen/EQLERV
const fragmentShader = require('./shaders/fragment.frag');
const vertexShader = require('./shaders/vertex.vert');

import draw from './draw';
import * as twgl from 'twgl.js';

const init = () => {
  // Create program
  let canvas = document.getElementById('canvas');
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const gl = canvas.getContext('webgl');
  const program = twgl.createProgram(gl, [vertexShader,fragmentShader]);

  const geometryBuffer = twgl.createBufferFromArray(gl,
    [-1.0, -1.0,
    1.0, -1.0,
   -1.0,  1.0,
    1.0,  1.0],
    'buffer'
  );

  // Set up attributes and uniforms
  const attributes = {
    position: gl.getAttribLocation(program, 'a_position')
  };

  const uniforms = {
    resolution: gl.getUniformLocation(program, 'u_resolution'),
    millis: gl.getUniformLocation(program, 'u_millis')
  };

  // Set WebGL program here (we have only one)
  gl.useProgram(program);


  // Resize canvas and viewport
  const resize = () => {
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  };

  // Setup canvas
  window.onresize = resize;
  resize();

  // Start rendering
  requestAnimationFrame(now => draw(gl, now, {
    geometryBuffer,
    attributes,
    uniforms,
  }));

}

window.onload = init;
