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

type GameHeatTokenProps = {
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

const GameHeatToken : React.FunctionComponent<GameHeatTokenProps> = (props) => {
	const [step, setStep] = useState(0);
	const [tokens, setTokens] = useState(null);
	const [names, setNames] = useState([]);
	const [count, setCount] = useState(0);
	const needCollectionIn = Object.keys(nameTypeToken).filter((e: string) => nameTypeToken[e].profile === 'farmer' || (nameTypeToken[e].profile === 'cook' && e !== '001000'));
	const needCollectionNum = 1;// minimum 1 item match between props.collection & needCollectionIn
	const needCollectionNumMax = 1;// max 1 item 
	const limitTime = 20;

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
		if (step == 2) {
			timeout = setTimeout(() => {
				setCount(count + 1);
			}, 1000);
		}

		if (count == limitTime) {
			setWin();
			setCount(0);
			return () => true;
		}

		return () => clearTimeout(timeout);
	}, [count]);

	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout>;
		if (step == 0 && props.onLaunch)
			props.onLaunch(false);
		else if (step == 1)
			return () => true;
		else if (step == 2) {
			myP5Canvas = new p5(sketch, p5Ref.current);
			setCount(1);
		} else if (step == 3) {
			timeout = setTimeout(() => {
				setStep(0);
				if (props.onVictory) props.onVictory(props.type, names);
			}, 3500);
		}

		// like componentDidUnMount
		return () => clearTimeout(timeout);
	}, [step]);

	const setWin = () => {
		// Victory
		if (step == 2) {
			console.log('remove game');
			if (myP5Canvas)
				myP5Canvas.remove();
			setStep(3);
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

	const sketch = (p: any) => {
		let num = 2000;
		let range = 15;

		let ax: number[] = [];
		let ay: number[] = [];
		let width: number = 720;
		let height: number = 350;

		p.setup = () => {
			if (containDiv && containDiv.current) {
				width = containDiv?.current?.getBoundingClientRect().width;
			}
			p.createCanvas(width, 350);
			for ( let i = 0; i < num; i++ ) {
				ax[i] = width / 2;
				ay[i] = height / 2;
			}
			p.frameRate(30);
		}
		p.draw = () => {
			p.background(51);
			// Shift all elements 1 place to the left
			for ( let i = 1; i < num; i++ ) {
				ax[i - 1] = ax[i];
				ay[i - 1] = ay[i];
			}

			// Put a new value at the end of the array
			ax[num - 1] += p.random(-range, range);
			ay[num - 1] += p.random(-range, range);

			// Constrain all points to the screen
			ax[num - 1] = p.constrain(ax[num - 1], 0, width);
			ay[num - 1] = p.constrain(ay[num - 1], 0, height);

			// Draw a line connecting the points
			for ( let j = 1; j < num; j++ ) {
				let val = j / num * 204.0 + 51;
				p.stroke(val);
				p.line(ax[j - 1], ay[j - 1], ax[j], ay[j]);
			}
		}
	}

	return (
		<Box sx={{ width: '100%' }}>
			{step == 0 && 
				<Box onClick={handleLaunch}>
					<Typography variant="h2" sx={{ cursor: 'pointer' }}>Press to play <PlayCircleFilledWhiteIcon sx={{ ":hover": { color: randColorPlay[random(randColorPlay.length)] }, fontSize: '40px' }} /></Typography>
					{props.cost && <Typography variant="h6">Cost estimated {props.cost} XRP</Typography>}
					<Typography sx={{ ml: 1 }} variant="body1"><b>Baking Game</b> - Use patience to cook one ingredient.</Typography>
				</Box>}
			{step == 1 &&
				<Container>
					{<Button onClick={() => setStep(0)} sx={{ color:'black' }} startIcon={<ArrowBackIosIcon />}>Back</Button>}
					{(names && names.length > needCollectionNumMax) && <Typography variant="h4" sx={{ color: 'tomato' }}>You need less Tokens <span style={{ fontSize: '15px' }}>{names ? names.length : 0}/{needCollectionNum}</span></Typography>}
					{(!tokens || tokens.length < needCollectionNum) && <Typography variant="h4" sx={{ color: 'tomato' }}>You need more Tokens <span style={{ fontSize: '15px' }}>{tokens ? tokens.length : 0}/{needCollectionNum}</span></Typography>}
					{(!tokens || tokens.length < needCollectionNum) && <Typography variant="body1" sx={{ ml: 1 }}>Requirements: {needCollectionIn.map(e => capitalize(nameTypeToken[e].name.replace('_', ' '))).join(', ')}</Typography>}
					{tokens && tokens.length >= needCollectionNum && 
						<ChooseCollection
							collection={tokens}
							numToSelect={needCollectionNum}
							maxToSelect={needCollectionNumMax}
							onSelected={handleSelected}
						/>
					}
				</Container>}
			{step == 2 && <>
				<Box ref={containDiv} sx={{ position: 'relative', width: '100%' }}>
						<Box sx={{
								'position': 'absolute',
								'top': '5px',
								'marginLeft': '10px',
								'fontSize': '40px',
								'color': 'white',
						}}>{count} / {limitTime}</Box>
						<div ref={p5Ref}>
						</div>
				</Box>
				</>}
			{step == 3 && <>
					<Typography variant="h2" sx={{ cursor: 'pointer' }}>You Win!</Typography>
					<CircularProgress sx={{ display: 'block', margin: 'auto', color: "black" }} />
				</>}
		</Box>
	);
}

export default GameHeatToken;