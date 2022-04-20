// This demo is from an anonymous Codepen.
// It has been modified to stop it having dependencies
// and been split up into seperate files.
// This is probably not a good resource to learn
// from as it has not been well thought out!
// https://codepen.io/anon/pen/EQLERV
const fragmentShader = require('./shaders/fragment.frag');
const vertexShader = require('./shaders/vertex.vert');

import * as twgl from 'twgl.js';

const init  = (vShader:string,fShader:string)=>{
  const canvas = document.getElementById("canvas");
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const gl = canvas.getContext("webgl");
    const programInfo = twgl.createProgramInfo(gl, [vShader, fShader]);
    const arrays = {
      position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
    };
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
    function render(time:number) {
      twgl.resizeCanvasToDisplaySize(gl.canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      const uniforms = {
        u_millis: time,
        u_resolution: [gl.canvas.width, gl.canvas.height],
      };
      const attributes = {
        a_position:{buffer: bufferInfo.attribs.position.buffer, size: 3},
      };

      const attributeSetter = twgl.createAttributeSetters(gl,programInfo.program);

      gl.useProgram(programInfo.program);
      twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
      twgl.setUniforms(programInfo, uniforms);
      twgl.setAttributes(attributeSetter,attributes);
      twgl.drawBufferInfo(gl, bufferInfo);
  
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

window.onload = ()=>{
  init(vertexShader,fragmentShader);
}

