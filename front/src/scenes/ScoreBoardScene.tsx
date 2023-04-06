import React, { FC, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "redux";
import { Redirect } from "react-router-dom"; 
import { hot } from "react-hot-loader";

import { config } from "@config";
import { 
	displayDate,
	buildArray,
} from "@utils/helpers";

import { AppState } from "@store/types";
import Template from "@components/Template";
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';

import { AreaChart } from '@components/AreaChart';

import {
	Notifications,
	User,
} from "@store/types/UserTypes";

import { 
	logout,
} from "@store/actions";

import {
	levelDisplay,
	calculNextLevel,
	levelToXp,
	actionPoints,
} from '@utils/gameEngine';

import './ScoreBoardScene.less';

type Props = {};

const ScoreBoardScene: React.FC<Props> = () => {
	const dispatch = useDispatch();
	const stateAccount = useSelector((state: AppState) => state.accountReducer);
	const stateUser = useSelector((state: AppState) => state.userReducer);
	const dispatchLogout = compose(dispatch, logout);
	const [redirctTo, setRedirctTo] = useState(false);
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = React.useState(20);

	useEffect(() => {
		if (!stateUser.user || !stateUser.user.name) {
			setRedirctTo(true);
		}
	})

	const handlePagination = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value - 1);
	};

	const orderColor: {[key: number]: string} = {
		0: "#f8ff14",
		1: "#ff670c",
		2: "#ff670c",
		3: "#ff2f2f",
		4: "#ff2f2f",
		5: "#6faeff",
		6: "#6faeff",
	};

	const ordinalNumber: {[key: number]: string} = {
		1: 'st',
		2: 'nd',
		3: 'rd',
		4: 'th',
	};

	const orderedUsers = stateUser.users && stateUser.users.results ? stateUser.users.results.slice().sort((a, b) => b.experience - a.experience) : [];

	const render =
		<Template
			noContainer
			className="backgroundAnimation2"
			isLogged={!!stateAccount.address}
			logout={dispatchLogout}
			user={stateUser.user}
		>
			<Container sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5, mb: 5 }}>
				<span className="decorationBackgroundScoreBoard"></span>
				<Grid container sx={{ zIndex: 2, }}>
					<Typography sx={{ margin: 'auto' }} className="titleScoreBoard">Be the first level 100</Typography>
					<Paper sx={{ width: '95%', marginTop: '5px', overflowX: 'auto' }} className="paperScore">
							<Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '530px' }}>
								<Typography sx={{ 
									color: '#61ff14',
									background: 'none!important',
								}} className="lineScoreBoard">
									<span>Rank</span>
									<span>Player name</span>
									<span>Score</span>
									<span>Level</span>
								</Typography>

								{orderedUsers.filter((elt: User, num: number) => num >= page * pageSize && num < (page + 1) * pageSize).map((user, index) => 
									<Typography 
										key={index + page * pageSize}
										sx={{ 
											color: orderColor[index + page * pageSize] ? orderColor[index + page * pageSize] : orderColor[Object.keys(orderColor).length - 1],
										}}
										className="lineScoreBoard">
										<span>{(index + page * pageSize) + 1}{ordinalNumber[(index + page * pageSize) + 1] ? ordinalNumber[(index + page * pageSize) + 1] : ordinalNumber[Object.keys(ordinalNumber).length - 1]}</span>
										<span>{user.name}</span>
										<span>{user.experience}</span>
										<span>{levelDisplay(user.experience)}</span>
									</Typography>
								)}

								{/* Pagination */}
								{orderedUsers && orderedUsers.length / pageSize > 1 && <Pagination
									count={Math.ceil(orderedUsers.length / pageSize)}
									sx={{ 
										background: '#202b3c',
										display: 'flex',
										justifyContent: 'center',
										padding: '10px',
										borderRadius: '7px',
									}}
									onChange={handlePagination}
								/>}
							</Box>
						</Paper>
				</Grid>
			</Container>
			<Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mb: 5 }}>
				<Grid container sx={{  zIndex: 2, }}>
					<Typography sx={{ margin: 'auto' }} className="titleScoreBoard">
						How much XP do you need ?
					</Typography>
					<Paper sx={{ width: '95%', marginTop: '5px' }} className="paperScore">
						<AreaChart
							style={{ 
								width: '100%',
								height: '100%',
							}}
							labels={buildArray(101)}
							data={buildArray(101).map((e: number) => parseInt(levelToXp(e) + ''))}
							title={"test"}
						/>
					</Paper>
				</Grid>
			</Container>
			<Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',  mb: 5 }}>
				<Grid container sx={{  zIndex: 2, }}>
					<Typography sx={{ margin: 'auto' }} className="titleScoreBoard">
						How to earn XP ?
					</Typography>
					<Paper sx={{ width: '95%', marginTop: '5px' }} className="paperScore">
						<Typography sx={{ padding: '15px', textAlign: 'center' }}>
							Play to earn experience and win new <strong>levels</strong> & <strong>badges</strong>.<br />
						</Typography>
						<Typography sx={{ textAlign: 'center' }}>
							Mint a new NFT: <span style={{ fontSize: '22px' }}>{actionPoints.mintToken}</span>xp<br />
							Sell a NFT: <span style={{ fontSize: '22px' }}>{actionPoints.acceptedOffer}</span>xp<br />
							Buy a NFT from a low level: <span style={{ fontSize: '22px' }}>{actionPoints.buyOfferToSmallLevel}</span>xp<br /><br />
							Complete a quest: <span style={{ fontSize: '22px' }}>{actionPoints.questCompleted}</span>xp*<br />
							<span style={{ fontSize: '14px' }}>*Can be more: Each ingredient power is a multiplier.</span>
						</Typography>
						<span style={{
							background: '#fff9f9',
							height: '2px',
							width: '33px',
							display: 'block',
							margin: '25px auto',
						}}></span>
						<Typography sx={{ marginBottom: '17px', textAlign: 'center' }}>
							Good Luck !
						</Typography>
					</Paper>
				</Grid>
			</Container>
		</Template>;

	return redirctTo ? <Redirect to="/profile" /> : render;
}

export default hot(module)(ScoreBoardScene);