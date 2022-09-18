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


  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(program);



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
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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

  const genDelaunayPointsData = (defaultGroup: number[][] = []) => {
    let group: number[][] = [];
    const w = 10;
    const h = 10;
    const strayX = 8;
    const strayY = 5;
    // split the full area into several small areas (base on w and h);
    for (let i = 0; i <= w; i++) {
      for (let j = 0; j <= h; j++) {
        group.push([-1 + i * 2 / w, -1 + j * 2 / h]); // get all vertex coord
      }
    }
    // give these coord a little bit stray
    group = group.map((val) => {
      const randomCoordStray = genRandomCoord();
      return [val[0] + randomCoordStray[0] / strayX, val[1] + randomCoordStray[1] / strayY]
    })
    // add corners
    const corners = [
      [-1, -1],
      [1, 1],
      [1, -1],
      [-1, 1]
    ]
    group.push(
      ...corners
    )

    if (defaultGroup.length != 0) {
      group = defaultGroup;
    }

    const points = Delaunator.from(group);
    return { points, group }
  }

  const getTriangles = (defaultGroup: number[][] = []) => {
    const coordinates = [];
    const { points, group } = defaultGroup.length > 0 ? genDelaunayPointsData(defaultGroup) : genDelaunayPointsData();
    const triangles = points.triangles;
    console.log(triangles, group);
    for (let i = 0; i < triangles.length; i += 3) {
      coordinates.push([
        [group[triangles[i]][0], group[triangles[i]][1]],
        [group[triangles[i + 1]][0], group[triangles[i + 1]][1]],
        [group[triangles[i + 2]][0], group[triangles[i + 2]][1]]
      ]);
    }

    return { coordinates, group };
  }

  const genColoredBufferObject = (triangleGroup: number[][][]) => {
    let colors = new Array(triangleGroup.length * 3);
    for (let i = 0; i < colors.length; i++) {
      let color = [
        Math.random(),
        Math.random(),
        Math.random()
      ]
      color = color.map((val) => {
        return 0.6 - (val / 1.2)
      })
      colors[i] = color;
    }

    let colorCache = [...colors];

    const getBuffer = () => {
      let buffer: number[] = [];
      triangleGroup.forEach((triangle: number[][], triangleIndex) => {
        // each triangle
        triangle.forEach((point: number[], pointIndex) => {
          buffer.push(...point);
          // get fill colors
          buffer.push(...colors[triangleIndex * 3 + pointIndex]);
        })
      })
      return buffer;
    }

    const period = 180;
    let countdown = 0;

    const getLinearColor = (percentage: number, p1c: number[], p2c: number[], p3c: number[]) => {
      let color: number[];
      if (percentage <= (1 / 3)) {
        color = [
          (p2c[0] - p1c[0]) * percentage * 3 + p1c[0],
          (p2c[1] - p1c[1]) * percentage * 3 + p1c[1],
          (p2c[2] - p1c[2]) * percentage * 3 + p1c[2]
        ]
      }
      else if (percentage <= (2 / 3)) {
        color = [
          (p3c[0] - p2c[0]) * (percentage - (1 / 3)) * 3 + p2c[0],
          (p3c[1] - p2c[1]) * (percentage - (1 / 3)) * 3 + p2c[1],
          (p3c[2] - p2c[2]) * (percentage - (1 / 3)) * 3 + p2c[2]
        ]
      }
      else if (percentage <= 1) {
        color = [
          (p1c[0] - p3c[0]) * (percentage - (2 / 3)) * 3 + p3c[0],
          (p1c[1] - p3c[1]) * (percentage - (2 / 3)) * 3 + p3c[1],
          (p1c[2] - p3c[2]) * (percentage - (2 / 3)) * 3 + p3c[2]
        ]
      }
      return color;
    }

    const decay = () => {
      const percentage = countdown / period;
      for (let i = 0; i < colors.length; i += 3) {
        const p1c = colorCache[i];
        const p2c = colorCache[i + 1];
        const p3c = colorCache[i + 2];
        colors[i] = getLinearColor(percentage, p1c, p2c, p3c)
        colors[i + 1] = getLinearColor(percentage, p2c, p3c, p1c)
        colors[i + 2] = getLinearColor(percentage, p3c, p1c, p2c)
      }
      if (countdown < period) {
        countdown += 1;
      }
      else {
        countdown = 0;
      }
    }


    return {
      getBuffer,
      decay
    };

  }


  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);

  let { coordinates } = getTriangles();
  const bufferObject = genColoredBufferObject(coordinates);


  const animate = () => {
    bufferObject.decay();
    const buffer = bufferObject.getBuffer();
    draw(buffer);
    requestAnimationFrame(() => {
      animate();
    })
  }

  animate();


}

window.onload = () => {
  init();
};


export { }