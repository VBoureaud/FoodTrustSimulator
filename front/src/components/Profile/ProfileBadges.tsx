import React, { useState, useEffect } from 'react';

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';

import { 
	obj1HaveOrSupObj2,
} from "@utils/helpers";

import {
	badgeCondition,
	badgeDesc,
} from "@utils/gameEngine";

type DataPlayer = {
	collection: number;
	transaction: number;
	pocket: number;
	minted: number;
	burned: number;
	quests: number;
	firstScore: number;
	beginnerHelp: number;
	burnout: number;
	level: number;

};
type ProfileBadgesProps = {
	dataPlayer: DataPlayer;
	loading: boolean;
};

const lang = {
	'en': {
		'title': 'Badges Collection:',
	},
	'fr': {
		'title': 'Collection de Badges:',
	}
};

export const ProfileBadges = (props: ProfileBadgesProps) => {
	const [badges, setBadges] = useState(null);
	
	useEffect(() => {
		const badgeArr = [];
		const badgeKeys = Object.keys(badgeCondition);
		for (let i = 0; i < badgeKeys.length; i++) {
			if (obj1HaveOrSupObj2(props.dataPlayer, badgeCondition[badgeKeys[i]]))
				badgeArr.push(badgeKeys[i]);
		}
		if (badgeArr.length)
			setBadges(badgeArr);
	}, [props.loading, props.dataPlayer])

	return (
		<Box sx={{ 
			flex: 1,
			p: 3,
			m: 1,
			background: 'white',
			border: '1px solid #dfdddd',
			borderRadius: 5,
			color: 'black',
			maxHeight: '612px',
			minWidth: '205px',
			overflow: 'auto',
		}}>
			<Box sx={{ alignItems: 'center', display: 'flex', ml: 2 }}>
				<Typography>{lang['en'].title}</Typography>
				<Typography sx={{ display: 'flex', flexWrap: 'wrap', ml: 1 }} variant='h4'>{(badges ? badges.length : 0) + "/" + Object.keys(badgeDesc).length}</Typography>
			</Box>
			
			{props.loading && <CircularProgress size={40} sx={{ display: 'block', margin: 'auto', mt: 4, color: "black" }} />}
			
			{!props.loading && <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap' }}>
				{badges && badges.map((elt: string, index: number) => 
					<Tooltip key={index} title={badgeDesc[elt]}>
						<Box className={"badge badge" + elt}>
						</Box>
					</Tooltip>)}
			</Box>}
		</Box>
	);
}