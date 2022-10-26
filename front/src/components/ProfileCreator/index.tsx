import * as React from 'react';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import CircularProgress from "@mui/material/CircularProgress";

import WorldMap from "@components/WorldMap";
import LocationFieldSet from "@components/LocationFieldSet";

import './profile.less';

const steps = ['Please, choose a Profile.', 'Choose a name.', 'Choose a location.'];

type ProfileProps = {
	name: string;
	type: string;
	level?: number;
	fullSize?: boolean;
	location?: string;
	onClick?: any;
	actionText?: string,
};

type ProfileCreatorProps = {
	onClick?: any;
	listProfiles?: ProfileProps[];
	apiServer?: string;
	loadingConfirm?: boolean;
	errConfirm?: boolean;
};

const capitalize = (str: string) =>
	str.charAt(0).toUpperCase() + str.slice(1);

export const Profile = (props: ProfileProps) => {
	return (
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
			<Divider sx={{ background: '#dfdddd', mb: 2 }} />
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
	);
}

const ProfileCreator = (props: ProfileCreatorProps) => {
	const [activeStep, setActiveStep] = React.useState(0);
	const [location, setLocation] = React.useState(null);
	const [errorMsg, setErrorMsg] = React.useState('');
	const [profile, setProfile] = React.useState(null);
	const [name, setName] = React.useState('');

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	// params: { type: bla }
	const handleUpdate = (params: {[key: string]: string}) => {
		const profileCurrent = profile ? profile : {};
		const keyParams = Object.keys(params)[0];
		profileCurrent[keyParams] = params[keyParams];
		setProfile(profileCurrent);
		handleNext();
	}

	const handleConfirm = () => {
		setErrorMsg('');
		if (!profile.name) setErrorMsg('Name is missing');
		else if (!profile.type) setErrorMsg('Type is missing');
		else if (!profile.location) setErrorMsg('Location is missing');
		if (!profile.name || !profile.type || !profile.location) return false;

		const data = {
			name: profile.name,
			profile: profile.type,
			location: {
				name: profile.location.name,
        country: profile.location.country,
        lat: profile.location.lat,
        lng: profile.location.lng,
			}
		};

		if (props.onClick)
    	props.onClick(data);
	}

	return (
		<React.Fragment>
			<Stepper className="stepper" activeStep={activeStep}>
				{steps.map((label, index) => {
					const stepProps: { completed?: boolean } = {};
					const labelProps: {
						optional?: React.ReactNode;
					} = {};
					return (
						<Step key={label} {...stepProps}>
							<StepLabel {...labelProps}>{label}</StepLabel>
						</Step>
					);
				})}
			</Stepper>

			{activeStep === steps.length ? (
				<React.Fragment>
					<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
						<Profile
							name={profile.name + ' - ' + location.name}
							type={profile.type}
							level={1}
							fullSize
						/>
						<Box sx={{ 
							flex: 1,
							p: 5,
							m: 1,
							background: 'white',
							border: '1px solid #dfdddd',
							borderRadius: 5,
							color: 'black',
							height: 'fit-content',
						}}>
							<Container 
									maxWidth="xl"
									sx={{ mt: 2, mb: 6, textAlign: 'center' }}
								>
								{props.errConfirm && <Alert sx={{ background: '#933727', width: '100%', mb: 4 }} severity="error">{'Server request fail. Sorry for the inconvenience.'}</Alert>}
								{errorMsg && <Alert sx={{ background: '#933727', width: '100%', mb: 4 }} severity="error">{errorMsg}</Alert>}
								<Typography sx={{ fontSize: '22px' }}>Thank you for completing your profile.</Typography>
								<Typography sx={{ fontSize: '25px' }}>Do you confirm your choices ?</Typography>
							</Container>
							
							<Container 
									maxWidth="xl"
									sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}
								>
								<Button
									disabled={activeStep === 0}
									onClick={() => { 
										setErrorMsg('');
										handleBack();
									}}
									color="error"
									variant="contained"
								>
									Back
								</Button>
								<Button
									disabled={activeStep === 0}
									onClick={!props.loadingConfirm ? handleConfirm : () => {}}
									color="success"
									sx={{ color: 'white' }}
									variant="contained"
								>
									{!props.loadingConfirm && <span>Confirm</span>}
									{props.loadingConfirm && <CircularProgress size={22} sx={{ color: "white" }} />}
								</Button>
							</Container>
						</Box>
					</Box>
				</React.Fragment>
			) : (
				<React.Fragment>
					{activeStep === 0 && 
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
									//onClick={() => props.onClick(elt.type)}
									onClick={() => handleUpdate({ type: elt.type })}
								/>
							)}
						</Container>}
					{activeStep === 1 && 
						<Container
							maxWidth="xl"
						>
							<div style={{ display: 'flex' }}>
								<div style={{ flex: 1 }}>
									<TextField
										sx={{ background: "#222" }}
										defaultValue={name}
										required
										fullWidth
										id="account"
										label="Name"
										name="account"
										autoComplete="account"
										variant="filled"
										onChange={(e: { target: { value: string; }; }) => setName(e.target.value)}
									/>
								</div>
								<div style={{ marginLeft: '4px', padding: '5px', background: 'rgb(78, 78, 78)', display: 'flex', alignItems: 'center' }}>
									<Button
										sx={{ maxWidth: '150px' }}
										disabled={!(name.trim())}
										onClick={() => handleUpdate({ name })}
										variant="contained"
									>
										Next
									</Button>
								</div>
							</div>
						</Container>
					}
					{activeStep === 2 && 
						<Container
							maxWidth="xl"
						>
							<div style={{ display: 'flex' }}>
								<div style={{ flex: 1 }}>
									<LocationFieldSet
										url={props.apiServer}
										onChange={setLocation}
										defaultValue={location}
									/>
								</div>
								<div style={{ marginLeft: '4px', padding: '5px', background: 'rgb(78, 78, 78)', display: 'flex', alignItems: 'center' }}>
									<Button
										sx={{ maxWidth: '150px' }}
										disabled={!location}
										onClick={() => handleUpdate({ location })}
										variant="contained"
									>
										Next
									</Button>
								</div>
							</div>
							<div style={{ marginTop: '5px', background: '#233044', minHeight: '300px' }}>
								<Container>
									<WorldMap
										markers={
											location
											&& ([{
												markerOffset: 15,
												name: location.name,
												coordinates: [ 
													location.lng,
													location.lat
												],
											}])
										}
									/>
								</Container>
							</div>
						</Container>
					}
					<Container 
							maxWidth="xl"
							sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}
						>
						<Button
							disabled={activeStep === 0}
							onClick={handleBack}
							variant="contained"
						>
							Back
						</Button>
					</Container>
				</React.Fragment>
			)}
			</React.Fragment>
	);
}

export default ProfileCreator;