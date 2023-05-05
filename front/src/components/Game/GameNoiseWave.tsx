import React, { useState, useRef, useEffect } from 'react'
import p5 from 'p5';

import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
const randColorPlay = [ '#5e47ff', '#47c3ff', '#78ff47', '#ff9d47', '#ff4747', '#4d47ff', '#f947ff', '#ff4750' ];
const random = (max: number) => Math.floor(Math.random() * max);

type objCollide = {
    x: number;
    y: number;
    width: number;
    height: number;
};

type GameNoiseWaveProps = {
    type?: string;
    cost?: string;
    onVictory?: Function;
    canPlay?: boolean;
    onLaunch?: Function;
    tokenName?: string;
};

const GameNoiseWave: React.FunctionComponent<GameNoiseWaveProps> = (props) => {
    const limitTime = 20;
    const [count, setCount] = useState(0);
    const [step, setStep] = useState(0);
    
    const p5Ref = useRef();
    const containDiv = useRef<HTMLInputElement>(null);
    let myP5Canvas:any = null;

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        if (step == 1) {
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
        if (step == 1 && !myP5Canvas) {
            myP5Canvas = new p5(sketch, p5Ref.current);
            setCount(1);
        }
        if (step != 2) return () => true;

        // reset
        let timeout: ReturnType<typeof setTimeout>;
        timeout = setTimeout(() => {
          setStep(0);
        }, 5000);

        return () => clearTimeout(timeout);
    }, [step]);

    const setWin = () => {
        // Victory
        if (step == 1) {
            if (myP5Canvas)
                myP5Canvas.remove();
            setStep(2);
            setTimeout(() => {
                if (props.onVictory) props.onVictory(props.type);
            }, 3000);
        }
    }

    const sketch = (p: any) => {
        let yoff = 0.0;

        p.setup = () => {
            let defaultWidth = 720;
            if (containDiv && containDiv.current)
                defaultWidth = containDiv?.current?.getBoundingClientRect().width;
            p.createCanvas(defaultWidth, 350);
        }

        p.draw = () => {
            p.background(51);

            p.fill(255);
            // We are going to draw a polygon out of the wave points
            p.beginShape();

            let xoff = 0; // Option #1: 2D Noise
            // let xoff = yoff; // Option #2: 1D Noise

            // Iterate over horizontal pixels
            for (let x = 0; x <= p.width; x += 10) {
            // Calculate a y value according to noise, map to

            // Option #1: 2D Noise
            let y = p.map(p.noise(xoff, yoff), 0, 1, 200, 300);

            // Option #2: 1D Noise
            // let y = map(noise(xoff), 0, 1, 200,300);

            // Set the vertex
            p.vertex(x, y);
            // Increment x dimension for noise
            xoff += 0.05;
            }
            // increment y dimension for noise
            yoff += 0.01;
            p.vertex(p.width, p.height);
            p.vertex(0, p.height);
            p.endShape(p.CLOSE);
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
                    <Typography variant="body1"><b>Contemplative Game</b> - Use patience to win{props.tokenName ? ' a ' + props.tokenName : ''}.</Typography>
                </Box>}
            {step == 1 &&
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
                </Box>}
            {step == 2 && <Box>
                <Typography variant="h2" sx={{ cursor: 'pointer' }}>You Win!</Typography>
                <CircularProgress sx={{ display: 'block', margin: 'auto', color: "black" }} />
            </Box>}    
        </Box>
    )
}

export default GameNoiseWave;