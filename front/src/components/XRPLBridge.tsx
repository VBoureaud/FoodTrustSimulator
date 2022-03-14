import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from "@mui/material/CircularProgress";
//import DoneAllIcon from '@mui/icons-material/DoneAll';

type XRPLBridgeProps = {
  onConfirm?: Function;
  onCancel?: Function;
  onClose?: Function;
  dialogText?: React.ReactElement | string;
}

const XRPLBridge : React.FunctionComponent<XRPLBridgeProps> = (props) => {
  const [open, setOpen] = React.useState(true);
  const [validated, setValidated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('Your secret credential is wrong.');
  const [value, setValue] = React.useState('');

  const handleCancel = () => {
    setOpen(false);
    if (props.onCancel) props.onCancel();
  };
  const handleConfirm = async () => {
    setError(false);
    setLoading(true);
    if (props.onConfirm) {
      const res = await props.onConfirm(value);
      
      if (!res) {
        setValue('');
        setError(true);
        setLoading(false);
        return false;
      } else {
        setValidated(true);
      }
    } else {
      setOpen(false);
    }
    if (props.onClose) props.onClose();
    return true;
  };

  const handleChange = (e: { target: { value: string; }; }) => {
    setValue(e.target.value);
  }

  return (
    <div>
      <Dialog open={open}>
        
        {!validated && 
          <div>
            <DialogTitle>XRPL Bridge</DialogTitle>
            <DialogContent sx={{ p: 2 }}> 
              {error && <DialogContentText sx={{ pl: 1, minWidth: '560px', color: 'tomato' }}>
                {errorMsg}
              </DialogContentText>}

              {!error && <DialogContentText sx={{ pl: 1, minWidth: '560px' }}>
                {props.dialogText ? props.dialogText : 'Enter your credential to continue'}
              </DialogContentText>}

              <TextField
                disabled={loading}
                autoFocus
                margin="dense"
                id="secret"
                label="Secret"
                type="password"
                fullWidth
                sx={{ mt: 4, mb: 1 }}
                variant="outlined"
                onChange={handleChange}
              />
            </DialogContent>
            {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', mb: 5, color: "white" }} />}
            {!loading && <DialogActions sx={{ position: 'relative' }}>
              <Typography sx={{ position: 'absolute', left: '15px' }}>Estimated cost: 0.00012 XRP</Typography>
              <Button sx={{ color: 'white' }} onClick={handleCancel}>Cancel</Button>
              <Button sx={{ color: 'white' }} onClick={handleConfirm}>Confirm</Button>
            </DialogActions>}
          </div>}

          {validated && <Box>
            <Typography sx={{ p: 3 }} variant="h2">Transaction confirmed.</Typography>
            <DialogActions>
              <Button sx={{ color: 'white' }} onClick={() => setOpen(false)}>Close</Button>
            </DialogActions>
          </Box>}
      </Dialog>
    </div>
  );
}

export default XRPLBridge;