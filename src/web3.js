import Web3 from 'web3'

const web3 = new Web3(window.ethereum)
web3.eth.defaultAccount = web3.eth.accounts[0]

export default web3