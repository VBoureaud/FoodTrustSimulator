import React from "react";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import './profile.less';

type ProfileProps = {
	name: string;
	type: string;
	level?: number;
	fullSize?: boolean;
	location?: string;
	onClick?: any;
	actionText?: string,
};

type ProfileChooserProps = {
	onClick?: any;
	listProfiles?: ProfileProps[];
};


const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const Profile = (props: ProfileProps) => 
	<Box
		sx={{ 
			width: 300,
			background: 'white',
			border: '1px solid #dfdddd',
			borderRadius: 5,
			textAlign: 'center',
			pt: 3,
			m: 1,
			height: 'fit-content',
			position: 'relative',
			cursor: props.onClick ? 'pointer' : 'auto',
		}}
		onClick={props.onClick}
	>
		{props.level != null && <Box sx={{
			color: '#ffeded',
			background: '#313938',
			padding: '15px',
			borderBottomLeftRadius: '40px',
			borderBottomRightRadius: '40px',
			position: 'absolute',
			left: '20px',
			top: '0',
		}}>
				<span style={{ display: 'block', fontSize: '12px' }}>LVL</span>
				{props.level}
			</Box>}
		
		<Box className=
			{props.fullSize ? 'profileImg ' + props.type : 'profileMinImg ' + props.type + 'Min'}
		></Box>
		<Divider sx={{ background: '#dfdddd', mb: 2 }}/>
		<Box>
			{props.location && <Box sx={{ display: 'flex', 'flexWrap': 'wrap', justifyContent: 'center' }}>
				<Typography variant='h5' sx={{ mb: 1, color: 'black' }}>{capitalize(props.name)}</Typography>
				<Typography variant='h6' sx={{ ml: 1, mb: 1, color: 'black' }}>from {capitalize(props.location)}</Typography>
			</Box>}
			{!props.location && <Typography variant='h5' sx={{ mb: 1, color: 'black' }}>{capitalize(props.name)}</Typography>}
			
			{props.onClick 
				&& <Button sx={{ width: '100%' }}>
					{props.actionText ? props.actionText : 'Choose'}
				</Button>}
		</Box>
	</Box>

const ProfileChooser = (props: ProfileChooserProps) => (
	<React.Fragment>
	    <Container 
	      maxWidth="xl"
	      sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}
	    >
	    	{props.listProfiles && props.listProfiles.map((elt, index) => 
		    	<Profile 
		    		key={index}
		    		name={elt.name}
		    		type={elt.type}
		    		fullSize
		    		onClick={() => props.onClick(elt.type)}
		    	/>
	    	)}
	    </Container>
  	</React.Fragment>
)

export default ProfileChooser;