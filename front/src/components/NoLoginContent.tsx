import React from "react";
import { Link } from "react-router-dom";
import logo from "@assets/images/logo.png";
import { 
  actionPoints,
} from "@utils/gameEngine";

import { Footer } from "./Template";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AnchorLink from "react-anchor-link-smooth-scroll";
import CircularProgress from '@mui/material/CircularProgress';
import './Template.less';

type NoLoginContentProps = {
  login: Function;
  loading?: boolean;
};

const NoLoginContent = (props: NoLoginContentProps) => (
  <div className="background">  
    <Container 
      maxWidth="xl"
      sx={{
        height: '100vh',
      }}>
      <Box sx={{
        mx: "auto",
        //height: '100%',
        maxWidth: 750,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        textAlign: 'center',
      }}>
        <Box sx={{
          mt: 6,
          //display: { xs: 'none', md: 'block' },
        }}>
          <img 
            src={logo}
            alt={logo}
            style={{
              width: 'calc(100vh - 406px)',
              maxWidth: '450px',
            }}
            />
        </Box>
        <Typography 
          sx={{
            color: '#FAD870',
            fontWeight: 'bold',
            letterSpacing: '10px',
            textShadow: '2px 2px #b0a7a7',
            position: 'relative',
            mt: { xs: 0, md: 0 },
        }} variant="h1">
          FOOD TRUST
          <Box sx={{ display: { xs: 'none', md: 'block' }, }}>
              <span style={{
              fontSize: '40px',
              color: '#ffef00',
              position: 'absolute',
              top: '-29px',
              right: '0',
            }}>Beta</span>
          </Box>
        </Typography>
        <Typography 
          sx={{
            //color: '#FA7070',
            //textShadow: '1px 1px #bb4343',
            color: '#FF1F1F',
            textShdasow: '1px 1px #555',
            letterSpacing: '5px',
            //textShadow: '1px 1px #b7abab',
        }} variant="h4">SIMULATOR</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          {/*<Link to='/login'>*/}
            <Button
              sx={{ 
                fontSize: 20,
                pl: 4,
                pr: 4,
                borderRadius: 4,
              }}
              color="primary"
              variant="contained"
              onClick={() => props.login()}
              >
              {props.loading && <CircularProgress sx={{ display: 'block', margin: 'auto', color: "white", padding: '5px' }} />}
              {!props.loading && <span id="enter_button">ENTER</span>}
            </Button>
          {/*</Link>*/}
        </Box>
        <Box className="moreIconResponsive">
          <AnchorLink href='#more'><ArrowDownwardIcon sx={{ fontSize: '45px' }} /></AnchorLink>
        </Box>
      </Box>
    </Container>
    <div style={{ background: 'white', borderTop: '5px solid #003043' }}>
      <Container 
        id="more"
        sx={{
          width: 1,
          //background: '#003043',
          padding: 10,
          mb: 3,
        }}>
        <Paper sx={{ padding: { xs: 2, md: 10 }, background: '#003043' }}>
          <Typography sx={{ mb: 2 }} variant='h3'>What is Food Trust Simulator?</Typography>
          <Typography sx={{ mb: 2, textAlign: 'justify' }}>
            A project developed during XRPL Hackathon 2022 and powered by a Grant, which attempts to illustrate the interactions around the food sphere in a blockchain ecosystem proposed by XRPL.
          </Typography>
          <Typography sx={{ textAlign: 'justify' }}>
            It works as an educational game where anyone with a XRP Ledger account can play on the <b>Testnet</b>. The game provides opportunities to create NFTs that reference unique ingredients and other useful items to play. Then you can trade with others on the plateform. You will discover a new way to learn more about blockchain by playing and understanding the basics of blockchain, such as ownership, transactions and of course NFTs.</Typography>
        </Paper>
        <Paper sx={{ ml: 'auto', mt: 2, padding: { xs: 2, md: 10 }, background: '#147066' }}>
          <Typography sx={{ mb: 2 }} variant='h3'>How does it work?</Typography>
          <Typography sx={{ textAlign: 'justify' }}>
            Register or login to <b>Food Trust Simulator</b> with a valide XRPL address on <b>Testnet</b>.<br />
            Then choose and customize a profile to start playing. Each profile offers different behaviors that you will experience and try to evolve with it, until you better understand the game experience.<br />
            Play to earn NFTs and experiences, but be careful, your profile has a collection limit. Check your collection on the Collection Page.<br />
            Additionnaly, you will be able to earn experience by completing quests. For this, you will need to get NFTs from other players by trading with them.<br /><br />
            How scoring works: <br />
              - Play and win a Token: {actionPoints.mintToken}xp<br />
              - Sell a Token: {actionPoints.acceptedOffer}xp<br />
              - Buy a Token to a small level account: {actionPoints.buyOfferToSmallLevel}xp<br />
              - Win a Quest: {actionPoints.questCompleted}xp*<br />
              <span style={{ fontSize: '14px' }}>Can be more: Each ingredient power is a multiplier.</span><br />
              <span style={{ fontSize: '14px' }}>Read more on the <b>ScoreBoard</b> when you are connected.</span><br />
            <br />
            On your profile page, find a summary of your statistics and badges earned.<br />
            Have fun ! :)
          </Typography>
          <Link to='/faq'>
            <Button
              color="primary"
              variant="contained"
              sx={{ 
                fontSize: 20,
                mt: 4,
                pl: 4,
                pr: 4,
                borderRadius: 4,
              }}
            >FAQ</Button>
          </Link>
        </Paper>
        <Paper sx={{ m: 'auto', mt: 2, padding: { xs: 2, md: 10 }, background: '#703b14' }}>
          <Typography sx={{ mb: 2 }} variant='h3'>Preview</Typography>
          {/*<iframe src='https://www.youtube.com/embed/K7XOki5DEqE'
                  frameBorder='0'
                  allow='autoplay; encrypted-media'
                  allowFullScreen
                  title='Food Trust Simulator - XRPL Hackathon'
                  width='100%'
                  height='500px'
          />*/}
          <iframe src='https://www.youtube.com/embed/wAHm1qjaUA8'
            frameBorder='0'
            allow='autoplay; encrypted-media'
            allowFullScreen
            title='Food Trust Simulator Beta'
            width='100%'
            height='500px'
          />
        </Paper>
      </Container>
    </div>
    <Footer />
  </div>
);

export default NoLoginContent;
