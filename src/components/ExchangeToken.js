import React, { useMemo } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItemPaper, Tabs, Tab, Paper, Box, ButtonGroup } from '@material-ui/core'
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      // margin: theme.spacing(1),
      // width: '33ch',
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

export const ExchangeToken = ({ handleBuyToken, handleSellToken, tokenBalance }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [eth, setETH] = React.useState('ETH');
  const [token, setToken] = React.useState('Token');
  const [value, setValue] = React.useState(0);
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangeETH = (event) => {
    setETH(event.target.value);
    if (event.target.value == 'Token'){
      setToken('ETH')
    }
    else{
      setToken('Token')
    }
  };

  const handleChangeValue = (event) => {
    event.preventDefault()
    setValue(parseInt(event.target.value));
  };

  const handleChangeValueByValue = (addValue) => {
    setValue(parseInt(value) + addValue);
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

  const handleAction = () => {
    if (mode === 'Buy') {
      handleBuyToken(value)
    } else if (mode === 'Sell') {
      handleSellToken(value)
    }
    setValue(0)
  }

  const mode = useMemo(() => tabValue === 0 ? 'Buy' : 'Sell', [tabValue])
  const toUnit = useMemo(() => tabValue === 0 ? 'Token' : 'ETH', [tabValue])
  const fromUnit = useMemo(() => tabValue === 0 ? 'ETH' : 'Token', [tabValue])

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen} >Exchange Token</Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" style={{color: '#3f51b5', fontWeight:'bold'}}>Exchange Token</DialogTitle>
        <DialogContent style={{color: 'black'}}>
          {/* <DialogContentText>
            Please enter your token or ETH here. 
          </DialogContentText> */}
          <form className={classes.root} noValidate autoComplete="off">
          {/* <Paper square> */}
            <Tabs
              value={tabValue}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleTabChange}
              aria-label="disabled tabs example"
            >
              <Tab label="Buy Token" >
                Buy
              </Tab>
              <Tab label="Sell Token" >
                Sell
              </Tab>
            </Tabs>
            <Box margin="1rem 0" textAlign="center">
              {/* <TextField
                autoFocus
                margin="dense"
                id="from-number"
                label="Amount"
                type="number"
                fullWidth
                variant="outlined" 
                color="primary"
                InputLabelProps={{
                  shrink: true,
                }}
                value={value}
                onChange={handleChangeValue}
                style={{borderBottom: '2px solid #3f51b5'}}
              /> */}
              <Box display="flex">
                <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group" style={{margin: '1rem auto'}}>
                  <Button style={{width: '32px'}} onClick={() => handleChangeValueByValue(-1)} disabled={value === 0}><RemoveIcon /></Button>
                  <Box width="80px" textAlign="center"> 
                    <TextField id="exchange-textfield" label="Amount" type="number" onChange={handleChangeValue} value={value} /> 
                  </Box>
                  <Button style={{width: '32px'}} onClick={() => handleChangeValueByValue(1)} ><AddIcon /></Button>
                </ButtonGroup>
              </Box>
              <Box color="gray">{mode} Tokens</Box>
              <Box fontSize="1.2rem" fontWeight="bold" marginTop="0.2rem" >{value} {fromUnit} <ArrowForwardIcon style={{fontSize: '1rem'}} /> {value} {toUnit} </Box>
              <Box color="gray">Token Balance: {tokenBalance}</Box>
            </Box>
          {/* </Paper> */}
            {/* <TextField
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
            </TextField> */}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" style={{marginRight:'15px'}}>
            Cancel
          </Button>
          <Button onClick={handleAction} variant="contained" color="primary">
            {mode}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}