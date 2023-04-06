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

// Faq
import { FaqModal } from "@components/Faq";
import BasicModal from "@components/Modal";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import './profile.less';
import { PictureCreator } from "@components/Profile";
import { 
	actionPoints,
	limitGame,
	ProfilesGameType,
} from "@utils/gameEngine";

const winXpDesc = {
	acceptedOffer: {
		en: 'Sell a NFT',
		fr: 'Vendez un NFT',
	},
	buyOfferForSmallLevel: {
		en: 'Buy a NFT from a low level',
		fr: 'Achetez un NFT à un joueur de petit niveau',
	},
	mintToken: {
		en: 'Mint a new NFT',
		fr: 'Créez un nouveau NFT',
	},
	questCompleted: {
		en: 'Complete a quest',
		fr: 'Validez une quête',
	},
};

const steps = ['Please, choose a Profile.', 'Create your profile picture.', 'Choose a name.', 'Choose a location.'];
const stepsBurnOut = ['Please, choose a new Profile.', 'Create your profile picture.'];

// builded on ProfileScene
type ProfileProps = {
	name: string;
	type: string;
	description?: string;
	pocketSize?: number;
	typeCount?: number;
	typeRandom?: boolean;
	sell?: {
		farmer: number;
		manager: number;
		cook: number;
	};
	image?: string;
	level?: number;
	fullSize?: boolean;
	location?: string;
	onClick?: any;
	actionText?: string,
	sx?: object;
	disabled?: boolean;
};

type ProfileCreatorProps = {
	onClick?: any;
	listProfiles?: ProfileProps[];
	apiServer?: string;
	loadingConfirm?: boolean;
	errConfirm?: boolean;
	burnout?: boolean;
	currentProfile?: string;//when burnout
};

const capitalize = (str: string) =>
	str.charAt(0).toUpperCase() + str.slice(1);

export const Profile = (props: ProfileProps) => {
	return (
		<Box
			sx={{ 
				...props.sx,
				//width: 300,
				background: props.disabled ? '#d2d2d2' : 'white',
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


export const ProfileCreator = (props: ProfileCreatorProps) => {
	const [activeStep, setActiveStep] = React.useState(0);
	const [preSelectProfil, setPreSelectProfil] = React.useState('');
	const [location, setLocation] = React.useState(null);
	const [errorMsg, setErrorMsg] = React.useState('');
	const [profile, setProfile] = React.useState(null);
	const [name, setName] = React.useState('');
	const [helpBox, setHelpBox] = React.useState([]);

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		if (preSelectProfil) setPreSelectProfil('');
		else {
			setActiveStep((prevActiveStep) => prevActiveStep - 1);
		}
	};

	// params: { type: bla }
	const handleUpdate = (params: {[key: string]: string}) => {
		const profileCurrent = profile ? profile : {};
		const keyParams = Object.keys(params)[0];
		if (keyParams === 'type') {
			profileCurrent['image'] = params.image;
			setPreSelectProfil('');
		}
		profileCurrent[keyParams] = params[keyParams];
		setProfile(profileCurrent);
		handleNext();
	}

	const handleConfirm = () => {
		setErrorMsg('');
		if (!props.burnout && !profile.name) setErrorMsg('Name is missing');
		else if (!profile.type) setErrorMsg('Type is missing');
		else if (!props.burnout && !profile.location) setErrorMsg('Location is missing');
		if (!props.burnout && (!profile.name || !profile.type || !profile.location)) return false;
		if (props.burnout && (!profile.type || !profile.image)) return false;

		const data = {
			name: profile.name,
			type: profile.type,
			image: profile.image,
			location: !props.burnout ? {
				name: profile.location.name,
				country: profile.location.country,
				lat: profile.location.lat,
				lng: profile.location.lng,
			} : null,
		};

		if (props.onClick)
			props.onClick(data);
	}

	return (
		<React.Fragment>
			<Stepper className="stepper" activeStep={activeStep}>
				{!props.burnout && steps.map((label, index) => {
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
				{props.burnout && stepsBurnOut.map((label, index) => {
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

			{(!props.burnout && activeStep === steps.length) 
			|| (props.burnout && activeStep === stepsBurnOut.length) ? (
				<React.Fragment>
					<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
						{/*
						<Profile
							name={profile.name + ' - ' + location.name}
							type={profile.type}
							level={1}
							fullSize
						/>
						*/}

						<PictureCreator
							mode={0}
							imageDisplay={profile.image}
							level={props.burnout ? null : 1}
							type={profile.type}
							name={profile.name}
							location={location ? location.name : ''}
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
								{props.errConfirm && <Alert sx={{ background: '#933727', width: '100%', mb: 4 }} severity="error">{'Server request fail. Please try again later.'}</Alert>}
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
					{helpBox && helpBox.length > 0 &&
						<FaqModal
							shouldInclude={helpBox}
							openDelay={0}
							onClose={() => setHelpBox([])}
						/>}

					{activeStep === 0 && 
						<Container 
							maxWidth="xl"
							sx={{ display: 'flex', marginTop: '30px', flexWrap: 'wrap', justifyContent: 'space-around' }}
						>
							{!preSelectProfil && props.listProfiles && props.listProfiles.map((elt, index) => 
								<Profile
									key={index}
									name={elt.name}
									type={elt.type}
									disabled={props.burnout && elt.type === props.currentProfile}
									fullSize
									onClick={props.burnout && elt.type === props.currentProfile ? null : () => setPreSelectProfil(elt.name)}
								/>
							)}
							{preSelectProfil && 
								<Box sx={{ maxWidth: '930px', background: 'white', padding: 2, width: '100%', display: 'flex', flexWrap: 'wrap', marginLeft: '10px' }}>
									<Box sx={{ flex: 1 }}>
										<PictureCreator
											mode={0}
											imageDisplay={props.listProfiles.filter(elt => elt.name == preSelectProfil)[0].image}
											type={props.listProfiles.filter(elt => elt.name == preSelectProfil)[0].type}
										/>
									</Box>
									<Box sx={{ flex: 3, color: 'black', background: 'white', padding: 2, borderRadius: 5}}>
										<Typography variant='h5' sx={{ fontWeight: 'bold' }}>Profession Detail</Typography>
										<Box sx={{ mt: 1 }}>
											<Typography variant='body1'>Profession name : <span style={{ fontSize: '22px' }}>{props.listProfiles.filter(elt => elt.name == preSelectProfil)[0].type}</span></Typography>
											<Typography variant='body1'>Description : {props.listProfiles.filter(elt => elt.name == preSelectProfil)[0].description}</Typography>
										</Box>

										<Box sx={{ mt: 1 }}>
											<Typography sx={{ fontWeight: 'bold' }} variant='body1'>Specifications:</Typography>
											<Typography variant='body1'>Pocket capacity : {props.listProfiles.filter(elt => elt.name == preSelectProfil)[0].pocketSize} items</Typography>
											{/*<Typography variant='body1'>Random Token : {props.listProfiles.filter(elt => elt.name == preSelectProfil)[0].typeRandom ? 'True' : 'False'}</Typography>*/}
											<Typography variant='body1'>Number of NFT (ingredient/recipe) you can create : {props.listProfiles.filter(elt => elt.name == preSelectProfil)[0].typeCount}</Typography>
										</Box>

										{/* todo check & remove - <Box sx={{ mt: 1 }}>
											<Typography sx={{ fontWeight: 'bold' }} variant='body1'>Sell bonus:</Typography>
											<Typography variant='body1'>Sell to farmer, bonus {props.listProfiles.filter(elt => elt.name == preSelectProfil)[0].sell.farmer}%</Typography>
											<Typography variant='body1'>Sell to manager, bonus {props.listProfiles.filter(elt => elt.name == preSelectProfil)[0].sell.manager}%</Typography>
											<Typography variant='body1'>Sell to cook, bonus {props.listProfiles.filter(elt => elt.name == preSelectProfil)[0].sell.cook}%</Typography>
										</Box>*/}

										<Divider sx={{ background: '#dfdddd', mb: 2, mt: 2 }} />
										<Box sx={{ mt: 1 }}>
											<Typography sx={{ textAlign: 'center', fontWeight: 'bold' }} variant='body1'>Main goal: be the first level {limitGame.maxLevel}</Typography>
										</Box>
										<Box sx={{ mt: 1 }}>
											<Typography sx={{ fontWeight: 'bold' }} variant='body1'>How to earn XP ?</Typography>
											<Typography variant="body1">
												{winXpDesc['mintToken'].en}: <span style={{ fontSize: '22px' }}>{actionPoints.mintToken}</span>xp<br />
												{winXpDesc['acceptedOffer'].en}: <span style={{ fontSize: '22px' }}>{actionPoints.acceptedOffer}</span>xp<br />
												{winXpDesc['buyOfferForSmallLevel'].en}: <span style={{ fontSize: '22px' }}>{actionPoints.buyOfferToSmallLevel}</span>xp<br />
												{winXpDesc['questCompleted'].en}: <span style={{ fontSize: '22px' }}>{actionPoints.questCompleted}</span>xp*<br />
												<span style={{ fontSize: '14px' }}>*Can be more: Each ingredient power is a multiplier.</span>
											</Typography>
										</Box>

										<Box sx={{ display: 'flex', mt: 5, justifyContent: 'center' }}>
											<Button
												onClick={() => handleUpdate({ 
													type: props.listProfiles.filter(elt => elt.name == preSelectProfil)[0].type,
													image: props.listProfiles.filter(elt => elt.name == preSelectProfil)[0].image
												})}
												sx={{ color: 'white' }}
												variant="contained"
											>
												Confirm
											</Button>
										</Box>
									</Box>
								</Box>
							}
						</Container>}
					{activeStep === 1 && 
						<Container 
							maxWidth="xl"
							sx={{ background: '#34312e', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}
						>	
							<PictureCreator
								mode={1}
								imageDisplay={profile.image}
								onConfirm={(image: string) => handleUpdate({ image })}
							/>
						</Container>}
					{activeStep === 2 && 
						<Container
							maxWidth="xl"
							sx={{ marginTop: '30px', }}
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
					{activeStep === 3 && 
						<Container
							maxWidth="xl"
							sx={{ marginTop: '30px', }}
						>
							<Box
								sx={{ mb: 1 }}
								onClick={() => setHelpBox([15])}>
									<HelpOutlineIcon sx={{ 
										cursor: 'pointer',
										display: 'block',
										color: "#a6b3e3",
										background: '#3c3c88',
										borderRadius: '30px',
									}} />
							</Box>
							<div style={{ display: 'flex' }}>
								<div style={{ flex: 1, position: 'relative' }}>
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
										circleMarker
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
							disabled={activeStep === 0 && preSelectProfil === ''}
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