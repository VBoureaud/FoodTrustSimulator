import React, { useState, useEffect } from 'react';

import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
const randColorPlay = [ '#5e47ff', '#47c3ff', '#78ff47', '#ff9d47', '#ff4747', '#4d47ff', '#f947ff', '#ff4750' ];

type GameSubstractionProps = {
	onVictory?: Function;
	cost?: string;
	type?: string;
	canPlay?: boolean;
	onLaunch?: Function;
	tokenName?: string;
};

const random = (max: number) => Math.floor(Math.random() * max);
const shuffle = (a: number[]) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const GameSubstraction : React.FunctionComponent<GameSubstractionProps> = (props) => {
	const [num1, setNum1] = useState(random(42));
	const [num2, setNum2] = useState(random(42));
	const [choice, setChoice] = useState(0);
	const [step, setStep] = useState(0);

	useEffect(() => {
		stepManagor();
	})

	useEffect(() => {
		if (step != 2) return () => true;
		let timeout: ReturnType<typeof setTimeout>;
		timeout = setTimeout(() => {
			/*setStep(0);
			setChoice(0);
			setNum1(random(42));
			setNum2(random(42));*/
			if (props.onVictory) props.onVictory(props.type);
	    }, 3500);

		// like componentDidUnMount
	    return () => clearTimeout(timeout);
	}, [step]);

	const stepManagor = () => {
		// Victory
		if (step == 1 && choice == num1 - num2) {
			setStep(2);
		}
	}

	const handleLaunch = () => {
		if (props.canPlay)
			setStep(1);
		if (props.onLaunch)
			props.onLaunch(true);
	};

	return (
		<Box sx={{ width: '100%' }}>
			{step == 0 && 
				<Box onClick={handleLaunch}>
					<Typography variant="h2" sx={{ cursor: 'pointer' }}>Press to play <PlayCircleFilledWhiteIcon sx={{ ":hover": { color: randColorPlay[random(randColorPlay.length)] }, fontSize: '40px' }} /></Typography>
					{props.cost && <Typography variant="h6">Cost estimated {props.cost} XRP</Typography>}
					<Typography variant="body1"><b>Substraction Game</b> - Find the right answer to win{props.tokenName ? ' a ' + props.tokenName : ''}.</Typography>
				</Box>}
			{step == 1 &&
				<Box>
					<Typography variant="h4" sx={{ textAlign: 'center', mb: 3, mt: 2 }}>What is the answer ?</Typography>
					<Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
						<Typography variant="h2">{num1}</Typography>
						<Typography sx={{ ml: 2, mr: 2 }} variant="h4">-</Typography>
						<Typography variant="h2">{num2}</Typography>
					</Box>
					<Divider sx={{ m: 2 }}/>
					<Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
						{shuffle([num1 - num2 + random(40), num1 - num2 - random(4), num1 - num2 + random(2), num1 - num2 - random(5), num1 - num2]).map((num, key) => 
							<Box 
								onClick={() => setChoice(num)}
								sx={{
									border: '1px solid #5d5d5d', 
									borderRadius: '20px', 
									cursor: 'pointer',
									background: '#25231d',
									color: 'white',
									m: 1 }}
								key={key}>
								<Typography sx={{ p: 2 }} variant="h3">{num}</Typography>
							</Box>
						)}
					</Box>
				</Box>}
			{step == 2 && <>
				<Typography variant="h2" sx={{ cursor: 'pointer' }}>You Win!</Typography>
				<CircularProgress sx={{ display: 'block', margin: 'auto', color: "black" }} />
			</>}
		</Box>
	);
}

export default GameSubstraction;