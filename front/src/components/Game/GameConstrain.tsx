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

type GameConstrainProps = {
    type?: string;
    cost?: string;
    onVictory?: Function;
    canPlay?: boolean;
    onLaunch?: Function;
    tokenName?: string;
};

const GameConstrain: React.FunctionComponent<GameConstrainProps> = (props) => {
    const [step, setStep] = useState(0);
    const p5Ref = useRef();
    const containDiv = useRef<HTMLInputElement>(null);
    let myP5Canvas:any = null;

    const isCollide = (a:objCollide, b:objCollide) => {
        return !(
            ((a.y + a.height) < (b.y)) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))
        );
    }

    useEffect(() => {
        if (step == 1 && !myP5Canvas)
            myP5Canvas = new p5(sketch, p5Ref.current);
        if (step != 2) return () => true;

        // reset
        let timeout: ReturnType<typeof setTimeout>;
        timeout = setTimeout(() => {
          setStep(0);
        }, 5000);

        // like componentDidUnMount
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
        let mx = 1;
        let my = 1;
        let easing = 0.05;
        let radius = 24;
        let edge = 100;
        let inner = edge + radius;
        let xCircle: number, yCircle: number;

        p.setup = () => {
            let defaultWidth = 720;
            if (containDiv && containDiv.current)
                defaultWidth = containDiv?.current?.getBoundingClientRect().width;
            p.createCanvas(defaultWidth, 350);
            p.noStroke();
            p.ellipseMode(p.RADIUS);
            p.rectMode(p.CORNERS);

            xCircle = Math.floor(Math.random() * p.width);
            yCircle = Math.floor(Math.random() * p.height);
        }

        p.draw = () => {
            p.background(230);

            if (p.abs(p.mouseX - mx) > 0.1) {
                mx = mx + (p.mouseX - mx) * easing;
            }
            if (p.abs(p.mouseY - my) > 0.1) {
                my = my + (p.mouseY - my) * easing;
            }

            mx = p.constrain(mx, inner, p.width - inner);
            my = p.constrain(my, inner, p.height - inner);
            p.fill(237, 34, 93);
            p.rect(edge, edge, p.width - edge, p.height - edge);
            p.fill(255);
            p.ellipse(mx, my, radius, radius);

            p.fill(207, 34, 93);
            p.ellipse(xCircle, yCircle, radius, radius);
            p.fill(255);
        }

        p.mousePressed = () => {
            if (isCollide(
                { x: mx, y: my, width: radius, height: radius },
                { x: xCircle, y: yCircle, width: radius, height: radius })) {
                setWin();
            } else {
                xCircle = Math.floor(Math.random() * p.width);
                yCircle = Math.floor(Math.random() * p.height);
            }
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
                    <Typography variant="body1"><b>Constrain Game</b> - Find a way to exit to win{props.tokenName ? ' a ' + props.tokenName : ''}.</Typography>
                </Box>}
            {step == 1 &&
                <Box ref={containDiv} sx={{ width: '100%' }}>
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

export default GameConstrain;