import React from 'react';

import { 
	Offers
} from '@store/types/NftTypes';

import { 
  Uri,
} from "@store/types/UriTypes";

import { 
	User
} from '@store/types/UserTypes';

import { displayDate } from '@utils/helpers';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';

if (typeof module !== "undefined") var xrpl = require('xrpl')

type ListOffersProps = {
	doOfferTitle: string;
	doCancelTitle: string;
	canDoOffer: boolean;
	establishedOffer: boolean;
	listOffers: Offers[];
	canGetOffer: boolean;
	getOfferTitle: string;
	handleGetOffer: Function;
	handleMakeOffer: Function;
	handleCancelOffer: Function;
	emptyTitle: string;
	currentAddr: string;
	users?: User[];
	uriInfo: Uri;
};

const getDateFromOffer = (listOfferGameServer: string[], offerOnChain: Offers) => {
	const offerOnServer = listOfferGameServer.filter((e: string) => e.split('_')[0] === offerOnChain.owner && e.split('_')[1] == offerOnChain.amount);
	if (!offerOnServer || !offerOnServer[0]) return null;
	return parseInt(offerOnServer[0].split('_')[2]);
}

const ListOffers : React.FunctionComponent<ListOffersProps> = (props) => {
	const getName = (user: User | null, byDefault: string) => user ? user.name : byDefault;
	const getUserName = (address: string) => props.users ? getName(props.users.filter((e: User) => e.address === address)[0], address) : address;
	return (
		<div style={{ width: '100%' }}>
			{props.canDoOffer 
        && <Box sx={{ width: '100%', position: 'relative', bottom: '32px', display: 'flex', justifyContent: 'flex-end' }}>
        {!props.establishedOffer && <Button sx={{ background: '#256dbc' }} onClick={() => props.handleMakeOffer()} variant="contained">
          {props.doOfferTitle}
        </Button>}

        {props.establishedOffer && <Button sx={{ background: '#256dbc' }} onClick={() => props.handleCancelOffer(props.listOffers)} variant="contained">
          {props.doCancelTitle}
        </Button>}
    	</Box>}

			<List sx={{ width: '100%', maxHeight: '300px', overflowX: 'hidden', overflowY: 'auto' }}>
				{props.listOffers && props.listOffers.map((elt, index) => 
					<ListItem sx={{ mb: 1, background: '#212121', wordBreak: 'break-word' }} key={index}>
						<ListItemText sx={{ display: 'flex', flexWrap: 'wrap' }}>
							<Typography sx={{ fontSize: '24px' }}>
								<strong>{xrpl.dropsToXrp(elt.amount)}</strong>
								<span style={{ fontSize: '14px', marginLeft: '1px' }}>XRP</span>
								<span style={{ fontSize: '12px' }}> by </span>
								<Tooltip placement="top-start" title={elt.owner}>
										{/*<strong>{elt.owner === props.currentAddr ? 'you' : getUserName(elt.owner)}</strong>*/}
										<strong style={{ fontSize: '18px' }}>{getUserName(elt.owner)}</strong>
								</Tooltip>
							</Typography>
							<Typography style={{ fontSize: '12px', display: 'block' }}>{
									displayDate(
										getDateFromOffer([
											...props.uriInfo.properties.offerBuy,
											...props.uriInfo.properties.offerSell
										], elt),
										true
									)
								}
							</Typography>
						</ListItemText>
						{props.canGetOffer && elt.owner != props.currentAddr && <ListItemButton onClick={() => props.handleGetOffer(elt.nft_offer_index)} sx={{ padding: 1, borderRadius: '5px', border: '1px solid grey', justifyContent: 'center' }}>
							{props.getOfferTitle}
						</ListItemButton>}
					</ListItem>)}
					{!props.listOffers && 
						<ListItem sx={{ mb: 1, background: '#212121', wordBreak: 'break-word' }}>
							<ListItemText>
								{props.emptyTitle}
							</ListItemText>
					</ListItem>}
			</List>
		</div>
	);
}

export default ListOffers;