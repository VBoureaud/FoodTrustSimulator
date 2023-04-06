import React, { useState, useEffect } from "react";

import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';

import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';
import CircularProgress from '@mui/material/CircularProgress';

import './style.less';
import GemWalletIcon from "./assets/gemwallet.png";
import XummIcon from "./assets/xumm.png";
import BridgeIcon from "./assets/bridge.png";

import { handleXumm, handleXummTx } from "./XummProvider";
import { handleGem, handleGemTx } from "./GemProvider";
import BridgeProvider, { BridgeTx, bridgeApiCall } from "./BridgeProvider";
import { ChainList } from "./Web3ProviderXRPLTypes";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref,
) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type payloadXRPL = {
	Account?: string;
	TransactionType: string;
	Owner: string;
	NFTokenID: string;
	Amount: string;
	Flags: number;
}

type Web3ProviderXRPLProps = {
	handleWallet?: Function;
	handleTransaction?: Function;
	handleError?: Function;
	chainList?: ChainList[];
	walletType?: string;
	currentJwt?: string;
	handleClose?: (value?: string) => void;
	visible: boolean;
	errorMsg?: string;
	payload?: payloadXRPL;
	appKey?: string;
	clientUrl?: string;
	xrplUrl?: string;
	loading?: boolean;
}

type Web3AuthProps = {
	handleWallet?: Function;
	listProvider?: {[key: string]: any};
	showError?: Function;
	catchError?: Function;
};

const Web3Auth = (props: Web3AuthProps) => {
	const handleClick = async (provider: string) => {
		if (props.listProvider[provider].onClick) {
			const res = await props.listProvider[provider].onClick(props.handleWallet)
			if (!res && props.showError && props.catchError) {
				props.catchError('Something went wrong, please try again.');
				props.showError(true);
			}
		}
	}

	return (
		<>
			<DialogTitle>Choose an authenticator on Testnet</DialogTitle>
			<List sx={{ pt: 0, display: 'flex', flexWrap: 'wrap', maxWidth: '500px' }}>
				{props.listProvider && Object.keys(props.listProvider).map((provider) => (
					<ListItem 
						button
						sx={{ padding: 2 }}
						onClick={() => handleClick(provider)}
						id={provider}
						key={provider}
					>
						<ListItemAvatar>
							<Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
								<img src={props.listProvider[provider].icon} alt={provider} />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary={provider} secondary={props.listProvider[provider].desc}/>
					</ListItem>
				))}
			</List>
		</>
	);
}

const Web3ProviderXRPL = (props: Web3ProviderXRPLProps) => {
	const [showBridge, setShowBridge] = useState(false);
	const [showSnack, setShowSnack] = useState(false);
	const [snackMessage, setSnackMessage] = useState('');
	const listProvider: {[key: string]: any} = {
		Xumm: {
			icon: XummIcon,
			desc: 'Official client for XRPL (Web3)',
			onClick: () => handleXumm('xumm', props.handleWallet, props.appKey, props.clientUrl, props.chainList),
			onTransaction: () => handleXummTx(props.payload, props.handleTransaction, props.currentJwt, handleCancelTx, props.handleError),
		},
		GemWallet: {
			icon: GemWalletIcon,
			desc: 'Web extension for XRPL (Web3)',
			onClick: () => handleGem('gem', props.handleWallet, handleNoGem, props.chainList),
			onTransaction: () => handleGemTx(props.payload, props.handleTransaction),
		},
		Bridge: {
			icon: BridgeIcon,
			desc: 'Input managed by the website (Web2)',
			onClick: () => {
				setShowBridge(true);
				return true;
			},
			onClose: () => setShowBridge(false),
		},
	};

	useEffect(() => {
		{/* Transaction */}
		if (props.handleTransaction && props.visible) {
			handleTransaction();
		}
	}, [props.visible]);


	const handleCancelTx = async () => {
		setSnackMessage('The transaction has been abandoned.');
		setShowSnack(true);
		props.handleClose();
	}

	const handleTransaction = async () => {
		let res = true;
		if (props.walletType === 'xumm') {
			res = await listProvider.Xumm.onTransaction()
		} else if (props.walletType === 'gem') {
			res = await listProvider.Gem.onTransaction()
		}

		if (!res) {
			setSnackMessage('The transaction failed.');
			setShowSnack(true);
			props.handleClose();
		}
	}

	const handleNoGem = async (noGem: boolean, msg?: string) => {
		if (noGem) {
			await setSnackMessage(msg ? msg : 'You must have GemWallet installed on your browser to continue.')
			setShowSnack(true);
		}
	}

	return (
		<>
			<Dialog
				open={props.visible}
				onClose={props.handleClose}
				>
				{/* Authentification */}
				{props.handleWallet && <DialogContent sx={{ p: 2 }}>
					{!showBridge && 
						<Web3Auth
							handleWallet={props.handleWallet}
							listProvider={listProvider}
							showError={setShowSnack}
							catchError={setSnackMessage}
						/>}
					{showBridge && 
						<BridgeProvider
							handleWallet={props.handleWallet}
							handleClose={listProvider.Bridge.onClose}
							errorMsg={props.errorMsg}
							chainList={props.chainList}
							loading={props.loading}
						/>}
				</DialogContent>}

				{/* Transaction */}
				{props.handleTransaction && <DialogContent sx={{ p: 2 }}>
					{props.walletType === 'bridge' && 
						<BridgeTx
							onConfirm={async (secret: string) => {
								try {
									const res = await bridgeApiCall(secret, props.payload, props.xrplUrl)
									if (!res) throw new Error("Request Fail");
									if (props.handleTransaction) props.handleTransaction(res)
									return true;
								}
								catch (err) {
									console.log({ err });
									if (props.handleError) props.handleError();
									return false;
								}
							}}
							onClose={props.handleClose}
							onCancel={props.handleClose}
						/>}

					<div style={{ textAlign: 'center', paddingTop: 15 }}>
						{props.walletType !== 'bridge' && <CircularProgress sx={{ color: "white" }} />}
						{props.walletType === 'xumm' && <div>
							<p>Awaiting validation on <b>Xumm</b></p>
							</div>}
					</div>
				</DialogContent>}
			</Dialog>
			<Snackbar
				open={showSnack}
				autoHideDuration={5000}
				onClose={() => setShowSnack(false)}
			>
				<Alert onClose={() => setShowSnack(false)} severity="error" sx={{ width: '100%' }}>
					{snackMessage}
				</Alert>
			</Snackbar>
		</>
	);
}

export default Web3ProviderXRPL;