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
	displayDate,
} from "@utils/helpers";
import {
	translateImageSpecsToCss,
	nameTypeToken,
} from "@utils/gameEngine";

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemButton from '@mui/material/ListItemButton';
import ParkIcon from '@mui/icons-material/Park';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Tooltip from '@mui/material/Tooltip';

import '@utils/TypeToken.less';

type ListNftsProps = {
	nfts?: Nfts[];
	uris?: Uri[];
	address?: string;
	onAction?: Function;
	actionText?: string;
	onDelete?: Function;
};

type NftsIconProps = {
	nftTokenName: string;
	//uris?: Uri[];
	user?: string;
	tokenType?: string;
	tokenDate?: string | Date;
	tokenIssuer?: string;
	tokenOwner?: string;
	names?: {[key: string]: string};
	validity?: boolean;
};

const capitalize = (str: string) =>
	str.charAt(0).toUpperCase() + str.slice(1);

export const NftsIcon : React.FunctionComponent<NftsIconProps> = (props) => {
	const author = props.user && props.user === props.tokenIssuer 
		? 'you' 
		: props.tokenIssuer && props.names[props.tokenIssuer] 
		? props.names[props.tokenIssuer] 
		: props.tokenIssuer;
	const image = props.tokenType.split('#')[0];
	let child = 
		<Tooltip title={props.tokenType && nameTypeToken[image] ? capitalize(nameTypeToken[image].name) + ' by ' + author : 'Empty'} placement="bottom-start">
			<div className={`${props.validity ? "avatarToken" : "avatarToken notValid"} ${author != 'you' && props.tokenType ? " buyToken" : " ownToken"}`}>
				<Box 
					style={{ 
						margin: 'auto',
						filter: translateImageSpecsToCss(props.tokenType),
						WebkitFilter: translateImageSpecsToCss(props.tokenType),
						//MozFilter: translateImageSpecsToCss(props.tokenType),
						//OFilter: translateImageSpecsToCss(props.tokenType),
						//MsFilter: translateImageSpecsToCss(props.tokenType),
						//-moz-filter: translateImageSpecsToCss(props.tokenType),
						//-o-filter: translateImageSpecsToCss(props.tokenType),
						//-ms-filter: translateImageSpecsToCss(props.tokenType),
					}}
					className={"nftTokenMiddle middleType" 
						+ unPad(image) }
				></Box>
		  </div>
		</Tooltip>;

	return (
			<>
				{props.nftTokenName && <Link to={ '/nft/' + props.nftTokenName }>
					{child}
			  </Link>}
			  {!props.nftTokenName && child}
			</>
  );
}

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