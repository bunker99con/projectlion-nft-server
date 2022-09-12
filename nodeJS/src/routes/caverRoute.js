const dotenv = require('dotenv');
dotenv.config();
const { Router } = require('express');
const caverRouter = Router();
const Caver = require('caver-js');
// const caver = new Caver('https://api.baobab.klaytn.net:8651/');

COUNT_CONTRACT_ADDRESS = process.env.COUNT_CONTRACT_ADDRESS;
NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
MARKET_CONTRACT_ADDRESS = process.env.MARKET_CONTRACT_ADDRESS;
ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
CHAIN_ID = process.env.CHAIN_ID;
// 한줄로 만들었을 경우 error : Use emitter.setMaxListeners() to increase limit
KIP17ABI = [{"constant": true,"inputs": [{"name": "interfaceId","type": "bytes4"}],"name": "supportsInterface","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "name","outputs": [{"name": "","type": "string"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "tokenId","type": "uint256"}],"name": "getApproved","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "to","type": "address"},{"name": "tokenId","type": "uint256"}],"name": "approve","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "totalSupply","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "from","type": "address"},{"name": "to","type": "address"},{"name": "tokenId","type": "uint256"}],"name": "transferFrom","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [{"name": "owner","type": "address"},{"name": "index","type": "uint256"}],"name": "tokenOfOwnerByIndex","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "to","type": "address"},{"name": "tokenId","type": "uint256"}],"name": "mint","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "from","type": "address"},{"name": "to","type": "address"},{"name": "tokenId",
"type": "uint256"}],"name": "safeTransferFrom","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [{"name": "index","type": "uint256"}],"name": "tokenByIndex","outputs": [{"name": "",    "type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "to","type": "address"},{"name": "tokenId","type": "uint256"},{"name": "tokenURI","type": "string"}],"name": "mintWithTokenURI","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [{"name": "tokenId","type": "uint256"}],"name": "ownerOf","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "owner","type": "address"}],
"name": "balanceOf","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "symbol","outputs": [{"name": "","type": "string"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,
"inputs": [{"name": "account","type": "address"}],"name": "addMinter","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [],"name": "renounceMinter","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "to","type": "address"},{"name": "approved","type": "bool"}],"name": "setApprovalForAll","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [{"name": "account","type": "address"}],"name": "isMinter","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "from","type": "address"},{"name": "to","type": "address"},{"name": "tokenId","type": "uint256"},{"name": "_data","type": "bytes"}],"name": "safeTransferFrom","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [{"name": "tokenId","type": "uint256"}],"name": "tokenURI","outputs": [{"name": "","type": "string"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "owner","type": "address"},{"name": "operator","type": "address"}],"name": "isApprovedForAll","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"},{"inputs": [{"name": "name","type": "string"},{"name": "symbol","type": "string"}],"payable": false,"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"name": "account","type": "address"}],"name": "MinterAdded","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "account","type": "address"}],"name": "MinterRemoved","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "from","type": "address"},{"indexed": true,"name": "to","type": "address"},{"indexed": true,"name": "tokenId","type": "uint256"}],"name": "Transfer","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "owner","type": "address"},{"indexed": true,"name": "approved","type": "address"},{"indexed": true,"name": "tokenId","type": "uint256"}],"name": "Approval","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "owner","type": "address"},{"indexed": true,"name": "operator","type": "address"},{"indexed": false,"name": "approved","type": "bool"}],"name": "ApprovalForAll","type": "event"}]

// console.log(KIP17ABI)

const option = {
    headers: [
      {
        name: 'Authorization',
        value: "Basic " + Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64")
      },
      { name: "x-chain-id", value: CHAIN_ID },
    ],
  }

const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option));
console.log('caver 접속 중 ...')
const NFTContract = new caver.contract(KIP17ABI, NFT_CONTRACT_ADDRESS)

//사용자 잔고가져오기
caverRouter.post('/balance/:address', async (req, res) => {
    const { address } = req.params
    console.log(address)
    return caver.rpc.klay.getBalance(address).then((response) => {
        const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response));
        console.log(`BALANCE: ${balance}`);
        return res.send({balance});
    })
})

caverRouter.post('/fetchCard/:address', async (req, res) => {
    const { address } = req.params
    console.log(address)
    // Fetch Balance
    // 토큰 갯수
    const balance = await NFTContract.methods.balanceOf(address).call();
    console.log(balance);
    // Fetch Token Ids 
    const tokenIds = [];
    for(let i = 0; i<balance; i++) {
        const id = await NFTContract.methods.tokenOfOwnerByIndex(address, i).call(); //토큰 번호
        tokenIds.push(id);
    }
    // Fetch Token Uris
    const tokenUris = [];
    for(let i = 0; i<balance; i++) {
        const uri = await NFTContract.methods.tokenURI(tokenIds[i]).call() // 토큰 URL 주소
        tokenUris.push(uri);
    }
    const nfts = [];
    for(let i = 0; i<balance; i++) {
        nfts.push({uri: tokenUris[i], id: tokenIds[i]})
    }
    console.log(nfts)
    return res.send({balance});
})


// 통신확인
caverRouter.get('/', async (req, res) => {
    try {
        const version = await caver.rpc.klay.getClientVersion()
        console.log(version)
        return res.send({version})
    }catch(err){
        return err.message
    }
})

 module.exports = {
    caverRouter
 }