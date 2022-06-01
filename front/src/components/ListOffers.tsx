import React from 'react';

import { 
	Offers
} from '@store/types/NftTypes';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
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
};

const ListOffers : React.FunctionComponent<ListOffersProps> = (props) => {
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
						<ListItemText>
							<Typography sx={{ fontSize: '24px' }}>
								<strong>{xrpl.dropsToXrp(elt.amount)}</strong>
								<span style={{ fontSize: '14px', marginLeft: '2px' }}> XRP</span>
								<span style={{ fontSize: '12px' }}> by <strong>{elt.owner === props.currentAddr ? 'you' : elt.owner}</strong></span>
							</Typography>
						</ListItemText>
						{props.canGetOffer && elt.owner != props.currentAddr && <ListItemButton onClick={() => props.handleGetOffer(elt.nft_offer_index)} sx={{ maxWidth: '155px', mr: 2 }}>
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