import React from 'react';
import { Link } from "react-router-dom";

import { 
	Uri
} from '@store/types/UriTypes';
import { decodeHashURI, unPad, displayDate } from "@utils/helpers";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import '@utils/TypeToken.less';

type OpenMarketProps = {
	uris?: Uri[];
	owner?: string;
	onClick?: Function;
};

const OpenMarket : React.FunctionComponent<OpenMarketProps> = (props) => {
	const buyOffer = props.owner && props.uris && props.uris.length > 0 ? props.uris.filter(e => e.properties.owner == props.owner && e.properties.offerBuy.length > 0) : [];
	return (
		<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
			{buyOffer && buyOffer.length > 0 && buyOffer.map((elt, index) => 
				<Link key={index} to={ '/nft/' + elt.properties.nftToken }>
					<Box sx={{ 
						background: '#faf8eb',
						margin: '5px',
						paddingTop: '10px',
						borderRadius: '4px',
						color: 'black',
						height: '200px',
						width: '255px',
						wordBreak: 'break-word',
					}}>
						<Box 
				      		sx={{ m: 'auto' }}
				      		className={"nftTokenMiddle middleType" 
				      			+ unPad(decodeHashURI(elt.name).type)}
						></Box>
						<Box sx={{ justifyContent: 'center', display: 'flex', flexWrap: 'wrap', alignItems: 'baseline' }}>
							<Typography variant="h2">{elt.properties.offerBuy.length}</Typography>
							<Typography variant="h6">proposal{elt.properties.offerBuy.length > 1 ? 's' : ''}</Typography>
						</Box>
					</Box>
				</Link>
			)}

			{!buyOffer.length &&
				<Box sx={{ margin: 'auto', mt: 7 }}>
                  <Typography variant="h6">No open market yet.</Typography>
                </Box>}
		</Box>
	);
}

export default OpenMarket;
