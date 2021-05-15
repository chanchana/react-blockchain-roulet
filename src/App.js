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

const zeroData = () => [...[...Array(39).keys()].map(_ => 0)]

function App() {
  const [mustSpin, setMustSpin] = useState(false)
  const [spinResult, setSpinResult] = useState(0)
  const [reward, setReward] = useState(0)
  const [tokenBalance, setTokenBalance] = useState()
  const [dealerBalance, setDelaerBalance] = useState()
  const [account, setAccount] = useState()
  const [betAmounts, setBetAmounts] = useState(zeroData())
  const [editingBetAmounts, setEditingBetAmounts] = useState(zeroData())
  const [spinResultVisible, setSpinResultVisible] = useState(false)
  const [history, setHistory] = useState([])
  
  useEffect(() => {
    web3.eth.getAccounts().then((accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0])
        console.log(`Current account: ${accounts[0]}`)
      } else {
        alert('Please login to MetaMask')
      }
    })
  }, [])

  useEffect(() => {
    updateAccount()
  }, [account])

  const handleAddBet = async (number, amount) => {
    if (amount > tokenBalance) {
      alert('Insufficient token!')
      return false
    }
    console.log(`Add bet ${amount} for number ${number}`)
    return RouletContract.methods.addBet(number, amount).send({from: account}).then((result) => {
      console.log('addBet completed')
      setTokenBalance(parseInt(tokenBalance) - parseInt(amount))
      return true
    }).catch((error) => {
      console.log(error.message)
      alert(error.message)
      return false
    })
  }

  const handleRemoveBet = async (number, amount) => {
    console.log(`Remove bet ${amount} for number ${number}`)
    if (amount > betAmounts[number]) {
      alert('Cannot remove more token!')
      return false
    }
    return RouletContract.methods.removeBet(number, amount).send({from: account}).then((result) => {
      console.log('removeBet completed')
      setTokenBalance(parseInt(tokenBalance) + parseInt(amount))
      return true
    }).catch((error) => {
      console.log(error.message)
      alert(error.message)
      return false
    })
  }

  const updateAccount = () => {
    updateDealerBalance()
    updateTokenBalance()
    updateBet()
    updateHistory()
  }

  const updateTokenBalance = () => {
    RouletContract.methods.myToken().call({from: account}).then((result) => {
      console.log('call myToken completed')
      setTokenBalance(result)
    }).catch((error) => {
      alert(error.message)
    })
  }

  const updateDealerBalance = () => {
    RouletContract.methods.dealerBalance().call({from: account}).then((result) => {
      console.log('call dealerBalance completed')
      setDelaerBalance(result)
    }).catch((error) => {
      alert(error.message)
    })
  }

  const updateBet = () => {
    const userBet = Array(39)
    for (let i = 0; i < 39; i++) {
      RouletContract.methods.getMyBet(i).call({from: account}).then((result) => {
        console.log('call getMyBet completed')
        userBet[i] = parseInt(result)
        if (i === 38) {
          console.log(userBet)
          setBetAmounts(userBet)
          setEditingBetAmounts(userBet)
        }
      }).catch((error) => {
        alert(error.message)
      })
    }
  }

  const updateHistory = () => {
    getHistory().then(result => {
      setHistory(result)
    })
  }

  const getHistory = async () => {
    return RouletContract.methods.getHistory().call({from: account}).then((result) => {
      console.log('call getHistory completed')
      console.log(result)
      const lastestFirstHistory = result.map(number => parseInt(number)).reverse()
      return lastestFirstHistory
    }).catch((error) => {
      alert(error.message)
    })
  }

  const spinAndShowResultWhenFinish = () => {
    setMustSpin(true)
    setTimeout(() => {
      setBetAmounts(zeroData())
      setEditingBetAmounts(zeroData())
      setSpinResultVisible(true)
      updateHistory()
      updateTokenBalance()
    }, 11500)
  }

  const getHistoryAndShowSpinResult = async () => {
    getHistory().then(result => {
      const targetNumber = result[0]
      setSpinResult(targetNumber)
      RouletContract.methods.getPlayerRewardHistory().call({from: account}).then((result) => {
        console.log('call getPlayerRewardHistory completed')
        console.log(result)
        const lastestFirstReward = result.map(number => parseInt(number)).reverse()[0]
        setReward(lastestFirstReward)
        spinAndShowResultWhenFinish()
      })
    })
  }

  const handleSpin = () => {
    RouletContract.methods.spin().send({from: account}).then((result) => {
      console.log('spin completed')
      getHistoryAndShowSpinResult()
    }).catch((error) => {
      alert(error.message)
    })
  }

  const handleCheatSpin = (value) => {
    RouletContract.methods.finish(parseInt(value)).send({from: account}).then((result) => {
      console.log('finish completed')
      getHistoryAndShowSpinResult()
    }).catch((error) => {
      alert(error.message)
    })
  }

  const handleBuyToken = async (value) => {
    RouletContract.methods.buyToken(value).send({
      from: account,
      value: web3.utils.toWei(value.toString(), 'ether'),
    }).then((result) => {
      console.log('buyToken completed')
      updateTokenBalance()
      setTokenBalance(parseInt(tokenBalance) + parseInt(value))
    }).catch((error) => {
      console.log(error.message)
      alert(error.message)
    })
  }

  const handleSellToken = (value) => {
    if (value > tokenBalance) {
      alert('Insufficient token!')
      return false
    } else {
      RouletContract.methods.sellToken(value).send({from: account}).then((result) => {
        console.log('sellToken completed')
        updateTokenBalance()
        setTokenBalance(parseInt(tokenBalance) - parseInt(value))
      }).catch((error) => {
        console.log(error.message)
        alert(error.message)
      })
    }
  }

  const handleDealerDeposit = (value) => {
    RouletContract.methods.dealerDeposit().send({
      from: account,
      value: web3.utils.toWei(value.toString(), 'ether'),
    }).then(() => {
      console.log('dealer deposit completed')
      updateDealerBalance()
    }).catch((error) => {
      console.log(error.message)
      alert(error.message)
    })
  }

  const handleDealerWithdraw = async (value) => {
    RouletContract.methods.dealerWithDraw(value).send({
      from: account,
    }).then(() => {
      console.log('dealer withdraw completed')
      updateDealerBalance()
    }).catch((error) => {
      console.log(error.message)
      alert(error.message)
    })
  }

  const handleBeDealer = () => {
    RouletContract.methods.beDealer().send({from: account}).then(() => {
      console.log('be dealer completed')
      updateDealerBalance()
    }).catch((error) => {
      console.log(error.message)
      alert(error.message)
    })
  }

  const handleResignFromDealer = () => {
    RouletContract.methods.dealerResign().send({from: account}).then(() => {
      console.log('dealer resign completed')
      updateDealerBalance()
    }).catch((error) => {
      console.log(error.message)
      alert(error.message)
    })
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

  const spinBoardProp = { tokenBalance, dealerBalance, handleAddBet, handleRemoveBet, betAmounts, setBetAmounts, mustSpin, setMustSpin, spinResult, handleSpin, handleBuyToken, handleSellToken, editingBetAmounts, setEditingBetAmounts, history, handleBeDealer, handleResignFromDealer, handleDealerDeposit, handleDealerWithdraw }
  const spinResultProp = { spinResultVisible, setSpinResultVisible, spinResult, reward }

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
