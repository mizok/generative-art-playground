import * as p5 from 'p5';

function setRadialGradient(sX: number, sY: number, sR: number, eX: number, eY: number, eR: number, colorS: string, colorE: string, p: p5 | p5.Graphics) {
  const ctx = p.drawingContext as CanvasRenderingContext2D
  const gradient = ctx.createRadialGradient(
    sX, sY, sR, eX, eY, eR
  );
  gradient.addColorStop(0, colorS);
  gradient.addColorStop(1, colorE);
  p.drawingContext.fillStyle = gradient;
}
class Slime {
  private pos: p5.Vector;
  private vel: p5.Vector;
  private acc: p5.Vector;
  private mass: number;
  private p: p5;
  constructor(x: number, y: number, m: number, p: p5) {
    this.pos = p.createVector(x, y);
    this.vel = p.createVector(0, 0);
    this.acc = p.createVector(0, 0);
    this.mass = m;
    this.p = p;
  }
  //set up pos,vel,acc,mass


  //display (color, ellipse)
  display() {
    this.p.noStroke();

    this.p.fill(
      255,
      255,
      255,
      10
    );
    this.p.ellipse(this.pos.x, this.pos.y, this.mass);
  }

  update() {
    const noise = this.p.noise(this.pos.x, this.pos.y);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);

    //Movement of Slimes
    var movement = p5.Vector.random2D();
    movement.mult(0.9 * noise); //(connects previous & next cell)
    this.pos.add(movement);

  }
}

function drawShade(p: p5.Graphics, rate: number) {
  let slimes: any[] = [];
  p.pixelDensity(4);
  p.translate(-p.width * (rate - 1) / 2, -p.height * (rate - 1) / 2)
  p.scale(rate)

  // generate instances
  for (let i = 0; i < 360; i++) {
    slimes[i] = new Slime(p.width / 2, p.height / 2, p.random(0.1, 0.5), p);
  }
  // render instances
  for (let r = 0; r < 500; r++) {
    for (let i = 0; i < 360; i++) {
      slimes[i].display();
      slimes[i].update();
    }
  }
}

function main() {
  const sketch = (p: p5) => {

    p.setup = () => {
      // create canvas and do init background
      p.rectMode(p.CENTER);
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.blendMode('screen');

      const ctx: CanvasRenderingContext2D = p.drawingContext;
      const shadeGraphic = p.createGraphics(p.width, p.height);
      const gradientGraphic = p.createGraphics(p.width, p.height);
      const maskGraphic = p.createGraphics(p.width, p.height);
      setRadialGradient(
        p.width / 2, p.height / 2, 0,//Start pX, pY, start circle radius
        p.width / 2, p.height / 2, p.height,//End pX, pY, End circle radius
        '#3f5efb', //start color
        '#111111', //end color
        gradientGraphic
      )
      setRadialGradient(
        p.width / 2, p.height / 2, 0,//Start pX, pY, start circle radius
        p.width / 2, p.height / 2, p.height,//End pX, pY, End circle radius
        'transparent', //start color
        '#000000', //end color
        maskGraphic
      )
      gradientGraphic.noStroke();
      gradientGraphic.rectMode(gradientGraphic.CENTER);
      gradientGraphic.rect(p.width / 2, p.height / 2, p.width, p.height);
      maskGraphic.noStroke();
      maskGraphic.rectMode(maskGraphic.CENTER);
      maskGraphic.rect(p.width / 2, p.height / 2, p.width, p.height);

      drawShade(shadeGraphic, 5)

      for (let i = 5; i > 0; i--) {
        const rate = 2;
        p.background(0, 0, 0, 225);
        ctx.globalAlpha = 0.3;
        p.image(shadeGraphic, 0, 0, p.width, p.height);

        p.translate(-p.width * (rate - 1) / 2, -p.height * (rate - 1) / 2);
        p.scale(rate);
      }
      p.blendMode('difference');
      p.image(gradientGraphic, -p.width / 2, 0, 2 * p.width, p.height)
      // p.blendMode(p.HARD_LIGHT);
      // p.image(gradientGraphic, 0, 0, p.width, p.height)
      p.blendMode(p.DODGE);
      p.image(gradientGraphic, 0, 0, p.width, p.height)
      p.image(gradientGraphic, 0, 0, p.width, p.height)
      p.image(gradientGraphic, 0, 0, p.width, p.height)
      p.image(maskGraphic, 0, 0, p.width, p.height)
    }

  };

  new p5(sketch, document.body);
}


window.onload = main;