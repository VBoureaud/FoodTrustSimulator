import React, { useRef, useState, useEffect } from 'react';
import ChooseUser from './ChooseUser';
import p5 from 'p5';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import TextField from "@mui/material/TextField";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import {
	User,
} from '@store/types/UserTypes';

import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
const randColorPlay = [ '#5e47ff', '#47c3ff', '#78ff47', '#ff9d47', '#ff4747', '#4d47ff', '#f947ff', '#ff4750' ];

type GameAdTokenProps = {
	cost?: string;
	type?: string;

	// used
	onVictory?: Function;
	onLose?: Function;
	canPlay?: boolean;
	onLaunch?: Function;
	users?: User[];
};
type ObjCollide = {
    x: number;
    y: number;
    width: number;
    height: number;
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
const isCollide = (a:ObjCollide, b:ObjCollide) => {
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}


const GameAdToken : React.FunctionComponent<GameAdTokenProps> = (props) => {
	const [step, setStep] = useState(0);
	const [tokens, setTokens] = useState(null);
	const [names, setNames] = useState([]);
	const [message, setMessage] = useState('');
	const [warning, setWarning] = useState(false);
	const needCollectionNum = 1;
	const limitMessageSize = 80;
	const snakeNeed = 5;

	// p5
	const p5Ref = useRef();
	const containDiv = useRef<HTMLInputElement>(null);
	let myP5Canvas:any = null;

	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout>;
		if (step == 0 && props.onLaunch)
			props.onLaunch(false);
		else if (step == 1)
			return () => true;
		else if (step == 3) {
			myP5Canvas = new p5(sketch, p5Ref.current);
		} else if (step == 4) {
			timeout = setTimeout(() => {
				setStep(0);
				if (props.onVictory) props.onVictory(
					props.type, {
						message,
						user: names,
					});
			}, 1500);
		} else if (step == 5) {
			timeout = setTimeout(() => {
				setStep(0);
				if (props.onLose) props.onLose();
			}, 3500);
		}

		// like componentDidUnMount
		return () => clearTimeout(timeout);
	}, [step]);

	const setWin = () => {
		if (myP5Canvas)
					myP5Canvas.remove();
		if (step != 4) setStep(4);
	}

	const setLose = () => {
		if (myP5Canvas)
					myP5Canvas.remove();
		if (step != 5) setStep(5);
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

	const handleMessage = () => {
		setWarning(false);
		if (!message || message.length > limitMessageSize)
			setWarning(true);
		else
			setStep(3);
	}

	const findRandom = (playerCenter: number[], width: number, height: number, size: number) => {
		let newX = random(width);
		let newY = random(height);
		const offset = 50;

		if (Math.abs(playerCenter[0] - newX) <= offset + size)
			newX = width - playerCenter[0];
		if (Math.abs(playerCenter[1] - newY) <= offset + size)
			newY = height - playerCenter[1];
		return [ newX < 0 ? 0 : newX, newY < 0 ? 0 : newY ];
	}

	const sketch = (p: any) => {
		let x:number[] = [],
	  y:number[] = [],
	  segNum = 20,
	  segLength = 18;
	  let winCircle: number[] = [];
	  let drawTime = 0;
	  let eatTime = 0;

	  for (let i = 0; i < segNum; i++) {
		  x[i] = 0;
		  y[i] = 0;
		}

		let width: number = 720;
		let height: number = 350;

		p.setup = () => {
			if (containDiv && containDiv.current) {
				width = containDiv?.current?.getBoundingClientRect().width;
			}
			p.createCanvas(width, height);
		  p.strokeWeight(9);
		  p.stroke(255, 100);

		  winCircle = findRandom([p.mouseX, p.mouseY], width, height, 9);
		}
	
		p.draw = () => {
			drawTime++;
			p.background(0);
			// draw mouse

			dragSegment(0, drawTime < 100 ? width / 2 : p.mouseX, drawTime < 100 ? height / 2 : p.mouseY);
			// draw points
			for (let i = 0; i < x.length - 1; i++) {
			  dragSegment(i + 1, x[i], y[i]);
			  if (isCollide(
	          { x: p.mouseX, y: p.mouseY, width: 9, height: 9 },
	          { x: x[i], y: y[i], width: 9, height: 9 })) {
	          setLose();
	      }
			}

			p.circle(winCircle[0], winCircle[1], 9);

			if (isCollide(
          { x: p.mouseX, y: p.mouseY, width: 9, height: 9 },
          { x: winCircle[0], y: winCircle[1], width: 9, height: 9 })) {
          if (eatTime < snakeNeed) {
          	eatTime++;
          	for (let i = 0; i < 5; i++) {
	          	x.push(0);
	          	y.push(0);
          	}
          	winCircle = findRandom([p.mouseX, p.mouseY], width, height, 9);
          } else {
          	setWin();
          }
      }
		}

		function dragSegment(i: number, xin: number, yin: number) {
		  const dx = xin - x[i];
		  const dy = yin - y[i];
		  const angle = p.atan2(dy, dx);
		  x[i] = xin - p.cos(angle) * segLength;
		  y[i] = yin - p.sin(angle) * segLength;
		  segment(x[i], y[i], angle);
		}

		function segment(x: number, y: number, a: number) {
		  p.push();
		  p.translate(x, y);
		  p.rotate(a);
		  p.line(0, 0, segLength, 0);
		  p.pop();
		}


	}

	return (
		<Box sx={{ width: '100%' }}>
			{step == 0 && 
				<Box onClick={handleLaunch}>
					<Typography variant="h2" sx={{ cursor: 'pointer' }}>Press to play <PlayCircleFilledWhiteIcon sx={{ ":hover": { color: randColorPlay[random(randColorPlay.length)] }, fontSize: '40px' }} /></Typography>
					{props.cost && <Typography variant="h6">Cost estimated {props.cost} XRP</Typography>}
					<Typography sx={{ ml: 1 }} variant="body1"><b>Ad Game</b> - Play to send an ad to an user.</Typography>
				</Box>}
			{step == 1 &&
				<Container>
					{<Button onClick={() => setStep(0)} sx={{ color:'black' }} startIcon={<ArrowBackIosIcon />}>Back</Button>}
					{props.users.length >= needCollectionNum && 
						<ChooseUser
							users={props.users}
							numToSelect={needCollectionNum}
							onSelected={handleSelected}
						/>
					}
				</Container>}
			{step == 2 &&
				<Container>
					{<Button onClick={() => setStep(0)} sx={{ color:'black' }} startIcon={<ArrowBackIosIcon />}>Back</Button>}
					<Typography sx={{ ml: 1, mb: 2, mr: 1, display: 'flex', justifyContent: 'space-between' }} variant="h5">
						<span>Write a message</span><span>{message.length}/{limitMessageSize}</span>
					</Typography>
					{warning && <Box sx={{ background: 'tomato', padding: '5px', borderRadius: '8px', textAlign: 'center', mb: 1, mt: 1 }}>
						<Typography sx={{ color: 'white' }}>Text size should be between 0 and {limitMessageSize}.</Typography>
					</Box>}
					<TextField
						autoFocus
						margin="dense"
						id="message"
						label="Message"
						placeholder="Message"
						type="text"
						fullWidth
						multiline
						sx={{ 
							mb: 1,
							background: '#F4F4F4',
							borderRadius: '4px',
							textarea: { color: 'black' } }}
						variant="outlined"
						onChange={(e: { target: { value: string; }; }) => setMessage(e.target.value)}
					/>
					<Button
						onClick={handleMessage}
						sx={{
							background: '#538af2',
							color: 'white',
							borderRadius: '8px',
							mt: 1,
							width: '100%',
						}}>
						<ArrowForwardIosIcon />
					</Button>
				</Container>}
			{step == 3 && <>
				<Box ref={containDiv} sx={{ position: 'relative', width: '100%' }}>
					<div ref={p5Ref}>
					</div>
				</Box>
			</>}
			{step == 4 && <>
					<Typography variant="h2" sx={{ cursor: 'pointer' }}>You Win!</Typography>
					<CircularProgress sx={{ display: 'block', margin: 'auto', color: "black" }} />
				</>}
			{step == 5 && <>
					<Typography variant="h4" sx={{ cursor: 'pointer' }}>You lost, careful to don't eat the snake itself.</Typography>
					<CircularProgress sx={{ display: 'block', margin: 'auto', color: "black" }} />
				</>}
		</Box>
	);
}

export default GameAdToken;