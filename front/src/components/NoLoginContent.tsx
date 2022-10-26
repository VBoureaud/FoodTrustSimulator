import React from "react";
//import { Link } from "react-router-dom";
import logo from "@assets/images/logo.png";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AnchorLink from "react-anchor-link-smooth-scroll";
import CircularProgress from '@mui/material/CircularProgress';

type NoLoginContentProps = {
  login: Function;
  loading?: boolean;
};

const NoLoginContent = (props: NoLoginContentProps) => (
  <React.Fragment>  
    <Container 
      maxWidth="xl"
      sx={{
        height: '100vh',
      }}>
      <Box sx={{
        mx: "auto",
        height: '100%',
        width: 750,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <Box sx={{
          mt: 6,
        }}>
          <img src={logo} alt={logo} width='350' />
        </Box>
        <Typography 
          sx={{
            color: '#FAD870',
            fontWeight: 'bold',
            letterSpacing: '10px',
            textShadow: '2px 2px #b0a7a7',
        }} variant="h1">FOOD TRUST</Typography>
        <Typography 
          sx={{
            color: '#FA7070',
            letterSpacing: '5px',
            textShadow: '1px 1px #bb4343',
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
        <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            mt: 11,
          }}>
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
        <Paper sx={{ padding: 10, background: '#003043' }}>
          <Typography sx={{ mb: 2 }} variant='h3'>What is Food Trust Simulator?</Typography>
          <Typography sx={{ mb: 2 }}>
            A project developed during XRPL Hackathon, which attempts to illustrate the interactions around the food sphere in a blockchain ecosystem proposed by XRPL.
          </Typography>
          <Typography>
            It works as a game where everyone with an XRP Ledger account can play on the NFT-Devnet. The game offers possibilities to mint nftTokens who refer to unique ingredients. Then you can trade with others on the plateform. The main functionality lies in the traceability of ingredients during exchanges, thanks to the management of URIs implemented according to EIP-1155.</Typography>
        </Paper>
        <Paper sx={{ ml: 'auto', mt: 2, padding: 10, background: '#147066' }}>
          <Typography sx={{ mb: 2 }} variant='h3'>How does it work?</Typography>
          <Typography>
            Register or Sign in to FoodTrust Simulator with an valide XRPL address on NFT-Devnet.<br />
            Then choose a profile and start playing. Currently, Profiles are not included in the game engine, so the difference is only in the skin.<br />
            DashBoard page offer useful informations coming from XRPL and the Game server.<br />
            Play to win some NFTs and experiences, but be careful, your profile has a collection limit. Check your collection on the Collection Page.<br />
            You always have a current Quest todo. If you succeed, you level up ! For that you need to find NFTs from other account and trade with them.<br /><br />
            How scoring works: <br />
              - Play and win a Token: 100<br />
              - Win a Quest: 900<br />
              - Buy a Token: 500<br />
              - Buy a Token to a small level account: 700<br />
            Calcul Level: a Pokemon Like logarithm function. <br /><br />
            On your profile page, find a summary of your statistics and Badges earned.<br />
            Have fun ! :)
          </Typography>
        </Paper>
        <Paper sx={{ m: 'auto', mt: 2, padding: 10, background: '#703b14' }}>
          <Typography sx={{ mb: 2 }} variant='h3'>Preview</Typography>
          <iframe src='https://www.youtube.com/embed/K7XOki5DEqE'
                  frameBorder='0'
                  allow='autoplay; encrypted-media'
                  allowFullScreen
                  title='Food Trust Simulator - XRPL Hackathon'
                  width='100%'
                  height='500px'
          />
        </Paper>
      </Container>
    </div>
  </React.Fragment>
);

export default NoLoginContent;
