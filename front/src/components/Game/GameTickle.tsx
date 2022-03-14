import React, { useState, useRef, useEffect } from 'react'
import p5 from 'p5';

import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

type objCollide = {
    x: number;
    y: number;
    width: number;
    height: number;
};

type GameTickleProps = {
    type?: string;
    cost?: string;
    onVictory?: Function;
    canPlay?: boolean;
    onLaunch?: Function;
};

const GameTickle : React.FunctionComponent<GameTickleProps> = (props) => {
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
        let message = 'tickle',
          x: number,
          y: number,
          xCircle: number,
          yCircle: number;

        p.setup = () => {
            let defaultWidth = 720;
            if (containDiv && containDiv.current)
                defaultWidth = containDiv?.current?.getBoundingClientRect().width;
            p.createCanvas(defaultWidth, 280);
            x = p.width / 2;
            y = p.height / 2;
            xCircle = Math.floor(Math.random() * p.width);
            yCircle = Math.floor(Math.random() * p.height);
        }

        p.draw = () => {
            p.background(204, 120);
            p.fill(0);
            
            p.text(message, x, y);
            p.textSize(65);
            
            p.circle(xCircle, yCircle, 50)
        }

        p.mousePressed = () => {
            x += x < p.mouseX ? p.random(1, 10) : p.random(-10, -1);
            y += y < p.mouseY ? p.random(1, 10) : p.random(-10, -1);

            if (isCollide(
                { x, y, width: 130, height: 30 },
                { x: xCircle, y: yCircle, width: 50, height: 50 })) {
                setWin();
            }
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
                    <Typography variant="body1">Click to move.</Typography>
                </Box>}
            {step == 1 &&
                <Box ref={containDiv} sx={{ width: '100%' }}>
                    <div ref={p5Ref}>
                    </div>
                </Box>}
            {step == 2 && <Box>
                <Typography variant="h2" sx={{ cursor: 'pointer' }}>You Win!</Typography>
                <CircularProgress sx={{ display: 'block', margin: 'auto', color: "white" }} />
            </Box>}
        </Box>
    )
}

export default GameTickle