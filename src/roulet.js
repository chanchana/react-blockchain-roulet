import web3 from './web3'
const roulet_json = require('./contracts/Roulet.json')
const abi = roulet_json['abi']
const address = roulet_json['networks']["5777"]["address"]
console.log(web3.eth.accounts)
console.log(web3.eth.accounts[0])
const Contract = new web3.eth.Contract(abi, address, {
    from: web3.eth.accounts[0],
})
export default Contract 