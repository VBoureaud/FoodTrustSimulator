import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import CircularProgress from "@mui/material/CircularProgress";
import {
	displayDate,
	unPad,
	displayDiffDate, 
} from '@utils/helpers';
import {
	levelDisplay,
	nameTypeToken,
} from '@utils/gameEngine';

import {
	User
} from '@store/types/UserTypes';

import './DataGrid.less';

if (typeof module !== "undefined") var xrpl = require('xrpl')

const columns: GridColDef[] = [
	{ 
		field: 'id',
		headerName: 'Id',
		width: 7,
	},
	{ 
		field: 'name',
		headerName: 'Name',
		width: 140,
		renderCell: (params: GridRenderCellParams) => <div><Tooltip title={params.formattedValue} placement="top-start"><span>{params.formattedValue}</span></Tooltip></div>
	},
	{ 
		field: 'level',
		headerName: 'Level',
		width: 50,
	},
	{ 
		field: 'address',
		headerName: 'Address',
		width: 50,
		renderCell: (params: GridRenderCellParams) => <div><Tooltip title={params.formattedValue} placement="top-start"><span>{params.formattedValue}</span></Tooltip></div>
	},
	{ 
		field: 'tokenNeeded',
		headerName: 'Need',
		minWidth: 225,
		renderCell: (params: GridRenderCellParams) => <Box sx={{ display: 'flex' }}>
			{params.formattedValue ? params.formattedValue.map((e: string, index: number) => 
				<Tooltip
					key={index}
					title={nameTypeToken[e] ? nameTypeToken[e].name : 'Unknown'} placement="top-start">
						<Box
							className={"nftTokenMin minType"+ unPad(e)}
						></Box>
				</Tooltip>
			) : <></>}
		</Box>
	},
	{ 
		field: 'lastco',
		headerName: 'Latest Activity',
		minWidth: 30,
		renderCell: (params: GridRenderCellParams) => <span>{displayDiffDate(params.formattedValue)}</span>,
	},
];

const buildRow = (
	user: User,
	index: number) => {
	const data = { 
		id: index,
		name: user.name,
		level: levelDisplay(user.experience),
		address: user.address,
		tokenNeeded: user.quest[0].tokenNeeded,
		lastco: user.lastCo,
	};
	return data;
};

type DataGridUsersProps = {
	loading?: boolean;
	users?: User[];
	onSelected?: Function;
}

const DataGridUsers : React.FunctionComponent<DataGridUsersProps> = (props) => {
	const [selected, setSelected] = useState(null);

	useEffect(() => {
		if (props.onSelected)
			props.onSelected(selected !== null ? props.users[selected] : null);
	}, [selected]);

	return (
		<div style={{ height: '280px', width: '100%' }}>
				{!props.loading && props.users && <DataGrid
					style={{ border: 'none' }}
					columns={columns}
					rows={
						props.users.map(
							(elt:User, index: number) => buildRow(elt, index))}
					pageSize={15}
					rowsPerPageOptions={[15]}
					disableExtendRowFullWidth
					onSelectionModelChange={(a: number[]) => setSelected(a.length ? a[0] : null)}
				/>}
				{props.loading && <CircularProgress sx={{ display: 'block', margin: 'auto', color: "white" }} />}
				{!props.loading && !props.users && <Typography variant="h4">0 user to show</Typography>}
		</div>
	);
}


export default DataGridUsers;