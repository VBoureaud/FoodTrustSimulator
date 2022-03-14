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

type FormDialogProps = {
  title: string;
  onConfirm?: Function;
  checkData?: Function;
  onCancel?: Function;
  dialogText?: React.ReactElement;
  errorStr?: string;
  typeField?: string;
  labelField?: string;
}

const FormDialog : React.FunctionComponent<FormDialogProps> = (props) => {
  const [open, setOpen] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [value, setValue] = React.useState('');

  const handleCancel = () => {
    setOpen(false);
    if (props.onCancel) props.onCancel();
  };
  const handleConfirm = async () => {
    setError(false);
    setLoading(true);
    if (props.checkData) {
      const res = await props.checkData(value);
      if (!res) {
        setError(true);
        setLoading(false);
        return false;
      }
    }

    if (props.onConfirm) {
      await props.onConfirm(value);
    } else {
      setOpen(false);
    }
  };
  const handleChange = (e: { target: { value: string; }; }) => {
    setValue(e.target.value);
  }

  return (
    <div>
      <Dialog open={open}>
      <div>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent sx={{ p: 2 }}> 
          {error && <DialogContentText sx={{ pl: 1, minWidth: '560px', color: 'tomato' }}>
            {props.errorStr ? props.errorStr : 'Confirmation failed.'}
          </DialogContentText>}

          {!error && <DialogContentText sx={{ pl: 1, minWidth: '560px' }}>
            {props.dialogText ? props.dialogText : 'Enter your value'}
          </DialogContentText>}

          <TextField
            disabled={loading}
            autoFocus
            margin="dense"
            id="secret"
            label={props.labelField ? props.labelField : 'Field'}
            type={props.typeField ? props.typeField : 'password'}
            fullWidth
            sx={{ mt: 4, mb: 1 }}
            variant="outlined"
            onChange={handleChange}
          />
        </DialogContent>
        {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', mb: 5, color: "white" }} />}
        {!loading && <DialogActions>
          <Button sx={{ color: 'white' }} onClick={handleCancel}>Cancel</Button>
          <Button sx={{ color: 'white' }} onClick={handleConfirm}>Confirm</Button>
        </DialogActions>}
      </div>
      </Dialog>
    </div>
  );
}

export default FormDialog;