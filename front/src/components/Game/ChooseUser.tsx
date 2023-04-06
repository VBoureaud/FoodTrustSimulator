import React, { useState, useEffect } from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import DataGridUsers from '../DataGridUsers';
import '@utils/TypeToken.less';

import {
	User,
} from '@store/types/UserTypes';

import { 
	unPad,
} from "@utils/helpers";

// GAME FOR COOK
type ChooseUserProps = {
	users?: User[];
	numToSelect?: number;
	onSelected?: Function;
};

const capitalize = (str: string) =>
	str.charAt(0).toUpperCase() + str.slice(1);

type SelectedType = {
  [x: string]: boolean;
};

// Launch Game with requirements
const ChooseUser : React.FunctionComponent<ChooseUserProps> = (props) => {
		const [selected, setSelected] = useState<User>(null);
		const [collection, setCollection] = useState(null);
		const [warning, setWarning] = useState(false);

		const handleConfirm = () => {
			if (!selected)
				setWarning(true);
			else if (selected && props.onSelected) {
				setWarning(false);
				props.onSelected([selected]);
			}
		}

		return (
			<Container sx={{ width: '100%' }}>
				<Typography sx={{ ml: 1 }} variant="h5">
					Choose an user
				</Typography>
				{warning && <Box sx={{ background: 'tomato', padding: '5px', borderRadius: '8px', textAlign: 'center', mb: 1, mt: 1 }}>
					<Typography sx={{ color: 'white' }}>You must select at least {props.numToSelect} item{props.numToSelect > 1 ? 's' : ''}.</Typography>
				</Box>}
				{props.users 
					&& <Box sx={{
						background: '#222',
						padding: '12px',
						borderRadius: '4px',
						marginTop: 1,
					}}>
					<DataGridUsers
						users={props.users}
						onSelected={setSelected}
					/>
				</Box>}
				
				{props.users && 
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

export default ChooseUser;