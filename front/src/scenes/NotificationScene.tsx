import React, { FC, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "redux";
import { Redirect } from "react-router-dom"; 
import { hot } from "react-hot-loader";

import { config } from "@config";
import { displayDate } from "@utils/helpers";

import { AppState } from "@store/types";
import Template from "@components/Template";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Pagination from '@mui/material/Pagination';

import {
	Notifications,
} from "@store/types/UserTypes";

import { 
	logout,
} from "@store/actions";

type Props = {};

type TypeIcons = {
	[key: string]: any;
};

const NotificationScene: React.FC<Props> = () => {
	const dispatch = useDispatch();
	const stateAccount = useSelector((state: AppState) => state.accountReducer);
	const stateUser = useSelector((state: AppState) => state.userReducer);
	const dispatchLogout = compose(dispatch, logout);
	const [redirctTo, setRedirctTo] = useState(false);
	const [data, setData] = React.useState(null);
	const [page, setPage] = React.useState(1);
	const [pageSize, setPageSize] = React.useState(20);

	const typeIcon: TypeIcons = {
		'1': <ImageIcon />,
		'2': <WorkIcon />,
		'3': <BeachAccessIcon />,
		//'4': 
	}

	useEffect(() => {
		if (!stateUser.user || !stateUser.user.name) {
			setRedirctTo(true);
		}
	})

	useEffect(() => {
		if (stateUser.user && stateUser.user.name) {
			setData(stateUser.user.notifications);
		}
	}, [])

	const handlePagination = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	const render =
		<Template
				isLogged={!!stateAccount.address}
				logout={dispatchLogout}
				user={stateUser.user}
			>
			<Typography sx={{ color: 'black' }} variant="h2">Notifications <span style={{ fontSize: '22px' }}>{data && data.length}</span></Typography>
			{data && <List sx={{ width: '100%', color: 'black' }}>
				{data.filter((elt: Notifications, index: number) => index >= (page - 1) * pageSize && index < page * pageSize).map((elt: Notifications, index: number) => 
						<div key={index}>
							<ListItem sx={{ 
								margin: '10px 0',
								borderRadius: '7px',
								boxShadow: '2px 2px 2px #233044',
								borderLeft: '1px solid #233044',
								borderTop: '1px solid #233044',
								wordBreak: 'break-all',
								whiteSpace: 'pre-wrap',
								bgcolor: 'white' }}>
								<ListItemAvatar>
									<Avatar>
										{typeIcon[elt.type]}
									</Avatar>
								</ListItemAvatar>
								<ListItemText
									primary={<p style={{ margin: 0, marginBottom: '7px', color: 'black' }}>
										<span style={{ fontSize: '13px' }}>{displayDate(elt.createdAt, true)} - </span>
										{elt.title}</p>}
									secondaryTypographyProps={{ color: 'black' }}
									secondary={elt.desc}
								/>
							</ListItem>
						</div>
					)}
			</List>}

			{data && data.length / pageSize > 1 && <Pagination
				count={Math.ceil(data.length / pageSize)}
				sx={{ 
					background: '#364254',
					display: 'flex',
					justifyContent: 'center',
					padding: '10px',
					borderRadius: '7px',
				}}
				onChange={handlePagination}
			/>}

		</Template>;

	return redirctTo ? <Redirect to="/profile" /> : render;
}

export default hot(module)(NotificationScene);