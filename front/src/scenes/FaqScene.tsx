import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { compose } from "redux";

import Box from '@mui/material/Box';
import Template from "@components/Template";
import Typography from '@mui/material/Typography';

import Faq from "@components/Faq";

type FaqSceneProps = {};

import { 
  AppState,
} from "@store/types";

import {
  logout,
} from "@store/actions";

const FaqScene : React.FunctionComponent<FaqSceneProps> = () => {
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
			<Faq />
		</Template>
	);
}

export default FaqScene;