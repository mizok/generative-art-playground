// This demo is from an anonymous Codepen.
// It has been modified to stop it having dependencies
// and been split up into seperate files.
// This is probably not a good resource to learn
// from as it has not been well thought out!
// https://codepen.io/anon/pen/EQLERV
const fragmentShaderSrc = require('./shaders/fragment.frag');
const vertexShaderSrc = require('./shaders/vertex.vert');
import resizeCanvas from './resize-canvas';
import createProgram from './create-program';
import createBuffer from './create-buffer';
import draw from './draw';
const init = () => {
  // Create program

  let canvas = document.getElementById('canvas');
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const gl = canvas.getContext('webgl');

  const shaders = [
    { src: fragmentShaderSrc, type: gl.FRAGMENT_SHADER },
    { src: vertexShaderSrc, type: gl.VERTEX_SHADER }
  ];

  const program = createProgram(gl, shaders);

  const geometryBuffer = createBuffer(gl);

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
    resizeCanvas(gl.canvas);
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
