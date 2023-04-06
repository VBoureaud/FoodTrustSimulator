import React from 'react';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

type HistoryLineProps = {
	id: number | string;
	date: string;
	actionBackground: string;
	actionName: string;
	accountAddress: string;
	accountName: string;
	textFrom: string;
	location: string;
	textMap: string;
	mapBackground: string;
  tokenName?: string;
  price?: string;
  textPrice?: string;
};

const HistoryLine : React.FunctionComponent<HistoryLineProps> = (props) => {
	return (
		<Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      <Box sx={{ margin: '2px', borderRadius: '4px', padding: '5px 10px' }}>
        {props.id}
      </Box>
      <Box sx={{ background: '#4a3f38', margin: '2px', borderRadius: '4px', padding: '5px 8px' }}>
        <Tooltip placement="top-start" title={props.date}>
          <Typography>
            {props.date}
          </Typography>
        </Tooltip>
      </Box>
      {props.tokenName && <Box sx={{ background: '#db5a54', margin: '2px', borderRadius: '4px', padding: '5px' }}>
        {props.tokenName}
      </Box>}
      <Box sx={{ background: props.actionBackground, margin: '2px', borderRadius: '4px', padding: '5px' }}>
        {props.actionName}
      </Box>
      <Box sx={{ background: '#32439b', margin: '2px', borderRadius: '4px', padding: '5px' }}>
        <Tooltip placement="top-start" title={props.accountAddress}>
          <Typography sx={{ wordBreak: 'break-word' }}>
            {props.accountName ? props.accountName : props.accountAddress}
          </Typography>
        </Tooltip>
      </Box>
      {props.price && <>
        <Box sx={{ background: '#222', margin: '2px', borderRadius: '4px', padding: '5px' }}>
          {props.textPrice}
        </Box>
        <Box sx={{ background: '#515151', margin: '2px', borderRadius: '4px', padding: '5px'}}>
          <Typography sx={{ fontSize: '17px' }}>
            <strong>{props.price}</strong>
            <span style={{ fontSize: '12px', marginLeft: '1px' }}>XRP</span>
          </Typography>
        </Box>
      </>}
      {props.accountName && <>
          <Box sx={{ background: '#222', margin: '2px', borderRadius: '4px', padding: '5px' }}>
            {props.textFrom}
          </Box>
          <Box sx={{ background: '#840570', margin: '2px', borderRadius: '4px', padding: '5px' }}>
            {props.location}
          </Box>
        </>}
      <Box sx={{ display: 'flex', alignItems: 'center', background: '#222', margin: '2px', borderRadius: '4px', padding: '5px' }}>
        {props.textMap} <Box sx={{ marginLeft: '5px', background: props.mapBackground, width: '15px', height: '15px', borderRadius: '50px' }}></Box>
      </Box>
    </Box>
	);
}

export default HistoryLine;