const fragmentShader = require('./shader/fragment.frag');
const vertexShader = require('./shader/vertex.vert');
import * as twgl from 'twgl.js'

function init(){
  const cvs = document.getElementById('canvas');
  if (!(cvs instanceof HTMLCanvasElement)) return;
  const gl  = cvs.getContext('webgl');
  const program = twgl.createProgram(gl,[fragmentShader,vertexShader]);
}

window.onload = init;