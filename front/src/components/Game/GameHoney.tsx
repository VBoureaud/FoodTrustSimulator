import React, { useState, useRef, useEffect } from 'react'
import p5 from 'p5';

import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import abeilleImg from "./assets/images/ABEILLE_40.png";
import abeilleReverseImg from "./assets/images/ABEILLE_40_reverse.png";
import rucheImg from "./assets/images/RUCHE_50.png";
import ruche_darkImg from "./assets/images/RUCHE_50_dark.png";

import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
const randColorPlay = [ '#5e47ff', '#47c3ff', '#78ff47', '#ff9d47', '#ff4747', '#4d47ff', '#f947ff', '#ff4750' ];
const random = (max: number) => Math.floor(Math.random() * max);

// GameHoney1 by @AdrienB
// pbm : how to "break" the random loop in the honey generation as soon as a collision is detected in order to optimise if we want higher number of honeycombs.
//      how can i ensure that they're wont be infinite loops ?

type objCollide = {
    x: number;
    y: number;
    width: number;
    height: number;
};

type GameHoneyProps = {
    type?: string;
    cost?: string;
    onVictory?: Function;
    canPlay?: boolean;
    onLaunch?: Function;
    tokenName?: string;
};

const GameHoney : React.FunctionComponent<GameHoneyProps> = (props) => {
    const [step, setStep] = useState(0);
    const p5Ref = useRef();
    const containDiv = useRef<HTMLInputElement>(null);
    let myP5Canvas:any = null;

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
        let difficultycoef = 0;
        //let hght = 400;
        //let wdth = 400;
        let sizehoney = 50;
        let sizebee = 40;
        let result: boolean|null = null;
        let arrayOfBees: Bee[] = [];
        let arrayOfHoney: Honey[] = [];
        let numberOfHoney = 5 + difficultycoef;
        let countertest = 0;

        // img to load for display
        let imgAbeille: any;
        let imgAbeilleReverse: any;
        let imgRuche: any;
        let imgRucheDark: any;

        //movement of bee
        const cx = 300;
        const cy = 300;
        const cr = 100;

        function randomInt(min: number, max: number) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function collideHoney(a: {x: number, y: number},b: {x: number, y: number},dis: number){
          var d = p.dist(a.x, a.y, b.x, b.y);
          if (d < dis * sizehoney) {
            return true
        } else {
          return false
          }
        }

        function collideMouse(ax: number,ay: number,bx: number,by: number,dis: number){
          var d = p.dist(ax, ay, bx, by);
          if (d < dis * sizehoney) {
            return true
        } else {
          return false
          }
        }

        function overHoney(rayon: number, index: number) {
          if (arrayOfBees.length && p.dist(arrayOfBees[index].x, arrayOfBees[index].y, arrayOfHoney[arrayOfBees[index].isSelected()].x, arrayOfHoney[arrayOfBees[index].isSelected()].y) < rayon) {
            return true;
          } else {
            return false;
          }
        }

        function movebee(i: number){
          if (arrayOfBees.length) {
            arrayOfBees[i].targetX = arrayOfHoney[arrayOfBees[i].isSelected()].x
            arrayOfBees[i].targetY = arrayOfHoney[arrayOfBees[i].isSelected()].y
          }
        }

        function checkresult(){
          let counter = 0;
          for (let i = 0; i < arrayOfHoney.length; i++){
            if (arrayOfHoney[i].clicked == 1){
              counter++;
            }
          }
          if (counter == arrayOfHoney.length){
            return true;
          }
        }

        class Honey {
          x: number = null;
          y: number = null;
          clicked: number = null;
          imgRuche: any | undefined = null;
          imgRucheDark: any | undefined = null;

          constructor(
            cColor: string,
            x: number,
            y: number,
            imgRuche: any,
            imgRucheDark: any) {
            this.x = x;
            this.y = y;
            this.clicked = 0;
            this.imgRuche = imgRuche;
            this.imgRucheDark = imgRucheDark;
          }

          display() {
            p.image(
                !this.clicked ? this.imgRuche : this.imgRucheDark,
                this.x - sizehoney / 2,
                this.y - sizehoney / 2,
            );
            //p.loadPixels();
            //imgRuche.loadPixels();

            //p.fill(this.color);
            //p.ellipse(this.x, this.y, sizehoney,sizehoney);
          }

          getX() {
            return this.x;
          }

          getY() {
            return this.y;
          }

          getClicked() {
            return this.clicked;
          }
          
          setClicked(clicked: number) {
            this.clicked = clicked;
          }
        }

        class Bee {
          reversed: boolean = false;
          x: number = null;
          y: number = null;
          selectedhoney: number = null;
          overhoney: boolean = null;
          cx: number = null;
          cy: number = null;
          targetX: number = null;
          targetY: number = null;
          easing: number = null;
          imgAbeille: any = null;
          imgAbeilleReverse: any = null;

          constructor(
            cColor: string,
            x: number,
            y: number,
            selectedhoney: number,
            easing: number,
            imgAbeille: any,
            imgAbeilleReverse: any,
            ) {
            this.reversed = false;
            this.x = x;
            this.y = y;
            this.selectedhoney = selectedhoney;
            this.overhoney = false;
            this.cx = cx;
            this.cy = cy;
            this.targetX = cx;
            this.targetY = cy;
            this.easing = easing;
            this.imgAbeille = imgAbeille;
            this.imgAbeilleReverse = imgAbeilleReverse;
          }

          getTargetX() {
            return this.targetX;
          }
          getTargetY() {
            return this.targetY;
          }
          setTargetX(x: number) {
            this.targetX = x;
          }
          setTargetY(y: number) {
            this.targetY = y;
          }
          getEasing() {
            return this.easing;
          }

          display() {
            /*p.fill(this.color);
            p.ellipse(this.x,
                this.y, sizebee,sizebee);*/

            p.image(
                this.reversed ? this.imgAbeilleReverse : this.imgAbeille,
                this.x - sizebee / 2,
                this.y - sizebee / 2,
            );
          }
          
          getCx() {
            return this.cx;
          }
          getCy() {
            return this.cy;
          }
          setCx(cx: number) {
            this.reversed = this.cx > cx;
            this.cx = cx;
          }
          setCy(cy: number) {
            this.cy = cy;
          }

          getX() {
            return this.x;
          }
          getY() {
            return this.y;
          }

          setX(x: number) {
            this.x = x;
          }
          setY(y: number) {
            this.y = y;
          }

          isSelected() {
            return this.selectedhoney;
          }

          setSelected(selected: number) {
            this.selectedhoney = selected;
          }
        }

        function preload() {
          // load the original image
          //const imgtoload = ;
          imgAbeille = p.loadImage(abeilleImg);
          imgAbeilleReverse = p.loadImage(abeilleReverseImg);
          imgRuche = p.loadImage(rucheImg);
          imgRucheDark = p.loadImage(ruche_darkImg);
        }

        p.setup = () => {
          preload();
          let defaultWidth = 720;
          let defaultHeight = 350;
          //let defaultWidth = 720;
          if (containDiv && containDiv.current) {
            defaultWidth = containDiv?.current?.getBoundingClientRect().width;
            //defaultHeight = containDiv?.current?.getBoundingClientRect().height;
          }

          p.createCanvas(defaultWidth, defaultHeight);
          
          let limitWhile = 100;
          let counterWhile = 0;
          let x = null;
    			let y = null;
    			let collision = false;
    			arrayOfHoney = [];

      		// create honeys
      		while (arrayOfHoney.length != numberOfHoney && counterWhile++ < limitWhile) {
      			if (arrayOfHoney.length == 0){
      			  x = randomInt(2*sizehoney, defaultWidth - sizehoney);
      			  y = randomInt(2*sizehoney, defaultHeight - sizehoney);
      			  arrayOfHoney.push(new Honey("randomName", x, y, imgRuche, imgRucheDark));
      			}

      			countertest = 0;
      			x = randomInt(2*sizehoney, defaultWidth - sizehoney);
      			y = randomInt(2*sizehoney, defaultHeight - sizehoney);
      			for (let j = 0; j < arrayOfHoney.length; j++) {
      			  if (collideHoney({ x, y }, arrayOfHoney[j],2)==false){
      			    countertest++;
      			  }
      			}
      			if (countertest == arrayOfHoney.length){
      			  arrayOfHoney.push(new Honey("randomName", x, y, imgRuche, imgRucheDark));
      			}
      		}

    			// create bees
    			for (let i = 0; i < arrayOfHoney.length + difficultycoef; i++) {
      			let x = randomInt(2 * sizebee, defaultWidth - sizebee);
      			let y = randomInt(2 * sizebee, defaultHeight - sizebee);
      			let selectedhoney = randomInt(0, arrayOfHoney.length -1);
      			let easing = p.random(0.01, 0.05);
    				arrayOfBees.push(
              new Bee("randomName",
                x,
                y,
                selectedhoney,
                easing,
                imgAbeille,
                imgAbeilleReverse
              )
            );
    			}

        }

        p.draw = () => {
          p.background("beige");
  
    		  for (let i = 0; i < arrayOfHoney.length; i++) {
    		    arrayOfHoney[i].display();
    		    p.fill(65);
    		    p.text(p.str(i), arrayOfHoney[i].getX(),arrayOfHoney[i].getY());
    		  }
    		  for (let i = 0; i < arrayOfBees.length; i++) {
    		    arrayOfBees[i].setCx(
                arrayOfBees[i].getCx() 
                + (arrayOfBees[i].getTargetX() - arrayOfBees[i].getCx())
                * arrayOfBees[i].getEasing()
            );

            arrayOfBees[i].setCy(
                arrayOfBees[i].getCy() 
                + (arrayOfBees[i].getTargetY() - arrayOfBees[i].getCy())
                * arrayOfBees[i].getEasing()
            );
		        
            arrayOfBees[i].display();
    		    arrayOfBees[i].setX(arrayOfBees[i].getCx());
    		    arrayOfBees[i].setY(arrayOfBees[i].getCy());
		    
    		    if(overHoney(1, i) == true){
    		      arrayOfBees[i].setSelected(randomInt(0,arrayOfHoney.length -1));
    		    }      
            movebee(i);
		      }
		  
		      result = checkresult();
          if (result) {
            setWin();
          }
        }

        p.mousePressed = () => {
          for (let i = 0; i < arrayOfHoney.length; i++){
    				if (collideMouse(p.mouseX, p.mouseY, arrayOfHoney[i].getX(), arrayOfHoney[i].getY(),0.75)==true){
    					arrayOfHoney[i].setClicked(1);
    				}
          }

    			for (let i = 0; i < arrayOfBees.length; i++){
    				if (collideMouse(p.mouseX, p.mouseY, arrayOfBees[i].getX(), arrayOfBees[i].getY(), 0.5)==true){
    					result = false;
    				}
    			}

          if (result === false) {
            arrayOfHoney.forEach(elt => elt.setClicked(0));
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
                    <Typography variant="body1"><b>Honey Game</b> - Click on each bee-free honey to win{props.tokenName ? ' a ' + props.tokenName : ''}.</Typography>
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

export default GameHoney