import React, { useState, useEffect } from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';

import '@utils/TypeToken.less';

import {
	Uri,
} from '@store/types/UriTypes';

import {
	translateImageSpecsToCss,
	nameTypeToken,
} from '@utils/gameEngine';

import { 
	unPad,
} from "@utils/helpers";

// GAME FOR COOK
type ChooseCollectionProps = {
	collection?: Uri[];
	numToSelect?: number;
	maxToSelect?: number;
	onSelected?: Function;
};

const capitalize = (str: string) =>
	str.charAt(0).toUpperCase() + str.slice(1);

type SelectedType = {
  [x: string]: boolean;
};

// Launch Game with requirements
const ChooseCollection : React.FunctionComponent<ChooseCollectionProps> = (props) => {
		const [selected, setSelected] = useState<Partial<SelectedType>>({});
		const [collection, setCollection] = useState(null);
		const [warning, setWarning] = useState(false);

		const handleSelected = (event: React.ChangeEvent<HTMLInputElement>, name: string) => {
			selected[name] = event.target.checked;
		}

		const handleConfirm = () => {
			const selectedFiltered = Object.keys(selected).filter(e => selected[e]);
			if (props.numToSelect && selectedFiltered.length < props.numToSelect)
				setWarning(true);
			else if (props.maxToSelect && selectedFiltered.length > props.maxToSelect)
				setWarning(true);
			else if (props.onSelected) {
				setWarning(false);
				props.onSelected(selectedFiltered);
			}
		}

		return (
			<Container sx={{ width: '100%' }}>
				<Typography sx={{ ml: 1 }} variant="h5">
					Choose in your Collection
				</Typography>
				{warning && <Box sx={{ background: 'tomato', padding: '5px', borderRadius: '8px', textAlign: 'center', mb: 1, mt: 1 }}>
					<Typography sx={{ color: 'white' }}>You must select at least {props.numToSelect} item{props.numToSelect > 1 ? 's' : ''}.</Typography>
				</Box>}
				<FormControl sx={{ width: '100%' }} component="fieldset">
					<FormGroup sx={{ 
						width: '100%',
						maxHeight: '60vh',
						overflow: 'auto',
						background: '#373737',
						display: 'flex',
						justifyContent: 'center',
						padding: '15px',
						borderRadius: '8px',
						}} aria-label="position" row>
						{!props.collection && <span style={{ color: 'white' }}>Collection is empty.</span>}
						{props.collection && props.collection.map((e: Uri, i: number) => (
							<FormControlLabel
								key={i}
								value="top"
								control={<Checkbox />}
								labelPlacement="top"
								sx={{ 
									background: '#538af2',
									padding: '7px',
									borderRadius: '15px',
									boxShadow: '0px 2px 1px 0px black',
									m: 1,
								}}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleSelected(event, e.name)}
								label={
									<Tooltip
										title={nameTypeToken[e.image.split('#')[0]] ? nameTypeToken[e.image.split('#')[0]].name : 'Unknown'} placement="top-start">
										<Avatar sx={{ 
											height: '60px',
											width: '60px',
											border: '1px solid #666',
											background: '#faf8ebe6'
										}}>
											<Box
												style={{ 
													margin: 'auto',
													filter: translateImageSpecsToCss(e.image),
													WebkitFilter: translateImageSpecsToCss(e.image),
													//MozFilter: translateImageSpecsToCss(props.tokenType),
													//OFilter: translateImageSpecsToCss(props.tokenType),
													//MsFilter: translateImageSpecsToCss(props.tokenType),
													//-moz-filter: translateImageSpecsToCss(props.tokenType),
													//-o-filter: translateImageSpecsToCss(props.tokenType),
													//-ms-filter: translateImageSpecsToCss(props.tokenType),
												}}
												className={"nftTokenMin minType"+ unPad(e.image.split('#')[0])}
											></Box>
										</Avatar>
									</Tooltip>
								}
								/>
							)
						)}
					</FormGroup>
				</FormControl>
				{props.collection && 
					<Button
						//disabled={!Object.keys(selected).filter(e => selected[e]).length}
						onClick={handleConfirm}
						sx={{
							background: '#538af2',
							color: 'white',
							borderRadius: '8px',
							mt: 1,
							width: '100%',
						}}
						><ArrowForwardIosIcon /></Button>}
			</Container>
		);
}

export default ChooseCollection;