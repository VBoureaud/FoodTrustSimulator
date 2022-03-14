import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

type ListSimpleProps = {
	listStr?: string[],
};

const ListSimple : React.FunctionComponent<ListSimpleProps> = (props) => {
	return (
		<List sx={{ maxHeight: '100%', overflowX: 'hidden', overflowY: 'auto' }}>
			{props.listStr && props.listStr.map((elt, index) => 
			    <ListItem key={index} sx={{ m: 1, ":hover": { bgcolor: '#393939' }, bgcolor: 'background.paper' }}>
				    <ListItemText primary={elt} />
			  	</ListItem>
			)}
			{(!props.listStr || !props.listStr.length) && 
				<ListItem sx={{ m: 1, color: 'white', bgcolor: 'background.paper' }}>
				    <ListItemText primary={'List'} secondary={'is empty'} />
				</ListItem>}
		</List>
	);
}

export default ListSimple;