const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { User } = require('./model/User')
const { Qr_product } = require('./model/Qr_product')
const { Nft_list } = require('./model/NFT_list')
const { caverRouter } = require('./routes/caverRoute')
const { klipRouter } = require('./routes/klipRoute')
const MONGO_URI = 'mongodb+srv://****';
const axios = require("axios");

// mongoose.connect(MONGO_URI).then(result => console.log({result})) 
mongoose.connect(MONGO_URI).then(result => console.log('MongoDB_접속 중 =======> ' + result['connections'][0]['states']['connected'])) 
app.use(express.json())

app.use('/caver', caverRouter)
app.use('/klip', klipRouter)

// 지갑인증 => 완료
app.get('/', (req, res) => {
    return res.send("hello world")
})

// 클레이 시세가져오기
app.get('/flask/klay_price', async (req, res) => {
 try {
        const response = await axios.get('http://39.123.72.111:9000/klay_price');
        console.log(response["data"]["data"]);
        const klay_price = response["data"]["data"]
        return res.send({klay_price})
      } catch (error) {
        console.error(error);
      }
})

// 탄소 배출권 시세 가져오기
app.get('/flask/KAU_price', async (req, res) => {
    try {
           const response = await axios.get('http://39.123.72.111:9000/check_price');
           console.log(response["data"]["data"]);
           return res.send(response["data"]["data"]) //{"KAU22":"27,100"}
         } catch (error) {
           console.error(error);
         }
   })
   

// 지갑인증 => 완료
app.post('/auths/:address', async (req, res) => {
    try {
        const { address } = req.params;
        const user = await User.findOne({ address: address});
        if ( !user ) return res.send( '회원 아님' )
        else return res.send( '회원임' )
    }catch(err){
        return res.status(500).send({ err: err.message })
    }
})

// qr인증
app.post('/qr_check', async (req, res) => {
    try {
        console.log('qr_check')
        const address = req.body.address
        const qr_id = req.body.qr_id
        // db check
        const qr_product = await Qr_product.findOne({ qr_id: qr_id });
        // qr_id가 없어 인증제품이 아닐 경우
        if ( !qr_product ) return res.send( '등록되지 않은 친환경 제품입니다.' )
        console.log('qr_product => ' + qr_product)
        const qr_point = qr_product["point"]
        console.log('qr_point => ' + qr_point)
        const qr_check = qr_product["qr_check"]
        console.log('qr_check => ' + qr_check)

        // 제품이 이미 인증된 제품인지 여부체크
        if ( qr_check === true ) return res.send( '이미 인증된 제품입니다.' )

        // 사용자가 db에 저장되어 있는지 확인
        const user = await User.findOne({ address: address });
        console.log('user: => ' + user)
        // 만약 사용자가 없으면 회원가입를 동시에 진행하고 
        // 사용자가 기존에 있다면 포인트 업데이트만 진행 
        if ( !user ) {      
            const new_user = new User({ 'address': address, 'point': qr_point })
            await new_user.save();
            await Qr_product.updateOne({ 'qr_id': qr_id } , { $set: { 'qr_check': true }});
            return res.send( { new_user } )   
        } else { 
            const user_point = user['point']
            console.log('user_point => ' + user_point)
            const point_sum = user_point + qr_point 
            const new_qr_product = await User.updateOne({ 'address': address } , { $set: { 'point': point_sum }});
            await Qr_product.updateOne({ 'qr_id': qr_id } , { $set: { 'qr_check': true }});
            console.log(new_qr_product)
            return res.send( { new_qr_product } )   
        }
    }catch(err){
        return res.status(500).send({ err: err.message })
    }
})

app.get('/get_list_NFT', async (req, res) => {
    try { 
        const NFT_list = await  Nft_list.find({});
        return res.send({NFT_list})
    } catch(err) {
        return res.send(err.message)
    }
});

app.post('/save_NFT', async (req, res) => {
    try { 
        const { address, name, price } = req.body
        const NFT_list = new Nft_list({ 'address': address, 'name': name, 'price': price })
        await NFT_list.save();
        return res.send("success")
    } catch(err) {
        return res.send(err.message)
    }
});


app.listen(3003, () => console.log('server listening on port 3003'))
