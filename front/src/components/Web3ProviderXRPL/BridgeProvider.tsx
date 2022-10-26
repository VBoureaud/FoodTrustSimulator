import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Typography from '@mui/material/Typography';
import CircularProgress from "@mui/material/CircularProgress";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// WS Call
if (typeof module !== "undefined") var xrpl = require('xrpl')

const lang = {
	en: {
		noAddr: <span>No Address ? Generate your <strong>XRPL Address</strong> on <strong>NFT-Devnet here</strong>.</span>,
		cancel: <span>Cancel</span>,
	}
}

export const bridgeApiCall = async (secret: string, payload: any, xrplUrl: string) => {
	const wallet = xrpl.Wallet.fromSeed(secret)
	const client = new xrpl.Client(xrplUrl)
	const res = await client.connect();
	payload['Account'] = wallet.classicAddress;
	const tx = await client.submitAndWait(payload, { wallet });

  client.disconnect();
  return tx && tx.result.meta.TransactionResult == 'tesSUCCESS';
}

type BridgeProviderProps = {
	handleClose: Function;
	handleWallet: Function;
	errorMsg?: string;
	faucet?: string;
}
const BridgeProvider : React.FunctionComponent<BridgeProviderProps> = (props) => {
	const [pubAddr, setPubAddr] = React.useState('');

	const handleChange = (e: { target: { value: string; }; }) => {
		setPubAddr(e.target.value);
	}

	return (
		<div>
			<Container>
				<Typography variant="h5" sx={{ mb: 2, mt: 1 }}>Bridge</Typography>
			</Container>
			<Container 
				component="main"
				maxWidth="xl"
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					mt: 2,
				}}>
				<a target="_blank" href={props.faucet}>
					<Alert sx={{ background: '#3c5e82' }} severity="info">
						{lang['en'].noAddr}
					</Alert>
				</a>
			</Container>
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
				<Alert sx={{ background: '#933727', width: '100%' }} severity="error">{props.errorMsg}</Alert>
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
					onClick={() => props.handleWallet('bridge', { address: pubAddr })}
				>
					<ArrowForwardIosIcon />
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
  const [errorMsg, setErrorMsg] = React.useState('Your secret credential is wrong.');
  const [value, setValue] = React.useState('');

  const handleCancel = () => {
    if (props.onCancel) props.onCancel();
  };
  const handleConfirm = async () => {
  	setError(false);
    setLoading(true);
    if (props.onConfirm) {
    	const res = await props.onConfirm(value);
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
    return true;
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