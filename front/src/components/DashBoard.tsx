import React from "react";
import { Link } from "react-router-dom";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import FolderSharedIcon from "@mui/icons-material/FolderShared";

// needed XRPL class 
if (typeof module !== "undefined") var xrpl = require('xrpl')

type DashboardProps = {
  name: string;
  profile: string;
  address: string;
  balance: string;
  nftsLength: number;
  nftsLimit: number;
  loading?: boolean;
};

const DashBoard = (props: DashboardProps) => (
	<Box sx={{ flexGrow: 1 }}>
	  <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ minHeight: 250, padding: 2, position: 'relative' }}>
            <Box sx={{ position: 'absolute', right: '25px' }}>
              <Link to={ '/profile' }>
                <FolderSharedIcon sx={{ color: 'white', fontSize: '44px' }}/>
              </Link>
            </Box>
            <Typography variant="h6">User:</Typography>
            {props.loading && <CircularProgress sx={{ display: 'block', margin: 'auto', color: "white" }} />}
            {!props.loading && <Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                {!props.name && <Typography variant="h2">No name? Please register with this address to be able to play.</Typography>}
                {props.name && <Typography variant="h2">{props.name}</Typography>}
              </Box>
              <Box sx={{ wordBreak: 'break-word' }}>
                <Typography sx={{ mt: 1, mb: 1 }} variant="h6">XRPL Address:</Typography>
                <Typography variant="h4">{props.address}</Typography>
              </Box>
            </Box>}
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper elevation={3} sx={{ minHeight: 170, padding: 2 }}>
            <Typography variant="h6">Current balance:</Typography>
            {props.loading && <CircularProgress sx={{ display: 'block', margin: 'auto', color: "white" }} />}
            {!props.loading &&
              <Box sx={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <Typography variant="h2" sx={{ wordBreak: 'break-word' }}>{props.balance && xrpl.dropsToXrp(props.balance)}</Typography>
                <Typography variant="h6">XRP</Typography>
              </Box>}
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper elevation={3} sx={{ minHeight: 170, padding: 2 }}>
            <Typography variant="h6">Nfts collection:</Typography>
            {props.loading && <CircularProgress sx={{ display: 'block', margin: 'auto', color: "white" }} />}
            {!props.loading && 
              <Typography variant="h2" sx={{ wordBreak: 'break-word', textAlign: 'center' }}>
                {props.nftsLength ? props.nftsLength : '0'}{props.nftsLimit ? '/' + props.nftsLimit : ''}
              </Typography>}
          </Paper>
        </Grid>
    </Grid>
	</Box>
)

export default DashBoard;