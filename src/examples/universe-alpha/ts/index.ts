import  p5 from 'p5';

function setRadialGradient(p: p5 | p5.Graphics, sX: number, sY: number, sR: number, eX: number, eY: number, eR: number, ...colors: { val: number, name: string }[]) {
  const ctx = p.drawingContext as CanvasRenderingContext2D
  const gradient = ctx.createRadialGradient(
    sX, sY, sR, eX, eY, eR
  );
  colors.forEach((o) => {
    gradient.addColorStop(o.val, o.name);
  })
  p.drawingContext.fillStyle = gradient;
}

class StarSky {
  private stars: any[] = []
  constructor(private p: p5 | p5.Graphics, private number: number = 100) {
    this.init();
  }
  init() {
    this.genStars();
    this.draw();
  }
  genStars() {
    const color1 = this.p.color(255, 255, 255);
    const color2 = this.p.color(155, 10, 120);
    const genStar = (size: number) => {
      const duration = this.p.random(0.5, 1) * 100;
      return {
        x: this.p.random(0, this.p.width),
        y: this.p.random(0, this.p.height),
        color: this.p.lerpColor(color1, color2, this.p.random()),
        size: size,
        life: duration,
        alpha: 1,
        twinkle: function () {
          if (this.life >= duration / 2) {
            this.alpha -= (1 / (duration / 2))
          }
          else if (this.life >= 0) {
            this.alpha += (1 / (duration / 2))
          }
          else {
            this.life = duration;
            this.alpha = 1;
          }
          this.life--
        }
      }
    }

    for (let i = 0; i < this.number; i++) {
      const star = genStar(this.p.random() * 3)
      this.stars.push(star);
    }

    for (let i = 0; i < 10; i++) {
      const star = genStar(this.p.random() * 6)
      this.stars.push(star);
    }

  }

  draw() {
    this.p.drawingContext.clearRect(0, 0, this.p.width, this.p.height)
    for (let i = 0; i < this.stars.length; i++) {
      this.stars[i].twinkle();
      const color = Object.assign(this.stars[i].color, {});
      color.setAlpha(this.stars[i].alpha * 255);
      this.p.fill(color);
      this.p.ellipse(this.stars[i].x, this.stars[i].y, this.stars[i].size);
    }
  }
}

class GrowingShade {
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

    //Movement of GrowingShades
    var movement = p5.Vector.random2D();
    movement.mult(0.9 * noise); //(connects previous & next cell)
    this.pos.add(movement);

  }
}

function createShade(p: p5, rate: number, density = 4) {
  let growingShade: any[] = [];
  const graphic = p.createGraphics(p.width, p.height);
  const particleRandomSeed = [0.1, 0.5];
  graphic.pixelDensity(density);
  graphic.translate(-graphic.width * (rate - 1) / 2, -graphic.height * (rate - 1) / 2)
  graphic.scale(rate)
  // generate instances
  for (let i = 0; i < 360; i++) {
    growingShade[i] = new GrowingShade(graphic.width / 2, graphic.height / 2, graphic.random(...particleRandomSeed), graphic);
  }
  // render instances
  for (let r = 0; r < 500; r++) {
    for (let i = 0; i < 360; i++) {
      growingShade[i].display();
      growingShade[i].update();
    }
  }
  return graphic;
}

function createGradientTexture(p: p5, ...colors: { val: number, name: string }[]) {
  const graphic = p.createGraphics(p.width, p.height);
  setRadialGradient(
    graphic,
    p.width / 2, p.height / 2, 0,//Start pX, pY, start circle radius
    p.width / 2, p.height / 2, p.height,//End pX, pY, End circle radius
    ...colors
  )
  graphic.noStroke();
  graphic.rect(0, 0, p.width, p.height);
  return graphic;
}

function createStarLightTexture(p: p5, number: number) {
  const graphic = p.createGraphics(p.width, p.height);
  graphic.noStroke();
  const instance = new StarSky(graphic, number)
  return { graphic, instance };
}

function main() {
  const sketch = (p: p5) => {

    //prerender
    const prerender = ((p) => {
      // create canvas and do init background
      p.createCanvas(p.windowWidth, p.windowHeight);

      // 創造單一暈染圖樣
      const shadeGraphic = createShade(p, 5)
      // 創造星空圖樣
      const starLightGraphic = createStarLightTexture(p, 600);
      // 創造漸層圖樣
      const gradientGraphic = createGradientTexture(p, { name: '#b0efff', val: 0 }, { name: '#78cce2', val: 0.12 }, { name: '#002439', val: 1 });
      const maskGraphic = createGradientTexture(p, { name: 'transparent', val: 0 }, { name: '#000000', val: 1 });
      return {
        shadeGraphic, starLightGraphic, gradientGraphic, maskGraphic
      }
    })(p)

    const drawStatic = () => {
      //ctx
      const ctx: CanvasRenderingContext2D = p.drawingContext;
      p.background(50);
      p.blendMode(p.SCREEN);
      // 取得底稿渲染環境
      p.push();

      const count = 5
      for (let i = count; i > 0; i--) {
        const rate = 3;
        p.background(0, 0, 0, 150);
        ctx.globalAlpha = 0.25;
        p.image(prerender.shadeGraphic, 0, 0, p.width, p.height);
        p.translate(-p.width * (rate - 1) / 2, -p.height * (rate - 1) / 2);
        p.scale(rate);
      }
      ctx.globalAlpha = 1;
      p.pop();
      p.blendMode(p.DIFFERENCE);
      const scaleHRate1 = 1.65;
      const scaleHRate2 = 1.3;
      p.image(prerender.gradientGraphic, -p.width * (scaleHRate1 - 1) - 101 / 2, 0, scaleHRate1 * p.width + 101, p.height)
      p.blendMode(p.DODGE);
      p.image(prerender.gradientGraphic, 0, 0, p.width, p.height)
      p.blendMode(p.MULTIPLY);
      p.image(prerender.maskGraphic, -p.width * (scaleHRate2 - 1) / 2, 0, scaleHRate2 * p.width, p.height)
    }
    p.setup = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      drawStatic()
    }
    p.draw = () => {
      prerender.starLightGraphic.instance.draw();
      p.drawingContext.clearRect(0, 0, p.width, p.height);
      drawStatic();
      p.blendMode(p.SCREEN);
      p.image(prerender.starLightGraphic.graphic, 0, 0, p.width, p.height)
    }
  };

  new p5(sketch, document.body);
}

window.onload = main;