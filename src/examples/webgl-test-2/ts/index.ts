const fragmentShaderScript = require('./shaders/fragment.frag');
const vertexShaderScript = require('./shaders/vertex.vert');
import { glMatrix,mat4 } from "gl-matrix";

const init  = ()=>{
  const canvas = document.getElementById("canvas");
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const gl:WebGLRenderingContext = canvas.getContext("webgl");
  gl.canvas.width = window.devicePixelRatio * gl.canvas.clientWidth;
  gl.canvas.height = window.devicePixelRatio * gl.canvas.clientHeight;
  gl.viewport(0,0,gl.canvas.width,gl.canvas.height)

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  
  gl.shaderSource(fragmentShader,fragmentShaderScript);
  gl.shaderSource(vertexShader,vertexShaderScript);

  gl.compileShader(vertexShader);
  if(!gl.getShaderParameter(vertexShader,gl.COMPILE_STATUS)){
    console.warn(`vertex shader error!`,gl.getShaderInfoLog(vertexShader));
    return;
  }

  gl.compileShader(fragmentShader);
  if(!gl.getShaderParameter(fragmentShader,gl.COMPILE_STATUS)){
    console.warn(`fragment shader error!`,gl.getShaderInfoLog(fragmentShader));
    return;
  }

  const program = gl.createProgram();
  gl.attachShader(program,vertexShader);
  gl.attachShader(program,fragmentShader);

  //link program
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
    console.warn(`link program fail!ed`, gl.getProgramInfoLog(program));
    return;
  }

  //validate program
  gl.validateProgram(program);
  if(!gl.getProgramParameter(program,gl.VALIDATE_STATUS)){
    console.warn(`validate program failed`,gl.getProgramInfoLog(program));
  }
  const bufferArr = [
    //x,y,z       //r,g,b
    0.0,0.5,0.0,    0.1,0.2,0.3,
    -0.5,-0.5,0.0,  0.4,0.5,0.2,
    0.5,-0.5,0.0,   0.3,0.2,0.1
  ]
  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferArr), gl.STATIC_DRAW);

  const positionAttribLocation = gl.getAttribLocation(program, 'a_position');
  const colorAttribLocation = gl.getAttribLocation(program, 'a_color');

	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		false,
		6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);

  gl.vertexAttribPointer(
		colorAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		false,
		6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		3 * Float32Array.BYTES_PER_ELEMENT// Offset from the beginning of a single vertex to this attribute
	);

  gl.useProgram(program);

  const projectionUniformLocation = gl.getUniformLocation(program,'mProj');
  const viewUniformLocation = gl.getUniformLocation(program,'mView');
  const worldUniformLocation = gl.getUniformLocation(program,'mWorld');

  const projectionMatArr = new Float32Array(16);
  const viewMatArr = new Float32Array(16);
  const worldMatArr = new Float32Array(16);

  const projectionMat = mat4.identity(projectionMatArr);
  const viewMat = mat4.lookAt(viewMatArr,[0,0,-2],[0,0,0],[0,1,0]);
  const worldMat = mat4.identity(worldMatArr);
  mat4.perspective(projectionMat,glMatrix.toRadian(45),gl.canvas.width/gl.canvas.height,0.1,1000.0);

  gl.uniformMatrix4fv(projectionUniformLocation,false,projectionMat)
  gl.uniformMatrix4fv(viewUniformLocation,false,viewMat)
  gl.uniformMatrix4fv(worldUniformLocation,false,worldMat)

	gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);

	//
	// Main render loop
	//
  const identityMat = mat4.identity(new Float32Array(16));
  let angle = 0;
  const loop = (now:number)=>{
    angle = now /1000/2*Math.PI;
    mat4.rotate(worldMat,identityMat,angle,[0,1,0]);
    gl.uniformMatrix4fv(worldUniformLocation,false,worldMat)
    gl.clearColor(0.5,0.5,0.5,0.5);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
	

}

window.onload = ()=>{
  init();
};


export {}