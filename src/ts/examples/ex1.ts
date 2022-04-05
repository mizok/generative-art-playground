import * as p5 from 'p5';

function main(){
  const sketch = (p:p5) => {

    p.setup = ()=>{
      p.createCanvas(p.windowWidth, p.windowHeight);
    };
  
    p.draw = ()=>{
      p.background(100);
      p.ellipse(p.width/2,p.height/3,50,50);
      p.ellipse(p.width/2,p.height/3,50,50);
      p.ellipse(p.width/2,p.height/3,50,50);
    };

    p.windowResized = ()=>{
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    }

  };
  
  new p5(sketch, document.body);
}

window.onload = main;