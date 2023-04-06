import * as React from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Typography from '@mui/material/Typography';
import CircularProgress from "@mui/material/CircularProgress";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { ChainList } from "./Web3ProviderXRPLTypes";

// WS Call
if (typeof module !== "undefined") var xrpl = require('xrpl')

const lang = {
	en: {
		noAddr: <span>No Address ? Generate your <strong>XRPL Address</strong> on <strong>Faucet</strong>.</span>,
		cancel: <span>Cancel</span>,
		duplicate: <span>Connection error during synchronisation</span>,
		lostCo: <span>Connection lost with server.</span>,
		lostCoXRPL: <span>No account found with this address.</span>,
	}
}

export const bridgeApiCall = async (secret: string, payload: any, xrplUrl: string) => {
	try {
		const wallet = xrpl.Wallet.fromSeed(secret)
		const client = new xrpl.Client(xrplUrl)
		const res = await client.connect();
		payload['Account'] = wallet.classicAddress;
		const tx = await client.submitAndWait(payload, { wallet });
		client.disconnect();
		return tx && tx.result.meta.TransactionResult == 'tesSUCCESS';
	} catch(error) {
		return false;
	}
}

type BridgeProviderProps = {
	handleClose: Function;
	handleWallet: Function;
	errorMsg?: string;
	//faucet?: string;
	chainList?: ChainList[];
	loading?: boolean;
}

const BridgeProvider : React.FunctionComponent<BridgeProviderProps> = (props) => {
	const [pubAddr, setPubAddr] = React.useState('');
	const [server, setServer] = React.useState(null);

	React.useEffect(() => {
		if (props.chainList)
			setServer(props.chainList[0]);
	}, []);

	const handleChange = (e: { target: { value: string; }; }) => {
		setPubAddr(e.target.value);
	}

	const handleChoiceServer = (event: SelectChangeEvent) => {
		const nameServer = event.target.value;
		setServer(props.chainList.filter((e:ChainList) => e.name === nameServer)[0]);
	};

	return (
		<div>
			<Container>
				<Typography variant="h5" sx={{ mb: 2, mt: 1 }}>Bridge</Typography>
			</Container>
			{server && server.faucet && <Container 
				component="main"
				maxWidth="xl"
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					mt: 2,
				}}>
				<a target="_blank" href={server.faucet}>
					<Alert sx={{ background: '#3c5e82' }} severity="info">
						{lang['en'].noAddr}
					</Alert>
				</a>
			</Container>}
			<div id="error_auth">
				{props.errorMsg && <Container 
					component="main"
					maxWidth="xl"
					sx={{
						width: "100%",
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						mt: 2,
					}}>
					<Alert sx={{ background: '#933727', width: '100%' }} severity="error">
						{
							props.errorMsg.indexOf('NetworkError') !== -1 
							? lang['en'].lostCo
							: props.errorMsg.indexOf('Account_Nfts') !== -1 
							?	lang['en'].lostCoXRPL
							: props.errorMsg.indexOf('duplicate') !== -1
							? lang['en'].duplicate
							: props.errorMsg
						}
					</Alert>
				</Container>}
			</div>

			{props.chainList && server && <Container 
				component="main"
				maxWidth="xl"
				sx={{ mt: 2 }}>
				<FormControl fullWidth>
					<InputLabel id="label-server">Server</InputLabel>
					<Select
						labelId="label-server"
						id="simple-select-server"
						label="Server"
						value={server.name}
						onChange={handleChoiceServer}
					>
						{props.chainList && props.chainList.map((elt: ChainList, index: number) => (
							<MenuItem key={index} value={elt.name}>{elt.name + ' - ' + elt.url}</MenuItem>
						))}
					</Select>
				</FormControl>
			</Container>}

			<Container 
				component="main"
				maxWidth="xl"
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<TextField
					sx={{ background: "#222" }}
					margin="normal"
					required
					fullWidth
					id="account"
					label="XRPL Address"
					name="account"
					autoComplete="account"
					variant="filled"
					onChange={handleChange}
				/>
				<Button
					sx={{ 
						background: "#4782da",
						color: "white",
						height: "57px",
						marginTop: "8px",
						marginLeft: "6px",
					}}
					id="validation_auth_bridge"
					onClick={() => props.handleWallet('bridge', { address: pubAddr }, null, server.name)}
				>
					{props.loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : <ArrowForwardIosIcon />}
				</Button>
			</Container>
			<Button variant="contained" sx={{ float: 'right', marginTop: '20px' }} onClick={() => props.handleClose()}>{lang['en'].cancel}</Button>
		</div>
	);
}

type BridgeTxProps = {
	onConfirm?: Function;
	onClose?: Function;
	onCancel?: Function;
	dialogText?: React.ReactElement | string;
}

export const BridgeTx : React.FunctionComponent<BridgeTxProps> = (props) => {
	const [validated, setValidated] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState(false);
	const [errorMsg, setErrorMsg] = React.useState('Is your secret credential wrong ?');
	const [value, setValue] = React.useState('');

	const handleCancel = () => {
		if (props.onCancel) props.onCancel();
	};
	const handleConfirm = async () => {
		setError(false);
		setLoading(true);
		let res = false;
		if (props.onConfirm) {
			res = await props.onConfirm(value);
			if (!res) {
				setError(true);
				setLoading(false);
				return false;
			} else {
				setValidated(true);
			}
		}
		if (props.onClose) {
			props.onClose();
		}
		return res;
	};

	const handleChange = (e: { target: { value: string; }; }) => {
		setValue(e.target.value);
	}

	return (
		<div>
				{!validated && 
					<div>
						<Container> 
							<Typography variant="h5" sx={{ mb: 2 }}>Bridge</Typography>
							{error && <Alert sx={{ background: '#933727', width: '100%', mb: 1 }} severity="error">{errorMsg}</Alert>}
							{!error && <Typography>
								{props.dialogText ? props.dialogText : 'Enter your credential to continue'}
							</Typography>}

							<TextField
								disabled={loading}
								autoFocus
								margin="dense"
								id="secret"
								label="Secret"
								type="password"
								fullWidth
								sx={{ mt: 1, mb: 1, maxWidth: '450px', width: '100%' }}
								variant="outlined"
								onChange={handleChange}
							/>

							{loading && <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 2, mb: 2, color: "white" }} />}
							{!loading && <Box sx={{ position: 'relative' }}>
								<Typography sx={{ left: '15px' }}>Estimated cost: 0.00012 XRP</Typography> {/* TODO ? */}
								<Container sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
									<Button sx={{ color: 'white' }} onClick={handleCancel}>Cancel</Button>
									<Button sx={{ color: 'white' }} onClick={handleConfirm}>Confirm</Button>
								</Container>
							</Box>}
						
						</Container>
					</div>}
		</div>
	);
}

export default BridgeProvider;