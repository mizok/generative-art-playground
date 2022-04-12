import * as p5 from 'p5';

function setRadialGradient(p: p5 | p5.Graphics,sX: number, sY: number, sR: number, eX: number, eY: number, eR: number, ...colors:{val:number,name:string}[]) {
  const ctx = p.drawingContext as CanvasRenderingContext2D
  const gradient = ctx.createRadialGradient(
    sX, sY, sR, eX, eY, eR
  );
  colors.forEach((o)=>{
    gradient.addColorStop(o.val, o.name);
  })
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
  const particleRandomSeed = [0.1, 0.5];
  graphic.pixelDensity(density);
  graphic.translate(-graphic.width * (rate - 1) / 2, -graphic.height * (rate - 1) / 2)
  graphic.scale(rate)
  // generate instances
  for (let i = 0; i < 360; i++) {
    slimes[i] = new Slime(graphic.width / 2, graphic.height / 2, graphic.random(...particleRandomSeed), graphic);
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

function createGradientTexture(p:p5,...colors:{val:number,name:string}[]){
  const graphic = p.createGraphics(p.width, p.height);
  setRadialGradient(
    graphic,
    p.width / 2, p.height / 2, 0,//Start pX, pY, start circle radius
    p.width / 2, p.height / 2, p.height,//End pX, pY, End circle radius
    ...colors
  )
  graphic.noStroke();
  graphic.rect(0,0, p.width, p.height);
  return graphic;
}

function createStarLightTexture(p:p5,number:number){
  const graphic = p.createGraphics(p.width, p.height);
  const starNum = number;
  const color1 = p.color(255,255,255,200)
  const color2 = p.color(155,10,120,200);
  graphic.noStroke();
  graphic.push();
  for(let i = 0;i<10;i++){
    const randomX = p.width * p.random();
    const randomY = p.height * p.random();
    const randomSize = p.random() * 10;
    const color = graphic.lerpColor(color1,color2,p.random())
    graphic.fill(color);
    graphic.ellipse(randomX,randomY,randomSize,randomSize);
  }
  graphic.filter(p.BLUR,3);
  graphic.pop()
  for(let i = 0;i<starNum;i++){
    const randomX = p.width * p.random();
    const randomY = p.height * p.random();
    const randomSize = p.random() * 3;
    const color = graphic.lerpColor(color1,color2,p.random())
    graphic.fill(color);
    graphic.ellipse(randomX,randomY,randomSize,randomSize);
  }
  return graphic;
}

function main() {
  const sketch = (p: p5) => {
    p.setup = () => {
      // create canvas and do init background
      p.rectMode(p.CENTER);
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.background(50);
      p.blendMode(p.SCREEN);
      // 取得底稿渲染環境
      const ctx: CanvasRenderingContext2D = p.drawingContext;
      // 創造單一暈染圖樣
      const shadeGraphic = createShade(p,5)
      // 創造星空圖樣
      const starLightGraphic = createStarLightTexture(p,200)
      // 創造漸層圖樣
      const gradientGraphic = createGradientTexture(p,{name:'#b0efff',val:0},{name:'#78cce2',val:0.12},{name:'#002439',val:1});
      const maskGraphic = createGradientTexture(p,{name:'transparent',val:0},{name:'#000000',val:1});
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
      const scaleHRate1 = 1.65;
      const scaleHRate2 = 1.3;
      p.image(gradientGraphic, -p.width * (scaleHRate1 - 1) / 2, 0, scaleHRate1 * p.width, p.height)
      p.blendMode(p.DODGE);
      p.image(gradientGraphic, 0, 0, p.width, p.height)
      p.blendMode(p.MULTIPLY);
      p.image(maskGraphic, -p.width * (scaleHRate2 - 1) / 2, 0, scaleHRate2 * p.width, p.height)
      p.blendMode(p.SCREEN);
      p.image(starLightGraphic, 0, 0, p.width, p.height)
    }
  };

  new p5(sketch, document.body);
}


window.onload = main;