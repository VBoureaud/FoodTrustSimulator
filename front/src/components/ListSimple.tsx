import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

type ListSimpleProps = {
	listStr?: React.ReactElement[],
	background?: string;
	showEmpty: boolean;
};

const ListSimple : React.FunctionComponent<ListSimpleProps> = (props) => {
	return (
		<List sx={{ padding: 0, maxHeight: '100%', overflowX: 'hidden' }}>
			{props.listStr && props.listStr.map((elt, index) => 
			    <ListItem key={index} sx={{ overflowX: 'auto', m: 1, p: { xs: 2, md: 0 }, pl: { xs: 1, md: 1 }, ":hover": { bgcolor: '#18212f' }, bgcolor: props.background ? props.background : 'background.paper' }}>
				    <ListItemText primary={elt} />
			  	</ListItem>
			)}
			{props.showEmpty && (!props.listStr || !props.listStr.length) && 
				<ListItem sx={{ overflowX: 'auto', m: 1, color: 'white', bgcolor: 'background.paper' }}>
				    <ListItemText primary={'List'} secondary={'is empty'} />
				</ListItem>}
		</List>
	);
}

export default ListSimple;