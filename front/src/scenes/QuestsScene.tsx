import React, { FC, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "redux";
import { Redirect } from "react-router-dom"; 
import { hot } from "react-hot-loader";

import { config } from "@config";
import { 
	displayDate,
	decodeHashURI,
} from "@utils/helpers";

import { AppState } from "@store/types";
import Template from "@components/Template";
import CustomizedProgressBars from "@components/CustomizedProgressBars";
import FireWork from "@components/FireWork";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Pagination from '@mui/material/Pagination';

// Faq
import { FaqModal } from "@components/Faq";
import BasicModal from "@components/Modal";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import {
	Notifications,
	Quest,
} from "@store/types/UserTypes";
import {
	Uri,
} from "@store/types/UriTypes";

import {
	logout,
	updateUser,
} from "@store/actions";

import {
	actionPoints,
	nameTypeToken,
	profilesGame,
	buildProgress,
} from "@utils/gameEngine";

import { 
	unPad,
	diffHoursDateNow,
} from "@utils/helpers";

// needed XRPL class 
if (typeof module !== "undefined") var xrpl = require('xrpl')

type Props = {};

const buildArray = (size: number) => Array.apply(null, Array(size)).map(function (x:number, i:number) { return i; })

const QuestsScene: React.FC<Props> = () => {
	const dispatch = useDispatch();
	const stateAccount = useSelector((state: AppState) => state.accountReducer);
	const stateUser = useSelector((state: AppState) => state.userReducer);
	const stateUri = useSelector((state: AppState) => state.uriReducer);
	const dispatchLogout = compose(dispatch, logout);
	const dispatchUpdateUser = compose(dispatch, updateUser);
	const [page, setPage] = React.useState(1);
	const [data, setData] = React.useState(null);
	const [warning, setWarning] = useState('');
	const [redirctTo, setRedirctTo] = useState(false);
	const [displayFireWork, setDisplayFireWork] = useState(false);
	const [pageSize, setPageSize] = React.useState(10);
	const [collection, setCollection] = React.useState(null);
	const [collectionQuest, setCollectionQuest] = React.useState([]);
	const [itemDetail, setItemDetail] = React.useState(null);
	const [helpBox, setHelpBox] = useState([]);

	useEffect(() => {
		if (!stateUser.user || !stateUser.user.name) {
			setRedirctTo(true);
		}
	});

	useEffect(() => {
		if (!data && stateUser.user && stateUser.user.quest)
			setData(stateUser.user.quest);

		if (!collection && stateUri.uris && stateUser.user)
			setCollection(
				stateUri.uris.filter(
					e => e.properties.owner === stateUser.user.address
						&& e.validity
						&& buildProgress(decodeHashURI(xrpl.convertHexToString(e.name)).date, e.properties.durability) > 0)
			);
	}, []);

	useEffect(() => {
		if (!stateUser.user || !collection)
			return ;

		getCollectionQuest();
	}, [collection]);

	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout>;;
		if (displayFireWork) {
			timeout = setTimeout(() => {
				setDisplayFireWork(false);
			}, 20000);
		}

		// like componentDidUnMount
		return () => clearTimeout(timeout);
	}, [displayFireWork]);

	useEffect(() => {
		if (!stateUser.loadingUpdate && data && stateUser.user && stateUser.user.quest) {
			// quest just won !
			if (data.length != 0 && data.length != stateUser.user.quest.length) {
				setDisplayFireWork(true);
			}
			setData(stateUser.user.quest);
		}
	}, [stateUser.loadingUpdate]);

	const handleQuest = () => {
		if (!stateUser.user || !stateUser.user.quest)
			return ;

		const questLimit = profilesGame[stateUser.user.type].questLimit;
		const lastWinDate = stateUser.user.quest.length > 1 ? stateUser.user.quest[1].winDate : null;
		const diffDate = diffHoursDateNow(lastWinDate);
		const canClaim = lastWinDate ? diffDate > questLimit : true;
		const warn = (diffDate > questLimit ? '' : (questLimit - Math.trunc(diffDate)) + '');
		setWarning(isNaN(parseInt(warn)) ? '' : warn);
		if (!stateUser.loadingUpdate && canClaim)
			dispatchUpdateUser({ quest: true });
	}

	// check with validity item
	const checkHaveItem = (item: string, collection: Uri[]) => {
		if (!collection) return false;
		for (let i = 0; i < collection.length; i++)
			if (collection[i].image.split('#')[0] == item) {
				return true;
			}
		return false;
	}

	const getCollectionQuest = () => {
		if (!stateUser.user || !stateUser.user.quest)
			return ;

		const currentQuest = stateUser.user.quest[0];
		const cQuest = [];
		for (let i = 0; i < currentQuest.tokenNeeded.length; i++)
			if (checkHaveItem(currentQuest.tokenNeeded[i], collection))
				cQuest.push(currentQuest.tokenNeeded[i]);
		
		// box item, decompilate
		const boxs = collection.filter((item: Uri) => item.image.split('#')[0] === '002001');
		for (let i = 0; i < boxs.length; i++) {
			const p = boxs[i].properties.parents.map((parent: string) => decodeHashURI(xrpl.convertHexToString(parent)).type);
			for (let j = 0; j < p.length; j++) {
				if (cQuest.indexOf(p[j]) === -1)
					cQuest.push(p[j]);	
			}
		}		
		setCollectionQuest(cQuest);
	}

	const checkIfInCollection = (e: any) => {
		if (collectionQuest.indexOf(e) !== -1)
			return '2px solid #66bb6a';
		return '2px solid #393988';
	}

	const handlePagination = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	const isFullQuest = stateUser.user && stateUser.user.quest && stateUser.user.quest[0].tokenNeeded.filter((e: string) => collectionQuest.indexOf(e) === -1).length === 0;
	const render =
		<Template
			isLogged={!!stateAccount.address}
			logout={dispatchLogout}
			user={stateUser.user}
		>
			<Container>
				<Grid container>
					<Grid item xs={12}>
						{helpBox && helpBox.length > 0 &&
							<FaqModal
								shouldInclude={helpBox}
								openDelay={0}
								onClose={() => setHelpBox([])}
							/>}

						<Box sx={{ mb: 1 }} onClick={() => setHelpBox([29])}>
							<HelpOutlineIcon sx={{ cursor: 'pointer', display: 'block', color: "#1936a6" }} />
						</Box>
						
						{displayFireWork && <Box
							sx={{
								position: 'fixed',
								top: 0,
								bottom: 0,
								left: 0,
								right: 0,
								zIndex: 1,
							}}
						>
							<FireWork />
						</Box>}
						{warning !== '' && <Box sx={{ background: 'tomato', padding: '5px', borderRadius: '8px', textAlign: 'center', mb: 1, mt: 1 }}>
							<Typography sx={{ color: 'white' }}>Limitation: you can ask for claim only in {warning} hours.</Typography>
						</Box>}
						{data && data.filter((elt: Quest, index: number) => index >= (page - 1) * pageSize && index < page * pageSize).map((elt: Quest, index: number) => 
							<Box key={index}>
								<Paper elevation={3} 
									sx={{ 
										minHeight: 170,
										paddingBottom: '15px',
										background: elt.winDate ? '#111' : '#010322',
										marginBottom: index == 0 && !isFullQuest ? '25px' : '5px',
									}}>
									<Box sx={{ 
										width: '100%',
										borderRadius: '4px',
										padding: '3px 10px',
										background: elt.winDate ? '#2f2e2e' : '#23234d',
										display: 'flex',
										flexWrap: 'wrap',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}>
										<Typography sx={{ flex: 4 }} variant="h6">Quest {elt.id + 1} <span style={{ fontSize: '12px' }}>{elt.winDate ? 'Won on ' + displayDate(parseInt(elt.winDate), true) : 'Get the items to win ' + actionPoints['questCompleted'] + 'xp'}</span></Typography>
										<Box sx={{ 
											flex: 1,
											textAlign: 'center',
											display: 'flex',
											alignItems: 'center',
											width: '100%' }}>
											<Typography sx={{ marginRight: '10px', fontSize: '14px' }}>{elt.winDate ? elt.tokenNeeded.length + '/' + elt.tokenNeeded.length : stateUser.user.quest[0].tokenNeeded.filter((e: string) => collectionQuest.indexOf(e) !== -1).length + '/' + elt.tokenNeeded.length}</Typography>
											<CustomizedProgressBars 
												progress={elt.winDate ? 100 : stateUser.user.quest[0].tokenNeeded.filter((e: string) => collectionQuest.indexOf(e) !== -1).length / elt.tokenNeeded.length * 100}
											/>
										</Box>
									</Box>
									<Box sx={{ 
										maxWidth: '710px',
										margin: 'auto',
										display: 'flex',
										overflowX: 'auto',
										justifyContent: 'flex-start',
										padding: '5px 20px',
										paddingBottom: '15px',

									}}>
										{elt.tokenNeeded.map(
											(e:string, i:number) =>
											<Tooltip
												key={i}
												title={nameTypeToken[e].name.replace(/^\w/, (c: string) => c.toUpperCase()).replace('_', ' ')} placement="top-start">
													<Box 
														onClick={() => index === 0 && page === 1 ? setItemDetail(e) : {}}
														sx={{ 
															background: '#11113c',//empty
															//background: '#ffedb9',//full
															//background: '#c89259',//full
															border: elt.winDate 
																? '2px solid #66bb6a'
																: checkIfInCollection(e),//empty
															//border: '1px solid #26ff3e',//full
															padding: '10px',
															borderRadius: '4px',
															width: 'fit-content',
															marginTop: '10px',
															marginRight: '10px',
															cursor: 'pointer',
														}}>
														<Box
															className={"nftTokenMiddle middleType" + unPad(e)}
														></Box>
													</Box>
											</Tooltip>)}
									</Box>
								</Paper>

								{index == 0 && isFullQuest && page === 1 &&
										<Paper elevation={3} sx={{ 
											padding: 2,
											background: '#010322',
											marginBottom: '25px',
										}}>
										<Box sx={{ display: 'flex', justifyContent: 'center' }}>
											<Button 
												onClick={handleQuest}
												sx={{ 
													color: 'white',
													background: warning ? 'tomato' : 'normal',
													'&:hover': {
														 background: warning ? 'tomato' : 'normal',
													},
												}}
												color="success"
												variant="contained">{
													!stateUser.loadingUpdate 
													? 'Reward Claim'
													: <CircularProgress size={30} sx={{ display: 'block', margin: 'auto', color: "white" }} />}
											</Button>
										</Box>
									</Paper>
								}

								{index == 0 && page === 1 && itemDetail &&
									<Box sx={{ flexGrow: 1, marginBottom: '15px' }}>
										<Grid container spacing={2} columns={{ xs: 4, sm: 12, md: 12 }}>
											<Grid item xs={5}>
												<Paper sx={{ background: '#ffedb9', minHeight: 280 }}>
													<Box
														style={{ 
															margin: 'auto',
															overflow: 'hidden',
															maxWidth: '100%',
														}}
														className={"nftToken type" + unPad(itemDetail)}></Box>
												</Paper>
											</Grid>

											<Grid item xs={7}>
												<Paper elevation={3} sx={{ wordBreak: 'break-word', /*minHeight: 280,*/ padding: 2 }}>
													<Box sx={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap' }}>
														<Box sx={{ width: '100%' }}>
																<Typography variant="h5">{nameTypeToken[itemDetail].name.replace(/^\w/, (c: string) => c.toUpperCase()).replace('_', ' ')}</Typography>
																<Typography>This item can be create by a 
																	<span style={{ 
																			background: 'black',
																			padding: '5px',
																			paddingRight: '28px',
																			margin: '5px',
																			borderRadius: '6px',
																			position: 'relative',
																		}}>
																		{nameTypeToken[itemDetail].profile.replace(/^\w/, (c: string) => c.toUpperCase())}
																		<span style={{ position: 'absolute', right: '2px', width: '22px', height: '22px' }} className={"type_"+ (nameTypeToken[itemDetail].profile) + "_navbar"}></span>
																	</span>
																</Typography>
																{nameTypeToken[itemDetail].percent !== undefined && <Typography>
																	When the success of a recipe is around {nameTypeToken[itemDetail].percent}%.
																</Typography>}
														</Box>
													</Box>
												</Paper>
											</Grid>
										</Grid>
									</Box>
								}
							</Box>
						)}

						{/* Pagination */}
						{data && data.length / pageSize > 1 && <Pagination
							count={Math.ceil(data.length / pageSize)}
							sx={{ 
								background: '#202b3c',
								display: 'flex',
								justifyContent: 'center',
								padding: '10px',
								borderRadius: '7px',
							}}
							onChange={handlePagination}
						/>}

					</Grid>
				</Grid>
			</Container>
		</Template>;

	return redirctTo ? <Redirect to="/profile" /> : render;
}

export default hot(module)(QuestsScene);