import React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import './style.css'

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '33ch',
    },
  },
}));

const tokens = [
  {
    value: 'ETH',
    label: 'ETH',
  },
  {
    value: 'Token',
    label: 'Token',
  },
];

export const ExchangeToken = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [eth, setETH] = React.useState('ETH');
  const [token, setToken] = React.useState('Token');

  const handleChangeETH = (event) => {
    setETH(event.target.value);
    if (event.target.value == 'Token'){
      setToken('ETH')
    }
    else{
      setToken('Token')
    }
  };

  const handleChangeToken = (event) => {
    setToken(event.target.value);
    if (event.target.value == 'ETH'){
      setETH('Token')
    }
    else{
      setETH('ETH')
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button variant="outlined" color="inherit" onClick={handleClickOpen} >Exchange Token</Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" style={{color: '#3f51b5', fontWeight:'bold'}}>Exchange Token</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            Please enter your token or ETH here. 
          </DialogContentText> */}
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              autoFocus
              margin="dense"
              id="from-number"
              label="From"
              type="number"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              style={{borderBottom: '2px solid #3f51b5'}}
            />
            <TextField
              id="outlined-select-from"
              select
              value={eth}
              onChange={handleChangeETH}
              variant="outlined"
            >
              {tokens.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              autoFocus
              margin="dense"
              id="to-number"
              label="To"
              type="number"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              style={{borderBottom: '2px solid #3f51b5'}}
            />
            <TextField
              id="outlined-select-to"
              select
              value={token}
              onChange={handleChangeToken}
              variant="outlined"
            >
              {tokens.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" style={{marginRight:'15px'}}>
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Exchange
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}