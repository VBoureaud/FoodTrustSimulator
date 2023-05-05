import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 600,
  width: '100%',
  maxHeight: 'calc(100vh - 200px)',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  borderRadius: '4px',
  border: 'none',
  boxShadow: 24,
  p: { xs: 1, md: 4},
};

type BasicModalProps = {
  children: any;
  autoOpen: boolean;
  openDelay?: number;
  onClose?: Function;
  showClose?: boolean;
}

export default function BasicModal(props: BasicModalProps) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => { 
    if (props.onClose) props.onClose();
    setOpen(false)
  };
  let timeout: ReturnType<typeof setTimeout>;

  React.useEffect(() => {
    if (timeout) clearTimeout(timeout);
    if (props.autoOpen) {
      timeout = setTimeout(() => {
        setOpen(true);
      }, props.openDelay !== null ? props.openDelay : 2500);
    }
    
    // like componentDidUnMount
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {props.children}
          {props.showClose && <span style={{ 
            border: '1px solid #cb5847',
            padding: '5px 10px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            borderRadius: '4px',
            fontSize: '11px',
            background: '#6b464b',
          }} onClick={handleClose}>Close</span>}
        </Box>
      </Modal>
    </>
  );
}