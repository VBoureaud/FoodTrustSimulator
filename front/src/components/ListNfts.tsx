import React from 'react';
import { Link } from "react-router-dom";

import { 
	Nfts
} from '@store/types/AccountTypes';
import { 
	Uri
} from '@store/types/UriTypes';
import { 
	decodeHashURI,
	unPad,
	getTypeFromToken,
	getDateFromToken,
	getAddrFromToken,
} from "@utils/helpers";

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemButton from '@mui/material/ListItemButton';
import ParkIcon from '@mui/icons-material/Park';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import '@utils/TypeToken.less';

type ListNftsProps = {
	nfts?: Nfts[];
	uris?: Uri[];
	onAction?: Function;
	actionText?: string;
	address?: string;
	onDelete?: Function;
};

const ListNfts : React.FunctionComponent<ListNftsProps> = (props) => {
	return (
		<List sx={{ maxHeight: '70vh', overflowX: 'hidden', overflowY: 'auto' }}>
			{props.nfts && props.nfts.map((elt, index) => 
				<Link key={index} to={ '/nft/' + elt.NFTokenID }>
				    <ListItem sx={{ m: 1, ":hover": { bgcolor: '#393939' }, bgcolor: 'background.paper' }}>
				    	<ListItemAvatar sx={{ minWidth: '30px' }}>
				      		{index}
				    	</ListItemAvatar>
					    <ListItemAvatar>
					      <Avatar sx={{ background: '#faf8eb' }}>
					      	{props.uris && <Box 
					      		sx={{ m: 'auto' }}
					      		className={"nftTokenMin minType" 
					      			+ getTypeFromToken(elt.NFTokenID, props.uris)}
							></Box>}
							{!props.uris && <ParkIcon sx={{ color: 'black' }}/>}
					      </Avatar>
					    </ListItemAvatar>
					    {props.uris 
					    	&& <ListItemText 
					    			primary={'Created:' 
					    				+ getDateFromToken(elt.NFTokenID, props.uris) 
					    				+ ' by ' 
					    				+ (getAddrFromToken(elt.NFTokenID, props.uris) == props.address ? 'you' : getAddrFromToken(elt.NFTokenID, props.uris))}
					    			secondary={'Id:' + elt.NFTokenID}
					    		/>}
					    {!props.uris && <ListItemText primary={'URI:' + elt.URI} secondary={'Id:' + elt.NFTokenID} />}
					    
					    {props.onDelete && <ListItemButton onClick={() => props.onDelete(elt.NFTokenID)} sx={{ maxWidth: '55px', mr: 2 }}>
					      <RemoveCircleOutlineIcon sx={{ color: '#424242' }}/>
					    </ListItemButton>}
					    {props.actionText && <ListItemButton onClick={() => props.onAction(elt.NFTokenID)} sx={{ background: 'rgba(255, 255, 255, 0.08)', maxWidth: '90px', mr: 2 }}>
					    	{props.actionText}  
					    </ListItemButton>}
				  	</ListItem>
				</Link>
			)}
			{(!props.nfts || !props.nfts.length) && 
				<ListItem sx={{ m: 1, color: 'white', bgcolor: 'background.paper' }}>
				    <ListItemText primary={'Collection'} secondary={'is empty'} />
				</ListItem>}
		</List>
	);
}

export default ListNfts;