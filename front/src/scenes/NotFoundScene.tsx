import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { compose } from "redux";

import Box from '@mui/material/Box';
import Template from "@components/Template";
import Typography from '@mui/material/Typography';

type NotFoundProps = {};

import { 
  AppState,
} from "@store/types";

import {
  logout,
} from "@store/actions";

const NotFoundScene : React.FunctionComponent<NotFoundProps> = () => {
	const dispatch = useDispatch();
	const stateUser = useSelector((state: AppState) => state.userReducer);
	const stateAccount = useSelector((state: AppState) => state.accountReducer);
	const dispatchLogout = compose(dispatch, logout);

	return (
		<Template
			isLogged={!!stateAccount.address}
			logout={dispatchLogout}
			user={stateUser.user}
		>
			<Box sx={{ display: 'flex', width: '100%', height: 'calc(100vh - 230px)', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
				<Typography variant="h1" sx={{ color: 'black', textAlign: 'center' }}>404</Typography>
				<Typography variant="h3" sx={{ color: 'black', textAlign: 'center' }}>Page not found</Typography>
			</Box>
		</Template>
	);
}

export default NotFoundScene;