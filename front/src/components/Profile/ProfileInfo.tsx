import * as React from 'react';

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CustomizedProgressBars from "@components/CustomizedProgressBars";
import CircularProgress from '@mui/material/CircularProgress';

import { 
	levelDisplay,
	calculNextLevel,
	calculPrevLevel,
	doProgress,
} from "@utils/gameEngine";

type ProfileInfoProps = {
	loading: boolean;
	experience: number;
	collection: number;
	pocket: number;
	offersValidated: number;
	minted: number;
	burned: number;
};

const lang = {
	'en': {
		'nextLevel': 'Next Level:',
	},
	'fr': {
		'nextLevel': 'Prochain niveau:',
	}
};

export const ProfileInfo = (props: ProfileInfoProps) => {
	return (
		<Box 
			sx={{ 
				flex: 1,
				p: 5,
				m: 1,
				background: 'white',
				border: '1px solid #dfdddd',
				borderRadius: 5,
				color: 'black',
			}}>
			<Typography sx={{ mt: 2 }}>{lang['en'].nextLevel}</Typography>
			<CustomizedProgressBars 
				progress={doProgress(props.experience)}
				showValue={calculNextLevel(props.experience) - props.experience}
			/>
			<Typography variant="body1" sx={{ textAlign: 'center', mt: 1, fontSize: '15px' }}>
				{props.experience} / {calculNextLevel(props.experience)}
			</Typography>

			<Box sx={{ mt: 5, alignItems: 'center', display: 'flex' }}>
				<Typography>Collection:</Typography>
				{!props.loading && <Typography sx={{ ml: 1 }} variant='h4'>{props.collection}</Typography>}
				{props.loading && <CircularProgress size={20} sx={{ display: 'block', margin: 'auto', color: "black" }} />}
			</Box>

			<Box sx={{ mt: 5, alignItems: 'center', display: 'flex' }}>
				<Typography>Pocket size:</Typography>
				{!props.loading && <Typography sx={{ ml: 1 }} variant='h4'>{props.pocket}</Typography>}
				{props.loading && <CircularProgress size={20} sx={{ display: 'block', margin: 'auto', color: "black" }} />}
			</Box>

			<Box sx={{ mt: 5, alignItems: 'center', display: 'flex' }}>
				<Typography>Validated offers:</Typography>
				{!props.loading && <Typography sx={{ ml: 1 }} variant='h4'>{props.offersValidated}</Typography>}
				{props.loading && <CircularProgress size={20} sx={{ display: 'block', margin: 'auto', color: "black" }} />}
			</Box>

			<Box sx={{ mt: 5, alignItems: 'center', display: 'flex' }}>
				<Typography>Token minted:</Typography>
				{!props.loading && <Typography sx={{ ml: 1 }} variant='h4'>{props.minted}</Typography>}
				{props.loading && <CircularProgress size={20} sx={{ display: 'block', margin: 'auto', color: "black" }} />}
			</Box>

			<Box sx={{ mt: 5, alignItems: 'center', display: 'flex' }}>
				<Typography>Token burned:</Typography>
				{!props.loading && <Typography sx={{ ml: 1 }} variant='h4'>{props.burned}</Typography>}
				{props.loading && <CircularProgress size={20} sx={{ display: 'block', margin: 'auto', color: "black" }} />}
			</Box>
		</Box>
	);
}