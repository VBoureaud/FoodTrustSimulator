import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CircularProgress from "@mui/material/CircularProgress";
import { displayDate } from '@utils/helpers';

type DisplayAdProps = {
  loading?: boolean;
  date: string;
  duree: number;
  message: string;
  userAddress: string;
  names?: {[key: string]: string};
  onClick: Function;
}

const randColor = [ 'tomato', '#4752ff', '#39d234', '#ff4747', '#9a47ff', '#e847ff', '#47c3ff', '#f27b34' ];

const DisplayAd : React.FunctionComponent<DisplayAdProps> = (props) => {
  const random = (max: number) => Math.floor(Math.random() * max);

	return (
		<Paper elevation={3} style={{ 
        borderStyle: 'dashed',
        background: randColor[random(randColor.length)],
        color: 'white',
        padding: 10,
        paddingLeft: 35,
        paddingRight: 35,
        borderRadius: 5,
        paddingBottom: 35 }}>
		  {props.loading && <CircularProgress sx={{ display: 'block', margin: 'auto', color: "white" }} />}
			
      {!props.loading && <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Tooltip title={props.userAddress} placement="top-start">
            <Typography variant="h6">
              {props.names && props.names[props.userAddress] 
                ? props.names[props.userAddress] 
                : props.userAddress}
            </Typography>
          </Tooltip>
          <Tooltip title={displayDate(parseInt(props.date), true)} placement="top-start">
            <Typography variant="h6">{displayDate(parseInt(props.date))}</Typography>
		      </Tooltip>
        </Box>
        <Typography sx={{ 
          mt: 2,
          mb: 1,
          textAlign: 'center',
          whiteSpace: 'pre-wrap',
        }} variant="h4">{props.message}</Typography>
        <Box
          sx={{ 
            display: 'flex',
            justifyContent: 'end',
          }}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => props.onClick(props.userAddress)}
            >
            <Typography>See</Typography>
          </Button>
        </Box>
      </Box>}

    </Paper>
	);
}

export default DisplayAd;