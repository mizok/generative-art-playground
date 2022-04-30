const fragmentShaderScript = require('./shaders/fragment.frag');
const vertexShaderScript = require('./shaders/vertex.vert');
import Delaunator from "delaunator";

const init = () => {
  const canvas = document.getElementById("canvas");
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const gl: WebGLRenderingContext = canvas.getContext("webgl");
  gl.canvas.width = window.devicePixelRatio * gl.canvas.clientWidth;
  gl.canvas.height = window.devicePixelRatio * gl.canvas.clientHeight;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);

  gl.shaderSource(fragmentShader, fragmentShaderScript);
  gl.shaderSource(vertexShader, vertexShaderScript);

  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.warn(`vertex shader error!`, gl.getShaderInfoLog(vertexShader));
    return;
  }

  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.warn(`fragment shader error!`, gl.getShaderInfoLog(fragmentShader));
    return;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  //link program
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn(`link program fail!ed`, gl.getProgramInfoLog(program));
    return;
  }

  //validate program
  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.warn(`validate program failed`, gl.getProgramInfoLog(program));
  }

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positionAttribLocation = gl.getAttribLocation(program, 'a_position');
  const colorAttribLocation = gl.getAttribLocation(program, 'a_color');

  gl.clearColor(0.5, 0.5, 0.5, 0.5);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const nodeGroup = [];
  for (let i = 0; i < 30; i++) {
    nodeGroup[i] = [Math.random(), Math.random()]
  }



  const draw = (bufferArr: number[]) => {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferArr), gl.STATIC_DRAW);
    gl.vertexAttribPointer(
      positionAttribLocation, // Attribute location
      2, // Number of elements per attribute
      gl.FLOAT, // Type of elements
      false,
      5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
      0 // Offset from the beginning of a single vertex to this attribute
    );
    gl.vertexAttribPointer(
      colorAttribLocation, // Attribute location
      3, // Number of elements per attribute
      gl.FLOAT, // Type of elements
      false,
      5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
      2 * Float32Array.BYTES_PER_ELEMENT// Offset from the beginning of a single vertex to this attribute
    );
    //
    // Main render loop
    //
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, bufferArr.length / 5);
  }

  const genDataArray = (times: number) => {
    const arr = [];
    for (let i = 0; i < times; i++) {
      arr[i] = Math.random();
    }
    return arr;
  }

  const genRandomCoord = () => {
    const arr = genDataArray(2);

    return [arr[0] * 2 - 1, arr[1] * 2 - 1];
  }

  const genDelaunayPointsData = (seedNum: number) => {
    let group: number[][] = [];
    for (let i = 0; i < seedNum; i++) {
      group.push(genRandomCoord().map((val) => val * 1.75));
    }
    const corners = [
      [-1, -1],
      [1, 1],
      [1, -1],
      [-1, 1]
    ]
    group.push(
      ...corners
    )

    const points = Delaunator.from(group);
    return { points, group }
  }

  const getTriangles = (seedNum: number = 20) => {
    const coordinates = [];
    let buffer: number[] = [];
    const { points, group } = genDelaunayPointsData(seedNum);
    const triangles = points.triangles;
    for (let i = 0; i < triangles.length; i += 3) {
      coordinates.push([
        [group[triangles[i]][0], group[triangles[i]][1]],
        [group[triangles[i + 1]][0], group[triangles[i + 1]][1]],
        [group[triangles[i + 2]][0], group[triangles[i + 2]][1]]
      ]);
    }
    coordinates.forEach((triangle) => {
      // each triangle
      triangle.forEach((point) => {
        buffer = buffer.concat(point);
        buffer = buffer.concat([Math.random(), Math.random(), Math.random()]);
      })
    })
    return buffer;
  }


  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);



  draw(getTriangles(20));



}

window.onload = () => {
  init();
};


export { }