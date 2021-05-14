import './App.css';
import web3 from './web3'
import RouletContract from './roulet'
import { useEffect, useState } from 'react';
import { NavBar, SpinBoard, Header, SpinResult, InputGroup } from './components'
import { CssBaseline } from '@material-ui/core'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import './style.css'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
})

function App() {
  const [mustSpin, setMustSpin] = useState(false)
  const [spinResult, setSpinResult] = useState(10)
  const [tokenBalance, setTokenBalance] = useState()
  const [account, setAccount] = useState()
  const [betAmounts, setBetAmounts] = useState(() => [...[...Array(39).keys()].map(_ => 0)])
  const [spinResultVisible, setSpinResultVisible] = useState(false)
  
  useEffect(() => {
    web3.eth.getAccounts().then((accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0])
        console.log(`Current account: ${accounts[0]}`)
        accountInit(accounts[0])
      } else {
        alert('Please login to MetaMask')
      }
    })
  }, [])

  const handleAddBet = (number, amount) => {
    if (amount > tokenBalance) {
      alert('Insufficient token!')
      return false
    }
    console.log(`Add bet ${amount} for number ${number}`)
    setTokenBalance(tokenBalance - amount)
    return true
  }

  const handleRemoveBet = (number, amount) => {
    console.log(`Remove bet ${amount} for number ${number}`)
    setTokenBalance(tokenBalance + amount)
    return true
  }

  const accountInit = () => {
    updateTokenBalance()
  }

  const updateTokenBalance = () => {
    RouletContract.methods.myToken().call({from: account}).then((result) => {
      setTokenBalance(result)
    })
  }

  const spinAndShowResultWhenFinish = () => {
    setMustSpin(true)
    setTimeout(() => {
      setSpinResultVisible(true)
    }, 11500)
  }

  const handleSpin = () => {
    setSpinResult(5)
    spinAndShowResultWhenFinish()
  }

  const handleBuyToken = (value) => {
    // TODO: connect with contract
    setTokenBalance(parseInt(tokenBalance) + parseInt(value))
  }

  const handleSellToken = (value) => {
    if (value > tokenBalance) {
      alert('Insufficient token!')
      return false
    } else {
      setTokenBalance(parseInt(tokenBalance) - parseInt(value))
    }
  }

  const handleCheatSpin = (value) => {
    const target = parseInt(value)
    setSpinResult(target)
    spinAndShowResultWhenFinish()
  }

  // const handleRandom = () => {
  //   console.log('rand')
  //   RouletContract.methods.testRand().call().then((result) => {
  //     console.log('result' + result)
  //     setRandomNumber(result)
  //   })
  // }

  // const handleBuyToken = () => {
  //   if (buyAmount && buyAmount > 0) {
  //     RouletContract.methods.buyToken(buyAmount).send({from: account}).then((result) => {
  //       console.log('Buying')
  //       console.log(result)
  //       updateTokenBalance()
  //     })
  //   }
  // }

  // const handleChangeBuyToken = (e) => {
  //   console.log(e)
  //   setBuyAmount(e.target.value)
  // }

  const spinBoardProp = { tokenBalance, handleAddBet, handleRemoveBet, betAmounts, setBetAmounts, mustSpin, setMustSpin, spinResult, handleSpin, handleBuyToken, handleSellToken }
  const spinResultProp = { spinResultVisible, setSpinResultVisible, spinResult }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {
        account && 
        <div>
          <NavBar accountAddress={account}/>
          <Header />
          <SpinBoard {...spinBoardProp} />
          <SpinResult {...spinResultProp} />
          <InputGroup label="Add token" buttonText="Add" onEnter={handleBuyToken}/>
          <InputGroup label="Cheat spin" buttonText="Spin" onEnter={handleCheatSpin}/>
        </div>
      }
    </ThemeProvider>
  );
}

export default App;
