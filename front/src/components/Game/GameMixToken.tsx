import React, { useState, useEffect, useRef } from 'react';
import ChooseCollection from './ChooseCollection';
import p5 from 'p5';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import {
	Uri
} from '@store/types/UriTypes';
import {
	nameTypeToken
} from '@utils/gameEngine';

import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
const randColorPlay = [ '#5e47ff', '#47c3ff', '#78ff47', '#ff9d47', '#ff4747', '#4d47ff', '#f947ff', '#ff4750' ];

type GameMixTokenProps = {
	cost?: string;
	type?: string;
	tokenName?: string;

	// used
	onVictory?: Function;
	canPlay?: boolean;
	onLaunch?: Function;
	collection?: Uri[];
};

const capitalize = (str: string) =>
	str.charAt(0).toUpperCase() + str.slice(1);
const random = (max: number) => Math.floor(Math.random() * max);
const shuffle = (a: number[]) => {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

const GameMixToken : React.FunctionComponent<GameMixTokenProps> = (props) => {
	const [step, setStep] = useState(0);
	const [tokens, setTokens] = useState(null);
	const [names, setNames] = useState([]);
	const needCollectionIn = Object.keys(nameTypeToken).filter((e: string) => nameTypeToken[e].profile === 'farmer');
	const needCollectionNum = 2;// minimum 2 items match between props.collection & needCollectionIn

	// p5
	const p5Ref = useRef();
	const containDiv = useRef<HTMLInputElement>(null);
	let myP5Canvas:any = null;

	useEffect(() => {
		console.log('should not');
		if (!tokens && props.collection) {
			setTokens(
				props.collection
				.filter((e: Uri) => needCollectionIn.indexOf(e.image.split('#')[0]) != -1)
			);
		}
	}, []);

	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout>;
		if (step == 0 && props.onLaunch)
			props.onLaunch(false);
		else if (step == 1)
			return () => true;
		else if (step == 2) { // gameStep
			myP5Canvas = new p5(sketch, p5Ref.current);
		} else if (step === 3) { // pre victory
			timeout = setTimeout(() => {
				if (myP5Canvas)
					myP5Canvas.remove();
				setStep(4);
			}, 2000);
		} else if (step === 4) { // victory
			timeout = setTimeout(() => {
				setStep(0);
				if (props.onVictory) props.onVictory(props.type, names);
			}, 1500);
		}

		// like componentDidUnMount
		return () => clearTimeout(timeout);
	}, [step]);

	const setWin = () => {
		if (step != 3) setStep(3);
	}

	const handleLaunch = () => {
		if (props.canPlay)
			setStep(1);
		if (props.onLaunch)
			props.onLaunch(true);
	};

	const handleSelected = (names: string[]) => {
		setNames(names);
		setStep(2);
	}


	// p5 - Inspiration: https://codepen.io/fpeyret/pen/MrdxxO
	const sketch = (p: any) => {
		// Source: https://codepen.io/fpeyret/pen/MrdxxO
		class Peon {
			x: number = null;
			y: number = null;
			nextX: number = null;
			nextY: number = null;
			caseX: number = null;
			caseY: number = null;
			direction: number = null;
			w: number = null;
			vel: number = null;
			etat: string = null;
			pixelParcouru: number = null;
			
			constructor() {
			  this.x = 0;
			  this.y = 0;
			  this.nextX = 0;
			  this.nextY = 0;
			  this.caseX = 0;
			  this.caseY = 0;
			  this.direction = 1;
			  this.w = 20;
			  this.vel = 2;
			  this.etat = "static";
			  this.pixelParcouru = 0;
			}

			update() {
				if (this.etat == "move") {
				  this.pixelParcouru += this.vel;
				  if (this.y > this.nextY) {
					// if (p.random(0, 5) > 2.5) this.createParticules();
					this.y = this.y - this.vel;
				  } else if (this.x < this.nextX) {
					// if (p.random(0, 5) > 2.5) this.createParticules();
					this.x = this.x + this.vel;
				  } else if (this.y < this.nextY) {
					// if (p.random(0, 5) > 2.5) this.createParticules();
					this.y = this.y + this.vel;
				  } else if (this.x > this.nextX) {
					// if (p.random(0, 5) > 2.5) this.createParticules();
					this.x = this.x - this.vel;
				  } else {
					this.etat = "static";
				  }
				}
			};

			display() {
				p.noStroke();
				p.fill(0, 196, 255);
				p.push();
				p.rectMode(p.CENTER);
				p.rect(this.x + caseTaille / 2, this.y + caseTaille / 2, this.w, this.w);
				p.rectMode(p.CORNER);
				p.pop();
				addPoint(this.x + caseTaille / 2, this.y + caseTaille / 2);
			};

			detection() {
				let infiniti = 800;
				// haut
				if (
				  p.mouseX > this.x + offset &&
				  p.mouseX < this.x + caseTaille + offset &&
				  p.mouseY < this.y + offset &&
				  p.mouseY > this.y - infiniti + offset
				) {
				  this.move(0);
				}
				// droite
				if (
				  p.mouseX > this.x + caseTaille + offset &&
				  p.mouseX < this.x + caseTaille + infiniti + offset &&
				  p.mouseY > this.y + offset &&
				  p.mouseY < this.y + caseTaille + offset
				) {
				  this.move(1);
				}
				// bas
				if (
				  p.mouseX > this.x + offset &&
				  p.mouseX < this.x + caseTaille + offset &&
				  p.mouseY > this.y + caseTaille + offset &&
				  p.mouseY < this.y + caseTaille + infiniti + offset
				) {
				  this.move(2);
				}
				// gauche
				if (
				  p.mouseX < this.x + offset &&
				  p.mouseX > this.x - infiniti + offset &&
				  p.mouseY > this.y + offset &&
				  p.mouseY < this.y + caseTaille + offset
				) {
				  this.move(3);
				}
			};

			move(direction: number) {
				this.direction = direction;
				if (this.detectWall() === 0) {
				  this.etat = "move";
				  switch (this.direction) {
					case 0:
					  this.caseY--;
					  this.nextY -= caseTaille;
					  break;
					case 1:
					  this.caseX++;
					  this.nextX += caseTaille;
					  break;
					case 2:
					  this.caseY++;
					  this.nextY += caseTaille;
					  break;
					case 3:
					  this.caseX--;
					  this.nextX -= caseTaille;
					  break;
				  }
				}
				if (this.caseX == labyrinthes[randomLabyrinth].victoryPosition[0] 
					&& this.caseY == labyrinthes[randomLabyrinth].victoryPosition[1]) {
				  this.grandSucces();
				}
			};

			detectWall() {
				const labyrinthe = labyrinthes[randomLabyrinth].labyrinthe;
				let destination = labyrinthe[this.caseY][this.caseX];
				switch (this.direction) {
				  case 0:
					if (typeof labyrinthe[this.caseY - 1] === "undefined") return false;
					break;
				  case 1:
					if (typeof labyrinthe[this.caseY][this.caseX + 1] === "undefined")
					  return false;
					break;
				  case 2:
					if (typeof labyrinthe[this.caseY + 1] === "undefined") return false;
					break;
				  case 3:
					if (typeof labyrinthe[this.caseY][this.caseX - 1] === "undefined")
					  return false;
					break;
				}
				return correspondance[destination][this.direction];
			};

			createParticules() {
				let particuleX = this.x + caseTaille / 2 + p.random(-10, 10);
				let particuleY = this.y + caseTaille / 2 + p.random(-10, 10);
				particules.push(new Particule(particuleX, particuleY, this.direction));
			};

			grandSucces() {
				setWin();
			};
		}

		class Particule {
			x: number;
			y: number;
			direction: number;
			vel: number;
			life: number;
			size: number;

			constructor(
				x: number,
				y: number,
				direction: number,
			) {
			  this.x = x;
			  this.y = y;
			  this.vel = 0.1;
			  this.life = p.random(0.2, 0.6); // si grand alors vie moins longtemps
			  this.size = p.random(6, 12);
			}

			display() {
				p.fill(255, 255, 255, 100);
				p.noStroke();
				p.rectMode(p.CENTER);
				p.ellipse(this.x, this.y, this.size);
			};

			update() {
				this.size -= this.life;

				switch (this.direction) {
				  case 0:
					this.y += this.vel;
					break;
				  case 1:
					this.x -= this.vel;
					break;
				  case 2:
					this.y -= this.vel;
					break;
				  case 3:
					this.x += this.vel;
					break;
				}
			};
			delete() {};
		}

		class Point {
			x: number;
			y: number;
			life: number;

			constructor(
				x: number,
				y: number,
			) {
			  this.x = x;
			  this.y = y;
			  this.life = 150;
			}

		  display() {
			p.noFill();
			p.stroke(0, 196, 255,this.life);
			p.strokeWeight(3);
			// totest
			p.point(this.x,this.y);
		  }

		  update() {
			this.life = this.life - 1;
		  }
		}

		function addPoint(x: number, y: number) {
		  points.push(new Point(x,y));
		}

		let caseTaille = 50;
		let offset = 40;
		let bob = new Peon();
		let step = 1;
		const labyrinthes = [
			{
				// Easy1
				victoryPosition: [ 9, 4 ], //x-y,
				labyrinthe: [
				  ["k", "f", "b", "f", "f", "f", "b", "f", "f", "o"],
				  ["e", "h", "g", "m", "b", "h", "g", "m", "f", "h"],
				  ["l", "g", "j", "f", "i", "g", "g", "k", "f", "i"],
				  ["n", "j", "f", "h", "k", "d", "a", "a", "f", "c"],
				  ["j", "f", "f", "f", "f", "i", "j", "d", "o", "l"],
				],
			},
			{
				// Middle1
				victoryPosition: [ 9, 0 ], //x-y,
				labyrinthe: [
				  ["k", "f", "b", "f", "b", "f", "k", "b", "f", "o"],
				  ["e", "h", "g", "m", "b", "h", "g", "j", "f", "h"],
				  ["l", "g", "j", "f", "i", "g", "l", "k", "f", "i"],
				  ["n", "j", "f", "h", "k", "d", "a", "a", "f", "c"],
				  ["j", "f", "f", "f", "f", "i", "j", "d", "o", "l"],
				],
			},
			{
				// Hard1
				victoryPosition: [ 0, 4 ], //x-y,
				labyrinthe: [
				  ["k", "f", "b", "f", "b", "f", "k", "b", "f", "o"],
				  ["e", "h", "g", "m", "b", "h", "g", "j", "f", "h"],
				  ["l", "g", "j", "f", "i", "g", "g", "k", "f", "i"],
				  ["n", "j", "f", "f", "f", "d", "i", "a", "f", "c"],
				  ["j", "f", "f", "f", "f", "f", "f", "d", "o", "l"],
				],
			},
		];
		let randomLabyrinth = random(3);
		randomLabyrinth = randomLabyrinth >= labyrinthes.length ? labyrinthes.length - 1 : randomLabyrinth;

		let correspondance: {[key: string]: number[]} = {
		  a: [0, 0, 0, 0],// top right bottom left
		  b: [1, 0, 0, 0],
		  c: [0, 1, 0, 0],
		  d: [0, 0, 1, 0],
		  e: [0, 0, 0, 1],
		  f: [1, 0, 1, 0],
		  g: [0, 1, 0, 1],
		  h: [1, 1, 0, 0],
		  i: [0, 1, 1, 0],
		  j: [0, 0, 1, 1],
		  k: [1, 0, 0, 1],
		  l: [0, 1, 1, 1],
		  m: [1, 0, 1, 1],
		  n: [1, 1, 0, 1],
		  o: [1, 1, 1, 0]
		};
		let points: any = [];
		let particules: any = [];

		p.setup = () => {
			let defaultWidth = 720;
			let defaultHeight = 350;
			if (containDiv && containDiv.current)
				defaultWidth = containDiv?.current?.getBoundingClientRect().width;
			p.createCanvas(defaultWidth, defaultHeight);
		}

		p.draw = () => {
		  p.textFont("Open Sans");
		  p.background(25);
		  // labyrinthe et peon a afficher
		  if (bob.etat == "static") {
			bob.detection();
		  }
		  p.translate(offset, offset);

		  labyrintheDisplay();

		  /*for (let p = 0; p < particules.length; p++) {
				particules[p].update();
				particules[p].display();
				if (particules[p].size < 0.25) {
				  particules.splice(particules[p], 1);
				}
		  }*/

		  for (let i = 0; i < points.length; i ++) {
			points[i].update();
			points[i].display();
			if (points[i].life <= 0) {
			  points.splice(points[i], 1);
			}
		  }
		  bob.update();
		  bob.display();
		}

		function labyrintheDisplay() {
			const labyrinthe = labyrinthes[randomLabyrinth].labyrinthe;
			const victory = labyrinthes[randomLabyrinth].victoryPosition;
			for (let y = 0; y < labyrinthe.length; y++) {
				for (let x = 0; x < labyrinthe[y].length; x++) {
				  p.stroke(255);
				  p.noFill();
				  drawLineNew(labyrinthe[y][x], x, y);
				  if (y == victory[1] && x == victory[0]) {
					p.fill(255, 255, 255);
					p.rectMode(p.CORNER);
					p.rect(
					  caseTaille * x + 10,
					  caseTaille * y + 10,
					  caseTaille - 20,
					  caseTaille - 20
					);
				  }
				}
			}
		}

		function drawLineNew(type: string, x:number, y: number) {
		  p.strokeWeight(1);
		  p.stroke(255, 255, 255, 20);
		  // haut
		  if (
			type == "b" ||
			type == "f" ||
			type == "h" ||
			type == "k" ||
			type == "m" ||
			type == "n" ||
			type == "o"
		  ) {
			p.strokeWeight(2);
			p.stroke(255, 255, 255, 255);
		  }
		  p.line(
			x * caseTaille,
			y * caseTaille,
			x * caseTaille + caseTaille,
			y * caseTaille
		  );
		  p.strokeWeight(1);
		  p.stroke(255, 255, 255, 20);

		  // droite
		  if (
			type == "c" ||
			type == "g" ||
			type == "h" ||
			type == "i" ||
			type == "l" ||
			type == "n" ||
			type == "o"
		  ) {
			p.strokeWeight(2);
			p.stroke(255, 255, 255, 255);
		  }
		  p.line(
			x * caseTaille + caseTaille,
			y * caseTaille,
			x * caseTaille + caseTaille,
			y * caseTaille + caseTaille
		  );

		  p.strokeWeight(1);
		  p.stroke(255, 255, 255, 20);

		  // bas
		  if (
			type == "d" ||
			type == "f" ||
			type == "i" ||
			type == "j" ||
			type == "l" ||
			type == "m" ||
			type == "o"
		  ) {
			p.strokeWeight(2);
			p.stroke(255, 255, 255, 255);
		  }
		  p.line(
			x * caseTaille + caseTaille,
			y * caseTaille + caseTaille,
			x * caseTaille,
			y * caseTaille + caseTaille
		  );

		  p.strokeWeight(1);
		  p.stroke(255, 255, 255, 20);

		  // gauche
		  if (
			type == "e" ||
			type == "g" ||
			type == "j" ||
			type == "k" ||
			type == "l" ||
			type == "m" ||
			type == "n"
		  ) {
			p.strokeWeight(2);
			p.stroke(255, 255, 255, 255);
		  }
		  p.line(
			x * caseTaille,
			y * caseTaille,
			x * caseTaille,
			y * caseTaille + caseTaille
		  );

		  p.strokeWeight(1);
		  p.stroke(255, 255, 255, 20);
		}
	}

	return (
		<Box sx={{ width: '100%' }}>
			{step == 0 && 
				<Box onClick={handleLaunch}>
					<Typography variant="h2" sx={{ cursor: 'pointer' }}>Press to play <PlayCircleFilledWhiteIcon sx={{ ":hover": { color: randColorPlay[random(randColorPlay.length)] }, fontSize: '40px' }} /></Typography>
					{props.cost && <Typography variant="h6">Cost estimated {props.cost} XRP</Typography>}
					<Typography sx={{ ml: 1 }} variant="body1"><b>Mix Game</b> - Play to mix ingredients, but you should follow a recipe.</Typography>
				</Box>}
			{step == 1 &&
				<Container>
					{<Button onClick={() => setStep(0)} sx={{ color:'black' }} startIcon={<ArrowBackIosIcon />}>Back</Button>}
					{(!tokens || tokens.length < needCollectionNum) && <Typography variant="h4" sx={{ color: 'tomato' }}>You need more Tokens <span style={{ fontSize: '15px' }}>{tokens ? tokens.length : 0}/{needCollectionNum}</span></Typography>}
					{(!tokens || tokens.length < needCollectionNum) && <Typography variant="body1" sx={{ ml: 1 }}>Requirements: {needCollectionIn.map(e => capitalize(nameTypeToken[e].name.replace('_', ' '))).join(', ')}</Typography>}
					{tokens && tokens.length >= needCollectionNum && 
						<ChooseCollection
							collection={tokens}
							numToSelect={needCollectionNum}
							onSelected={handleSelected}
						/>
					}
				</Container>}
			{(step == 2 || step == 3) && <>
					<Box ref={containDiv} sx={{ width: '100%' }}>
						<div ref={p5Ref}>
						</div>
					</Box>
				</>}
			{step == 4 && <>
					<Typography variant="h2" sx={{ cursor: 'pointer' }}>You Win!</Typography>
					<CircularProgress sx={{ display: 'block', margin: 'auto', color: "black" }} />
				</>}
		</Box>
	);
}

export default GameMixToken;