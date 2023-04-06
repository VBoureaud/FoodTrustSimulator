import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import TextField from "@mui/material/TextField";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

type PocketFullProps = {
	title: string;
	message: string;
};

const PocketFull : React.FunctionComponent<PocketFullProps> = (props) => {
	return (
		<Box sx={{ width: '100%' }}>
			<Typography variant="h2" sx={{ cursor: 'pointer' }}>{props.title}</Typography>
			<Typography sx={{ ml: 1 }} variant="body1">{props.message}</Typography>
		</Box>
	);
}

export default PocketFull;