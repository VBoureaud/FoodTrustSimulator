import React from "react";
import { Link } from "react-router-dom";
import logo from '@assets/images/logo.png';

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

const NoLoginContent = () => (
  <React.Fragment>  
    <Container 
      maxWidth="xl"
      sx={{
        mt: 15,
        height: '100vh',
      }}>
      <Box sx={{
        mx: "auto",
        width: 750,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
        <Box>
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
            textShadow: '1px 1px #b7abab',
        }} variant="h4">SIMULATOR</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Link to='/login'>
          <Button sx={{ 
            margin: 3,
            fontSize: 20,
            pl: 4,
            pr: 4,
            borderRadius: 4,
          }} color="primary" variant="contained">ENTER</Button>
        </Link>
      </Box>
    </Container>
    <div style={{ background: 'white', borderTop: '5px solid #003043' }}>
      <Container 
        sx={{
          width: 1,
          //background: '#003043',
          padding: 10,
          mb: 3,
        }}>
        <Paper sx={{ padding: 10, background: '#003043' }}>
          <Typography variant='h3'>What is that?</Typography>
          <Typography>
            Sunt fugiat in labore ut in officia incididunt duis anim eiusmod cillum nisi velit mollit fugiat tempor eu qui eu reprehenderit cillum nostrud sed esse sint quis pariatur voluptate aliqua id nisi fugiat consectetur aute adipisicing in ullamco officia velit in dolor dolor irure est labore sunt anim aliquip aliqua ullamco laboris consectetur amet nulla minim officia veniam est ea incididunt sunt proident officia laborum proident adipisicing laboris occaecat ullamco occaecat dolor reprehenderit eiusmod qui excepteur pariatur pariatur et ad consequat cupidatat dolore mollit aute do enim in enim ex irure elit dolore velit ut ex labore tempor magna consectetur reprehenderit dolor consequat est quis sunt in deserunt eu tempor cillum non eiusmod fugiat enim in eu esse dolore labore mollit nulla occaecat consequat dolore id ut magna ut est anim ad culpa exercitation dolor in commodo proident ut sint fugiat eu dolore fugiat dolore fugiat quis voluptate in duis qui proident velit dolor magna occaecat ut laboris duis eiusmod elit officia sint mollit tempor quis velit pariatur ut voluptate aute fugiat aute ex.
          </Typography>
        </Paper>
        <Paper sx={{ ml: 'auto', mt: 2, padding: 10, background: '#147066' }}>
          <Typography variant='h3'>And that?</Typography>
          <Typography>
            Sunt fugiat in labore ut in officia incididunt duis anim eiusmod cillum nisi velit mollit fugiat tempor eu qui eu reprehenderit cillum nostrud sed esse sint quis pariatur voluptate aliqua id nisi fugiat consectetur aute adipisicing in ullamco officia velit in dolor dolor irure est labore sunt anim aliquip aliqua ullamco laboris consectetur amet nulla minim officia veniam est ea incididunt sunt proident officia laborum proident adipisicing laboris occaecat ullamco occaecat dolor reprehenderit eiusmod qui excepteur pariatur pariatur et ad consequat cupidatat dolore mollit aute do enim in enim ex irure elit dolore velit ut ex labore tempor magna consectetur reprehenderit dolor consequat est quis sunt in deserunt eu tempor cillum non eiusmod fugiat enim in eu esse dolore labore mollit nulla occaecat consequat dolore id ut magna ut est anim ad culpa exercitation dolor in commodo proident ut sint fugiat eu dolore fugiat dolore fugiat quis voluptate in duis qui proident velit dolor magna occaecat ut laboris duis eiusmod elit officia sint mollit tempor quis velit pariatur ut voluptate aute fugiat aute ex.
          </Typography>
        </Paper>
        <Paper sx={{ m: 'auto', mt: 2, padding: 10, background: '#703b14' }}>
          <Typography variant='h3'>And this?</Typography>
          <Typography>
            Sunt fugiat in labore ut in officia incididunt duis anim eiusmod cillum nisi velit mollit fugiat tempor eu qui eu reprehenderit cillum nostrud sed esse sint quis pariatur voluptate aliqua id nisi fugiat consectetur aute adipisicing in ullamco officia velit in dolor dolor irure est labore sunt anim aliquip aliqua ullamco laboris consectetur amet nulla minim officia veniam est ea incididunt sunt proident officia laborum proident adipisicing laboris occaecat ullamco occaecat dolor reprehenderit eiusmod qui excepteur pariatur pariatur et ad consequat cupidatat dolore mollit aute do enim in enim ex irure elit dolore velit ut ex labore tempor magna consectetur reprehenderit dolor consequat est quis sunt in deserunt eu tempor cillum non eiusmod fugiat enim in eu esse dolore labore mollit nulla occaecat consequat dolore id ut magna ut est anim ad culpa exercitation dolor in commodo proident ut sint fugiat eu dolore fugiat dolore fugiat quis voluptate in duis qui proident velit dolor magna occaecat ut laboris duis eiusmod elit officia sint mollit tempor quis velit pariatur ut voluptate aute fugiat aute ex.
          </Typography>
        </Paper>
      </Container>
    </div>
  </React.Fragment>
);

export default NoLoginContent;
