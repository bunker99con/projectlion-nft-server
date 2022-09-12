const dotenv = require('dotenv');
dotenv.config();
const axios = require("axios");
const { Router } = require('express');
const klipRouter = Router();
// const { prepare, request, getResult, getCardList } = require('klip-sdk');

const A2P_API_PREPARE_URL = "https://a2a-api.klipwallet.com/v2/a2a/prepare";
const APP_NAME = "KLAY_MARKET";
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS

// window가 필요함 
klipRouter.get('/', async (req, res) => {
    const bappName = 'my app'
    const successLink = 'localhost:3003'
    const failLink = 'localhost:3003'
    const response = await prepare.auth({ bappName, successLink, failLink })
    if (response.err) {
      return res.send(err.message)
    } else if (response.request_key) {
      // request_key 보관
      const request_key = response.request_key
      return res.request_key
    }
})

klipRouter.post('/mint', async (req, res) => {
    const { toAddress, tokenId, uri, setQrvalue } = req.body
    const functionJson = '{ "constant": false, "inputs": [ { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" }, { "name": "tokenURI", "type": "string" } ], "name": "mintWithTokenURI", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }';
    console.log("before excuteContract")
    const value = setQrvalue;
    const params = `[\"${toAddress}\",\"${tokenId}\",\"${uri}\"]`;
    console.log("excuteContract tokenId: " + tokenId)
    try { 
       const a = await axios.post(
        A2P_API_PREPARE_URL, {
            bapp: {
                name: APP_NAME,
            },
            type: "execute_contract",
            transaction: {
                to: NFT_CONTRACT_ADDRESS,
                abi: functionJson,
                value: value,
                params: params
            }
        }
        ).then((response) => {
            const { request_key } = response.data;
            const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
            setQrvalue(qrcode);
            let timerId = setInterval(() => {
                axios
                .get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`)
                .then((res) => {
                    if (res.data.result) {
                        console.log(`[Result] ${JSON.stringify(res.data.result)}`);
                        callback(res.data.result);
                        clearInterval(timerId);
                    }
                })
            }, 1000) 
        })
    } catch(err) {
        return err.message
    }
    return ({ a });
})

// 핸드폰으로 해야되는 부분.
klipRouter.get('/get_address', (req, res) => {
// export const getAddress = (setQrvalue, callback) => {
    console.log('get_address=====================================================================>')
    axios.post(
        A2P_API_PREPARE_URL, {
            bapp: {
                name: APP_NAME
            },
            type: "auth"
        }
    ).then((response) => {
        const { request_key } = response.data;
        // const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
        // setQrvalue(qrcode);
        let timerId = setInterval(() => {
            axios
            .get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`) //결과값 가져오기
            .then((res) => {
                if (res.data.result) {
                    console.log(`[Result] ${JSON.stringify(res.data.result)}`);
                    callback(res.data.result.klaytn_address);
                    clearInterval(timerId)
                }
            })
        }, 1000) 
    })
});

module.exports = {
    klipRouter
 }