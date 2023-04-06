import React, { useState, useRef, useEffect } from 'react'
import p5 from 'p5';
import Box from '@mui/material/Box';

type FireWorkProps = {
};

const FireWork : React.FunctionComponent<FireWorkProps> = (props) => {
  const [step, setStep] = useState(0);
  const p5Ref = useRef();
  const containDiv = useRef<HTMLInputElement>(null);
  let myP5Canvas:any = null;

  useEffect(() => {
  	if (!myP5Canvas)
	    myP5Canvas = new p5(sketch, p5Ref.current);

	  return () => {
	  	if (myP5Canvas)
				myP5Canvas.remove();
	  }
  }, []);

	const sketch = (p: any) => {
		const width = containDiv?.current?.getBoundingClientRect().width;
		const height = containDiv?.current?.getBoundingClientRect().height;
		const fireworks: Firework[] = [];
		let gravity: any;
		
		// Firework come from 
		// Daniel Shiffman project
		// http://codingtra.in
		class Particle {
			pos: any = null;
			firework: boolean = null;
			lifespan: number = null;
			hu: number = null;
			acc: any = null;
			vel: any = null;
		  constructor(x: number, y: number, hu: number, firework: boolean) {
		    this.pos = p.createVector(x, y);
		    this.firework = firework;
		    this.lifespan = 255;
		    this.hu = hu;
		    this.acc = p.createVector(0, 0);
		    if (this.firework) {
		      this.vel = p.createVector(0, p.random(-12, -8));
		    } else {
		      this.vel = p5.Vector.random2D();
		      this.vel.mult(p.random(2, 10));
		    }
		  }

		  applyForce(force: any) {
		    this.acc.add(force);
		  }

		  update() {
		    if (!this.firework) {
		      this.vel.mult(0.9);
		      this.lifespan -= 4;
		    }
		    this.vel.add(this.acc);
		    this.pos.add(this.vel);
		    this.acc.mult(0);
		  }

		  done() {
		    if (this.lifespan < 0) {
		      return true;
		    } else {
		      return false;
		    }
		  }

		  show() {
		    p.colorMode(p.HSB);

		    if (!this.firework) {
		      p.strokeWeight(2);
		      p.stroke(this.hu, 255, 255, this.lifespan);
		    } else {
		      p.strokeWeight(4);
		      p.stroke(this.hu, 255, 255);
		    }

		    p.point(this.pos.x, this.pos.y);
		  }
		}
		class Firework {
		  hu: number = null;
		  firework: Particle = null;
		  exploded: boolean = false;
		  particles: Particle[] = null;
		  constructor() {
		    this.hu = p.random(255);
		    this.firework = new Particle(p.random(width), height, this.hu, true);
		    this.exploded = false;
		    this.particles = [];
		  }

		  done() {
		    if (this.exploded && this.particles.length === 0) {
		      return true;
		    } else {
		      return false;
		    }
		  }

		  update() {
		    if (!this.exploded) {
		      this.firework.applyForce(gravity);
		      this.firework.update();

		      if (this.firework.vel.y >= 0) {
		        this.exploded = true;
		        this.explode();
		      }
		    }

		    for (let i = this.particles.length - 1; i >= 0; i--) {
		      this.particles[i].applyForce(gravity);
		      this.particles[i].update();

		      if (this.particles[i].done()) {
		        this.particles.splice(i, 1);
		      }
		    }
		  }

		  explode() {
		    for (let i = 0; i < 100; i++) {
		      const p = new Particle(this.firework.pos.x, this.firework.pos.y, this.hu, false);
		      this.particles.push(p);
		    }
		  }

		  show() {
		    if (!this.exploded) {
		      this.firework.show();
		    }

		    for (var i = 0; i < this.particles.length; i++) {
		      this.particles[i].show();
		    }
		  }
		}
		
		p.setup = () => {
			p.createCanvas(
				containDiv?.current?.getBoundingClientRect().width,
				containDiv?.current?.getBoundingClientRect().height);
		  p.colorMode(p.HSB);
		  gravity = p.createVector(0, 0.2);
		  p.stroke(255);
		  p.strokeWeight(4);
		  //p.background(0);
		}

		p.draw = () => {
			p.colorMode(p.RGB);
		  //p.background(0, 0, 0, 25);
		  
		  if (p.random(1) < 0.04) {
		    fireworks.push(new Firework());
		  }
		  
		  for (let i = fireworks.length - 1; i >= 0; i--) {
		    fireworks[i].update();
		    fireworks[i].show();
		    
		    if (fireworks[i].done()) {
		      fireworks.splice(i, 1);
		    }
		  }
		}
	}

	return (
    <Box ref={containDiv} sx={{ width: '100%', height: '100%' }}>
        <div ref={p5Ref}>
        </div>
    </Box>
  );
}

export default FireWork;