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
  private mass: number;
  private p: p5;
  constructor(x: number, y: number, m: number, p: p5) {
    this.pos = p.createVector(x, y);
    this.mass = m;
    this.p = p;
  }

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

    //Movement of Slimes
    var movement = p5.Vector.random2D();
    movement.mult(0.9 * noise); //(connects previous & next cell)
    this.pos.add(movement);

  }
}

function createShade(p: p5, rate: number,density= 4) {
  let slimes: any[] = [];
  const graphic  = p.createGraphics(p.width, p.height);
  graphic.pixelDensity(density);
  graphic.translate(-graphic.width * (rate - 1) / 2, -graphic.height * (rate - 1) / 2)
  graphic.scale(rate)

  // generate instances
  for (let i = 0; i < 360; i++) {
    slimes[i] = new Slime(graphic.width / 2, graphic.height / 2, graphic.random(0.1, 0.5), graphic);
  }
  // render instances
  for (let r = 0; r < 500; r++) {
    for (let i = 0; i < 360; i++) {
      slimes[i].display();
      slimes[i].update();
    }
  }

  return graphic;
}

function createGradientTexture(p:p5,color1:string,color2:string){
  const graphic = p.createGraphics(p.width, p.height);
  setRadialGradient(
    p.width / 2, p.height / 2, 0,//Start pX, pY, start circle radius
    p.width / 2, p.height / 2, p.height,//End pX, pY, End circle radius
    color1, //start color
    color2, //end color
    graphic
  )
  graphic.noStroke();
  graphic.rect(0,0, p.width, p.height);
  return graphic;
}

function createStarLightTexture(p:p5){

}

function main() {
  const sketch = (p: p5) => {
    p.setup = () => {
      // create canvas and do init background
      p.rectMode(p.CENTER);
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.blendMode(p.SCREEN);
      // 取得底稿渲染環境
      const ctx: CanvasRenderingContext2D = p.drawingContext;
      // 創造單一暈染圖樣
      const shadeGraphic = createShade(p,5)
      // 創造漸層圖樣
      const gradientGraphic = createGradientTexture(p,'#78cce2','#002439');
      const maskGraphic = createGradientTexture(p,'transparent', '#000');
      p.push();
      const count = 5
      for (let i = count; i > 0; i--) {
        const rate = 3;
        p.background(0, 0, 0, 150);
        ctx.globalAlpha = 0.25;
        p.image(shadeGraphic, 0, 0, p.width, p.height);
        p.translate(-p.width * (rate - 1) / 2, -p.height * (rate - 1) / 2);
        p.scale(rate);
      }
      p.pop();
      p.blendMode(p.DIFFERENCE);
      p.image(gradientGraphic, -p.width / 2, 0, 2 * p.width, p.height)
      p.blendMode(p.DODGE);
      p.image(gradientGraphic, 0, 0, p.width, p.height)
      p.blendMode(p.MULTIPLY);
      p.image(maskGraphic, 0, 0, p.width, p.height)
    }

  };

  new p5(sketch, document.body);
}


window.onload = main;