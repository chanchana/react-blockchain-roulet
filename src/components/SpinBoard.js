import { Grid, Paper, Box, Button, Popover, ButtonGroup, TextField, Badge } from '@material-ui/core'
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ExchangeToken } from './ExchangeToken'
import { Wheel } from 'react-custom-roulette'

const dataZero = [
  { option: '0', style: { backgroundColor: '#4caf50', textColor: 'white' } },
]

const Color = {
  black: '#263238',
  red: '#ab003c',
  green: '#4caf50',
  paperGrey: '#616161',
}

const oddPosition = 37
const evenPosition = 38

const data = [...Array(39).keys()].map(number => (
  {
    index: number,
    option: number.toString(), 
    name: number === oddPosition ? 'Odd' : number === evenPosition ? 'Even' : number.toString(),
    textColor: [0, oddPosition, evenPosition].includes(number) && 'white',
    style: { backgroundColor: number === 0 ? Color.green : number % 2 === 0 ? Color.red : Color.black, textColor: 'white' }
  }
))
// const data = dataZero.concat(dataNumbers)
const spinData = data.slice(0, 37)
const betData = [data[0], data[oddPosition], data[evenPosition], ...data.slice(1, 37) ]

const spinnerStyle = {
  innerRadius: 55,
  innerBorderWidth: 5,
  radiusLineWidth: 2,
  // radiusLineColor: 'white',
  textDistance: 75,

}

const popoverStyle = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'center',
  },
  // style: {
  //   background: '#000000a0',
  // }
}


export const SpinBoard = ({ tokenBalance, handleAddBet, handleRemoveBet, betAmounts, setBetAmounts, mustSpin, setMustSpin, spinResult, handleSpin, handleBuyToken, handleSellToken }) => {
  const [betPopoverOpens, setBetPopoverOpens] = useState(() => [...[...Array(39).keys()].map(_ => null)])
  const [editingBetAmounts, setEditingBetAmounts] = useState(() => [...[...Array(39).keys()].map(_ => 0)])

  useEffect(() => {
    console.log(betPopoverOpens)
  }, [])

  useEffect(() => {
    console.log(betPopoverOpens)
  }, [betPopoverOpens])

  const handleOpenBet = (event, index) => {
    // betPopoverOpens[index] = event.currentTarget
    const newState = [...betPopoverOpens]
    newState[index] = event.currentTarget
    // console.log(betPopoverOpens)
    setBetPopoverOpens(newState)
    setEditingBetAmounts(betAmounts)
  }

  const handleCloseBet = (index) => {
    // const prevState = betPopoverOpens
    // prevState[index] = null
    // betPopoverOpens[index] = null
    const newState = [...betPopoverOpens]
    newState[index] = null
    // console.log(betPopoverOpens)
    setBetPopoverOpens(newState)
  }

  const handleChangeBetAmount = (event, index) => {
    const newState = [...editingBetAmounts]
    newState[index] = event.target.value ? parseInt(event.target.value) : 0
    setEditingBetAmounts(newState)
  }

  const handleChangeByValue = (index, value) => {
    const newState = [...editingBetAmounts]
    newState[index] += value
    setEditingBetAmounts(newState)
  }

  const handleConfirmAddRemoveBet = (index, changeValue) => {
    if (changeValue > 0) {
      if (handleAddBet(index, changeValue)) {
        setBetAmounts(editingBetAmounts)
      }
    } else if (changeValue < 0) {
      if (handleRemoveBet(index, -changeValue)) {
        setBetAmounts(editingBetAmounts)
      }
    }
    
  }

  const betChange = useCallback((index) => editingBetAmounts[index] - betAmounts[index], [editingBetAmounts, betAmounts])

  const exchangeTokenProp = { handleBuyToken, handleSellToken, tokenBalance }

  return (
    <Box width="100%" padding="1rem" maxWidth="1400px" margin="0 auto">
      <Grid container spacing={3}>
        <Grid item md={6} sm={12}>
          <Paper rounded>
            <Box textAlign="center" padding="1rem">
              <Wheel mustStartSpinning={mustSpin} data={spinData} prizeNumber={spinResult} onStopSpinning={() => { setMustSpin(false) }} {...spinnerStyle} />
              <Button onClick={handleSpin} variant="contained" color="primary" style={{margin: '1rem auto'}}>Spin</Button>
            </Box>

          </Paper>
        </Grid>
        <Grid item md={6} sm={12}>
          <Paper>
            <Box padding="1rem">
              <Grid container>
                <Grid item xs={6}>
                  <Box width="280px" margin="auto" padding="1rem">
                    <Grid container spacing={1}>
                      {/* <Grid item xs={4}>
                        <Button variant="contained" color="primary" style={{width: "72px", background: Color.green}}>0</Button>                
                      </Grid>
                      <Grid item xs={4}>
                        <Button variant="contained" color="primary" style={{width: "72px", background: Color.black}}>Odd</Button>                
                      </Grid>
                      <Grid item xs={4}>
                        <Button variant="contained" color="primary" style={{width: "72px", background: Color.red}}>Even</Button>                
                      </Grid> */}
                    
                      {betData.map(({ index, option, name, textColor, style }) => (
                        <Grid item xs={4}>
                          <Badge color="primary" badgeContent={betAmounts[index]} invisible={betAmounts[index] === 0} style={{top: '18px', right: '6px'}}>
                            <Button onClick={(event) => {handleOpenBet(event, index)}} aria-describedby={`bet-button-${option}`} variant="contained" style={{width: "72px", color: textColor, fontWeight: 'bold', background: [0, oddPosition, evenPosition].includes(index) && style.backgroundColor}}>
                              {name}
                            </Button>
                          </Badge>
                         
                          <Popover id={`bet-button-${option}`} open={Boolean(betPopoverOpens[index])} anchorEl={betPopoverOpens[index]} onClose={() => {handleCloseBet(index)}} {...popoverStyle} >
                            <Box padding="2rem" background="white" textAlign="center" color="black" style={{background: 'white'}}>
                              <span style={{fontSize: '1.2rem'}}>Bet for: <strong>{name}</strong></span>
                              <Box margin="1rem 0">
                                <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                                  <Button onClick={() => {handleChangeByValue(index, -1)}} style={{width: '32px'}} disabled={editingBetAmounts[index] === 0}><RemoveIcon /></Button>
                                  <Box width="80px"> 
                                    <TextField id="standard-basic" label="Amount" onChange={(event) => {handleChangeBetAmount(event, index)}} value={editingBetAmounts[index]} /> 
                                  </Box>
                                  <Button onClick={() => {handleChangeByValue(index, 1)}} style={{width: '32px'}}><AddIcon /></Button>
                                </ButtonGroup>
                              </Box>
                              <Button onClick={() => handleConfirmAddRemoveBet(index, betChange(index))} variant="contained" color="primary" disabled={betChange(index) === 0}>{betChange(index) === 0 ? 'Add/Remove' : betChange(index) > 0 ? `Add ${betChange(index)} Token` : `Remove ${-betChange(index)} Token` }</Button>
                            </Box>
                          </Popover>                
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box padding="1rem">
                    <Paper style={{background: Color.paperGrey, padding: '1rem'}}>
                      Your Token
                      <h1 style={{margin: '0 0 1rem'}}>{tokenBalance}</h1>
                      <ExchangeToken {...exchangeTokenProp} />
                    </Paper>

                    <Paper style={{background: Color.paperGrey, padding: '1rem', marginTop: '1rem'}}>
                      Spin History
                      <Box marginTop="1rem">
                        {[1, 7, 32, 0, 23,8,1, 7, 32, 0, 23,8,1, 7, 32, 0, 23, 32, 0, 23,8,1, 7, 32, 0, 23,8,1, 7, 32, 0, 23,8].map(number => (
                          <Box width="32px" height="32px" lineHeight="32px" borderRadius="4px" display="inline-block" margin="0 8px 8px 0" style={{textAlign: 'center', background: number === 0 ? Color.green : number % 2 === 0 ? Color.red : Color.black}}>{number}</Box>
                        ))}
                      </Box>
                    </Paper>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}