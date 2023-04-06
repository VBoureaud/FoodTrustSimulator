import React from 'react';
import { Link } from "react-router-dom";

import { 
	Uri
} from '@store/types/UriTypes';
import { decodeHashURI, unPad, displayDate } from "@utils/helpers";
import {
	translateImageSpecsToCss,
} from "@utils/gameEngine";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import '@utils/TypeToken.less';

// needed XRPL class 
if (typeof module !== "undefined") var xrpl = require('xrpl')

type OpenMarketNotifProps = {
	uris?: Uri[];
	owner?: string;
};

type OpenMarketProps = {
	uris?: Uri[];
	owner?: string;
};

export const OpenMarketNotif : React.FunctionComponent<OpenMarketNotifProps> = (props) => {
	const buyOffer = props.owner && props.uris && props.uris.length > 0 ? props.uris.filter(e => e.properties.owner == props.owner && e.properties.offerBuy.length > 0) : [];
	return (
		<Box>
			{buyOffer && buyOffer.length > 0 && <Link to={ '/' }>
				<Box 
					sx={{
					  //border: '1px solid #9488ec',
					  borderRadius: '4px',
					  background: '#80c4cd',
					  color: '#fff',
					  textAlign:' center',
					  margin: '0 10px',
					  padding: '5px',
					}}>
					<Typography>You have received offers for your NFTs.</Typography>
				</Box>
			</Link>}
		</Box>
	);
}

const OpenMarket : React.FunctionComponent<OpenMarketProps> = (props) => {
	const buyOffer = props.owner && props.uris && props.uris.length > 0 ? props.uris.filter(e => e.properties.owner == props.owner && e.properties.offerBuy.length > 0) : [];
	return (
		<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
			{buyOffer && buyOffer.length > 0 && buyOffer.map((elt, index) => 
				<Link key={index} to={ '/nft/' + elt.name }>
					<Box sx={{ 
						background: '#faf8eb',
						margin: '5px',
						//paddingTop: '10px',
						padding: '10px 30px',
						borderRadius: '4px',
						color: 'black',
						//maxHeight: '200px',
						//maxWidth: '255px',
						wordBreak: 'break-word',
						flex: 1,
					}}>
						<Box 
							sx={{ m: 'auto' }}
							style={{ 
								margin: 'auto',
								filter: translateImageSpecsToCss(elt.image),
								WebkitFilter: translateImageSpecsToCss(elt.image),
							}}
							className={"nftTokenMiddle middleType" 
							+ unPad(decodeHashURI(xrpl.convertHexToString(elt.name)).type)}
						></Box>
						<Box sx={{ flexDirection: 'row', justifyContent: 'center', display: 'flex', flexWrap: 'wrap', alignItems: 'baseline' }}>
							<Typography sx={{ fontSize: '38px' }} variant="h2">{elt.properties.offerBuy.length}</Typography>
							<Typography variant="h6">bid{elt.properties.offerBuy.length > 1 ? 's' : ''}</Typography>
						</Box>
					</Box>
				</Link>
			)}

			{!buyOffer.length &&
				<Box sx={{ margin: 'auto', mt: 7 }}>
					<Typography variant="h6">No bid offer at the moment.</Typography>
				</Box>}
		</Box>
	);
}

export default OpenMarket;
