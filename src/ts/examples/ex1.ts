import * as p5 from 'p5';

function main() {
  const sketch = (p: p5) => {

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      wavePattern(p);
    };

    p.draw = () => {


    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      wavePattern(p);
    }

  };

  new p5(sketch, document.body);
}

function wavePattern(p: p5) {
  p.blendMode('screen')
  p.clear(0, 0, 0, 0);
  p.background(0);
  const gap = 50;
  p.noStroke();
  const clr1 = p.color('#8f2d56');
  const clr2 = p.color('#218380');
  const iterate = p.int(p.width / gap); p.print(iterate);

  for (let i = 0; i < iterate; i++) {
    clr1.setAlpha(20);
    p.fill(clr1);
    p.ellipse(0, p.height / 2, i * gap * 2, i * gap * 2);
  }
  for (let i = 0; i < iterate; i++) {
    clr2.setAlpha(20);
    p.fill(clr2);
    p.ellipse(p.width, p.height / 2, i * gap * 2, i * gap * 2);
  }
}

window.onload = main;