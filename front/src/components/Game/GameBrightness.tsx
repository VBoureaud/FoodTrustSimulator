import React, { useState, useRef, useEffect } from 'react'
import p5 from 'p5';

import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import background from "./assets/images/backgroundSmall.jpg";
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
const randColorPlay = [ '#5e47ff', '#47c3ff', '#78ff47', '#ff9d47', '#ff4747', '#4d47ff', '#f947ff', '#ff4750' ];
const random = (max: number) => Math.floor(Math.random() * max);


type objCollide = {
    x: number;
    y: number;
    width: number;
    height: number;
};

type GameBrightnessProps = {
    type?: string;
    cost?: string;
    onVictory?: Function;
    canPlay?: boolean;
    onLaunch?: Function;
    tokenName?: string;
};

const GameBrightness: React.FunctionComponent<GameBrightnessProps> = (props) => {
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
        }, 3500);

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
        let img: any;
        let radius = 15;
        let xCircle: number, yCircle: number;
        let drawTime: number = 0;
        let isMobile: boolean = false;
        let defaultWidth = 690;
        let defaultHeight = 388;

        function preload() {
          // load the original image
          const imgtoload = background;
          img = p.loadImage(imgtoload);
        }

        function drawMobile() {
            for (let x = 0; x < defaultWidth; x++) {
                const NUM_DOTS = 10;
                for(let i = 0; i < NUM_DOTS; i++) {
                  let xEllipse = Math.random() * defaultWidth;
                  let yEllipse = Math.random() * defaultHeight;
                  p.fill(Math.random() * 10 > 5 ? 80 : 255);
                  p.ellipse(xEllipse, yEllipse, 10, 10);
                }
            }
        }

        p.setup = () => {
            preload();
            if (containDiv && containDiv.current)
                defaultWidth = containDiv?.current?.getBoundingClientRect().width;
            if (defaultWidth < 690) isMobile = true;

            p.createCanvas(defaultWidth < 690 ? defaultWidth : 690, defaultHeight);
            p.pixelDensity(1);
            p.frameRate(30);

            xCircle = Math.floor(Math.random() * p.width);
            yCircle = Math.floor(Math.random() * p.height);

            if (isMobile) drawMobile();
        }

        p.draw = () => {
            drawTime = drawTime + 1;

            if (!isMobile) {
                p.image(img, 0, 0);
                // Only need to load the pixels[] array once, because we're only
                // manipulating pixels[] inside draw(), not drawing shapes.
                p.loadPixels();
                // We must also call loadPixels() on the PImage since we are going to read its pixels.
                img.loadPixels();
                for (let x = 0; x < img.width; x++) {
                    for (let y = 0; y < img.height; y++ ) {
                    // Calculate the 1D location from a 2D grid
                    let loc = (x + y*img.width)*4;
                    // Get the R,G,B values from image
                    let r,g,b;
                    r = img.pixels[loc];
                    // g = img.pixels[loc+1];
                    // b = img.pixels[loc+2];
                    // Calculate an amount to change brightness based on proximity to the mouse
                    // The closer the pixel is to the mouse, the lower the value of "distance"
                    let maxdist = 50;//dist(0,0,width,height);
                    let d = p.dist(x, y, p.mouseX, p.mouseY);
                    let adjustbrightness = 255*(maxdist-d)/maxdist;
                    r += adjustbrightness;
                    // g += adjustbrightness;
                    // b += adjustbrightness;
                    // Constrain RGB to make sure they are within 0-255 color range
                    r = p.constrain(r, 0, 255);
                    // g = constrain(g, 0, 255);
                    // b = constrain(b, 0, 255);
                    // Make a new color and set pixel in the window
                    let pixloc = (y*p.width + x)*4;
                    p.pixels[pixloc] = r;
                    p.pixels[pixloc+1] = r;
                    p.pixels[pixloc+2] = r;
                    p.pixels[pixloc+3] = 255; // Always have to set alpha
                    }
                }
                p.updatePixels();
            }

            if (isMobile || drawTime > 50) {
                p.fill(0);
                p.ellipse(xCircle, yCircle, radius, radius);
            }
        }

        p.mousePressed = () => {
            if (isCollide(
                { x: p.mouseX, y: p.mouseY, width: radius, height: radius },
                { x: xCircle, y: yCircle, width: radius, height: radius })) {
                setWin();
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
                    <Typography variant="body1"><b>Brightness Game</b> - Find a black dot in the picture to win{props.tokenName ? ' a ' + props.tokenName : ''}.</Typography>
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

export default GameBrightness;