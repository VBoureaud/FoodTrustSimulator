import React, { useState, useEffect } from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

type GameAdditionProps = {
	onVictory?: Function;
	cost?: string;
	type?: string;
	canPlay?: boolean;
	onLaunch?: Function;
};

const random = (max: number) => Math.floor(Math.random() * max);
const shuffle = (a: number[]) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const GameAddition : React.FunctionComponent<GameAdditionProps> = (props) => {
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
	      setStep(0);
		  setChoice(0);
		  setNum1(random(42));
		  setNum2(random(42));
	    }, 5000);

		// like componentDidUnMount
	    return () => clearTimeout(timeout);
	}, [step]);

	const stepManagor = () => {
		// Victory
		if (step == 1 && choice == num1 + num2) {
			setStep(2);
			if (props.onVictory) props.onVictory(props.type);
		}
	}

	const handleLaunch = () => {
		if (props.canPlay)
			setStep(1);
		if (props.onLaunch)
			props.onLaunch();
	};

	return (
		<Box sx={{ width: '100%' }}>
			{step == 0 && 
				<Box onClick={handleLaunch}>
					<Typography variant="h2" sx={{ cursor: 'pointer' }}>Press to play</Typography>
					{props.cost && <Typography variant="h6">Cost estimated {props.cost} XRP</Typography>}
					<Typography variant="body1">Addition Game</Typography>
				</Box>}
			{step == 1 &&
				<Box>
					<Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
						<Typography variant="h2">{num1}</Typography>
						<Typography sx={{ ml: 2, mr: 2 }} variant="h4">+</Typography>
						<Typography variant="h2">{num2}</Typography>
					</Box>
					<Divider sx={{ m: 2 }}/>
					<Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
						{shuffle([random(42), random(42), random(42), random(42), num1 + num2]).map((num, key) => 
							<Box 
								onClick={() => setChoice(num)}
								sx={{
									border: '1px solid #5d5d5d', 
									borderRadius: '20px', 
									cursor: 'pointer',
									background: '#505050',
									m: 1 }}
								key={key}>
								<Typography sx={{ p: 2 }} variant="h3">{num}</Typography>
							</Box>
						)}
					</Box>
				</Box>}
			{step == 2 && <Typography variant="h2" sx={{ cursor: 'pointer' }}>You Win!</Typography>}
		</Box>
	);
}

export default GameAddition;