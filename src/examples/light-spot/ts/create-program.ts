import createShader from './create-shader';

const createProgram = (gl:WebGLRenderingContext, shaderData:any) => {
  const program = gl.createProgram();

  shaderData
    .map((s:any) => createShader(gl, s.src, s.type))
    .forEach((s:any) => gl.attachShader(program, s));

  gl.linkProgram(program);

  return program;
};

export default createProgram;
