import React, { useRef, useState, useEffect } from 'react';
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

type GameBoxTokenProps = {
	cost?: string;
	type?: string;
	tokenName?: string;

	// used
	onVictory?: Function;
	onLose?: Function;
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

const GameBoxToken : React.FunctionComponent<GameBoxTokenProps> = (props) => {
	const [step, setStep] = useState(0);
	const [tokens, setTokens] = useState(null);
	const [names, setNames] = useState([]);
	const needCollectionIn = Object.keys(nameTypeToken).filter((e: string) => nameTypeToken[e].profile === 'farmer' || (nameTypeToken[e].profile === 'cook' && e !== '001000'));
	const needCollectionNum = 2;// minimum 2 items match between props.collection & needCollectionIn
	const needToWin = 10;

	// p5
	const p5Ref = useRef();
	const containDiv = useRef<HTMLInputElement>(null);
	let myP5Canvas:any = null;

	useEffect(() => {
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
		else if (step == 2) { // game
			myP5Canvas = new p5(sketch, p5Ref.current);
		}
		else if (step == 3) {
			timeout = setTimeout(() => {
				setStep(0);
				if (props.onVictory) props.onVictory(props.type, names);
		    }, 3500);
		}
		else if (step == 4) { // lose
			timeout = setTimeout(() => {
				setStep(0);
				if (props.onLose) props.onLose();
			}, 3500);
		}

		// like componentDidUnMount
	    return () => clearTimeout(timeout);
	}, [step]);

	const setWin = () => {
		if (step == 2) {
			if (myP5Canvas) {
				myP5Canvas.remove();
			}
			setStep(3);
		}
	}

	const setLose = () => {
		if (step == 2) {
			if (myP5Canvas) myP5Canvas.remove();
			setStep(4);
		}
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

	// source: https://codepen.io/Louis_js/pen/WNOQLmG
	const sketch = (p: any) => {
		let x = 300;
		let y = 0;
		let width: number = 720;
		let height: number = 350;
		let score = 0;
		let speed = 2;
		let sizeBox = 50;

		p.setup = () => {
			if (containDiv && containDiv.current) {
				width = containDiv?.current?.getBoundingClientRect().width;
			}
			p.createCanvas(width, 350);
		};

		p.draw = () => {
			p.background(0);
			p.rectMode(p.CENTER);
			p.fill(255);
			p.rect(p.mouseX, p.height - 20, sizeBox, sizeBox);  

			//score text
			p.fill(255);
			p.noStroke();
			p.textStyle(p.NORMAL);
			p.text("Score: " + score, 50, 20);

			//change the y value
			y += speed;

			//circle 
			p.fill(255);
			p.stroke(255);
			p.strokeWeight(5);
			p.circle(x, y,25);

			//screen to display when the ball goes out of the canvas
			if (y > height) {
				setLose();
			}
			//Area for the ball to collide and reverse direction
			if (y > height - 30 && x > p.mouseX - sizeBox && x < p.mouseX + sizeBox) {
				y = 0;
				score++;
				speed += 0.5;
				x = p.random(width);
			}

			if (score >= needToWin)
				setWin();
		};
	}

	return (
		<Box sx={{ width: '100%' }}>
			{step == 0 && 
				<Box onClick={handleLaunch}>
					<Typography variant="h2" sx={{ cursor: 'pointer' }}>Press to play <PlayCircleFilledWhiteIcon sx={{ ":hover": { color: randColorPlay[random(randColorPlay.length)] }, fontSize: '40px' }} /></Typography>
					{props.cost && <Typography variant="h6">Cost estimated {props.cost} XRP</Typography>}
					<Typography sx={{ ml: 1 }} variant="body1"><b>Game Box</b> - Play to build a box full of ingredients of your choice.</Typography>
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
			{step == 2 && <>
				<Box ref={containDiv} sx={{ position: 'relative', width: '100%' }}>
					<div ref={p5Ref}>
					</div>
				</Box>
			</>}
			{step == 3 && <>
					<Typography variant="h2" sx={{ cursor: 'pointer' }}>You Win!</Typography>
                	<CircularProgress sx={{ display: 'block', margin: 'auto', color: "black" }} />
				</>}
			{step == 4 && <>
					<Typography variant="h4" sx={{ cursor: 'pointer' }}>You lost, but you can try again.</Typography>
					<CircularProgress sx={{ display: 'block', margin: 'auto', color: "black" }} />
				</>}
		</Box>
	);
}

export default GameBoxToken;