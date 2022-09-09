from flask import Flask, render_template, jsonify, request
from flask_pymongo import PyMongo
import datetime
from apscheduler.schedulers.background import BackgroundScheduler, BlockingScheduler

from bs4 import BeautifulSoup
import urllib.request as req
from flask_cors import CORS
import requests
import os
import time
# import cv2
# import numpy
from datetime import datetime
# from bson.objectid import ObjectId


app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = 'mongodb+srv://****:****@****.****.mongodb.net/NFT?retryWrites=true&w=majority'
mongo = PyMongo(app)
col = mongo.db.test


@app.route('/')
def index():
    return 'ok'

sched = BackgroundScheduler()
@app.route('/check', methods=['GET'])
@sched.scheduled_job('cron', hour='04', minute='15', id='test')
def scheduleStockMarket():
    print("schedule start =======================================================================>")
    num = 1
    while num  > 0: # 마감시간
        requests.get('http://39.123.72.111:9000/check_price')
        requests.get('http://39.123.72.111:9000/klay_price')
        time.sleep(20)
    print('end')
    return render_template('index.html')
sched.start()


@app.route('/check_price', methods=['GET','POST'])
def crawlingKrxPrice():
    from selenium import webdriver
    # 셀레니움 사용
    driver = webdriver.Chrome('/home/goldhanwool/workspace/blockChain/co2_NFT/chromedriver')
    krx_url = 'https://ets.krx.co.kr/contents/ETS/03/03010000/ETS03010000.jsp'
    driver.implicitly_wait(3)
    # url에 접근한다.
    driver.get(krx_url)
    time.sleep(3)
    lists = driver.find_elements_by_id("gridtable8f14e45fceea167a5a36dedd4bea2543")
    name = []
    for i in lists:
        text = i.text
        result = text.split()
        name.append(result)
        # print(name)
    # 창닫기
    driver.close()
    krx_data = { name[0][9]: name[0][10], name[0][18]: name[0][19], name[0][28]: name[0][29], name[0][37]: name[0][38], name[0][46]: name[0][47], name[0][55]: name[0][56], name[0][63]: name[0][64], name[0][72]: name[0][73], name[0][81]: name[0][82], name[0][90]: name[0][91], name[0][99]: name[0][100], name[0][108]: name[0][109] }
    # print(krx_data[name[0][9]])
    krx_price = 27000
    return krx_price


@app.route('/klay_price')
def crawlingKlayPrice():
    uri ='https://coinmarketcap.com/ko/currencies/klaytn/'

    res = req.urlopen(uri)
    soup = BeautifulSoup(res,"html.parser",from_encoding="iso-8859-1")
    klay_price = soup.select( 'div.priceValue > span')

    for points in soup.find_all('div', {"class": "priceValue"}):
        point = str(points.text)
        print(point)
        new_str = point.replace('â', '')
        new_str2 = new_str.replace('©', '')
        new_str3 = new_str2.replace(' ', '')
    print(type(new_str3))
    a = new_str3[1:]
    b = float(a)
    c = int(b)
    klay = c
    print(c)
    return klay


# api: 등록 post
@app.route('/insert', methods = ['POST'])
def insert_db():
    # 친환경 제품 디비에서 가져오기
    return 'success'

# 지갑인증 => 완료
@app.route('/auths/<addressId>', methods = ['GET', 'POST'])
def wallet_check(addressId):
    print(addressId)
    # 등록된 지갑 주소인지 확인하고
    user_address_col = mongo.db.user_address
    check_address = user_address_col.find_one({"address": addressId})
    print(check_address)
    if check_address is not None:
        return "auth_success"
    else:
        return "auth_fail"
    # 가입할 것인지 묻는다

# 회원가입
@app.route('/member/signin/<addressId>', methods = ['GET'])
def member_register(addressId):
    # 지갑 주소를 저장
    # 포인트, 가입일시, 지갑주소
    user_address_col = mongo.db.user_address
    post = {
        'address' : addressId,
        'point' : 0,
        'pudate' : datetime.now(),
    }
    x = user_address_col.insert_one(post)
    return str(x.inserted_id)

# qr인증 후 포인트 변수 => 'address' 'qr_id'
@app.route('/qr_check', methods = ['POST'])
def qr_check():
    # request에서 qr 아이디 풀기
    if request.method == "POST":
        print('post===============================================>')
        # address = request.form.get("address")
        # qr_id = request.form.get("qr_id")
        address = request.json['address']
        qr_id = request.json['qr_id']

    # 등록된 지갑 주소인지 확인하고
    print(address, qr_id)
    user_address_col = mongo.db.user_address
    check_address = user_address_col.find_one({"address": address})
    print('check_address: ', check_address)
    if check_address is not None:
        qr_id_col = mongo.db.qr_product
        check_qr = qr_id_col.find_one({"qr_id": qr_id})
        print('check_qr: ', check_qr)
        if check_qr is not None:
            print('check-qr===============================================>')
            # qr_product 콜렉션에서 물건 아이디와 포인트를 가져와서
            # 구매내역에 사용자 아이디와 물건아이디와 포인트를 저장한다
            # 사용자 콜렉션에서 포인트를 업데이트
            print("int(check_qr['point']):   ", int(check_qr['point']))
            print("int(check_address['point']: ", int(check_address['point']))
            point = int(check_qr['point']) + int(check_address['point'])
            post = {
                'user_id' : check_address['_id'],
                'address' : check_address['address'],
                'qr_product_id' : check_qr['_id'],
                'product_name' : check_qr['name'],
                'point' : point,
                'qr_id' : qr_id,
                'pudate' : datetime.now(),
            }
            print('qr_check_history_col ==================================>')
            qr_check_history_col = mongo.db.qr_check_history
            qr_check_history_col.insert_one(post)

            # 사용자 포인트 업데이트
            update_point = user_address_col.update_one({"_id": check_address['_id']}, { "$set":{"point": point} })
            print(update_point)
        return "qr_auth_success"
    else:
        return "qr_auth_fail"


# 포인트 27500원이 되었을 경우 탄소배출권 사용, 포인트로 NFT 만들기 => 'address'
@app.route('/nft/<address>', methods = ['GET', 'POST'])
def check_point(address):
    # 사용자 포인트를 먼저 확인한다.
    user_address_col = mongo.db.user_address
    check_address = user_address_col.find_one({"address": address})
    print(check_address)
    krx_price = requests.get('http://39.123.72.111:9000/check_price')
    klay = requests.get('http://39.123.72.111:9000/klay_price')
    time.sleep(5)
    # ktx-data  이상일 경우면 NFT = 탄소배출권을 발급한다, 해당 포인트 내용들과 함께
    print('krx_price', krx_price)
    print('klay', klay)
    if check_address['point'] > krx_price:
        NFT_price_klay = krx_price / klay
        # 클레이 계산하기
        return 'NFT 발급포인트 전달'
    else:
        return 'nono'

# 포인트 삭제 및 NFT 탄소배출권 등록 => 사용한 포인트와 탄소배출권 종류 및 NFT 토큰 네임 => 'address' 'point' 'NFT NAME'
@app.route('/nft_market/register', methods = ['GET', 'POST'])
def new_NFT():
    if request.method == "POST":
        print('post===============================================>')
        address = request.json['address']
        point = request.json['point']
        NFT_name = request.json['NFT_name']

    # 사용자 포인트 삭제
    user_address_col = mongo.db.user_address
    check_address = user_address_col.find_one({"address": address})
    point = int(check_address['point']) - int(point)
    user_address_col.update_one({"_id": check_address['_id']}, { "$set":{"point": point} })
    # NFT 마켓등록
    post = {
        'user_id' : check_address['_id'],
        'address' : check_address['address'],
        'NFT_name' : NFT_name,
        'pudate' : datetime.now(),
    }

    NFT_market_col = mongo.db.NFT_MARKET
    NFT_market_col.insert_one(post)
    return 'success'

# 나의 NFT 발급 리스트 - smart contract?
@app.route('/myNFT/<address>', methods = ['GET', 'POST'])
def myNFT_list(address):
    user_address_col = mongo.db.user_address
    check_address = user_address_col.find_one({"address": address})
    # 마켓에서 내 NFT만 찾기
    NFT_market_col = mongo.db.NFT_MARKET
    NFT_market_col.find({"user_id": check_address['_id']})


# NFT 마켓
@app.route('/market_NFT', methods = ['GET', 'POST'])
def NFT_market_list():
    # 등록된 NFT 리스트 가져오기
    NFT_market_col = mongo.db.NFT_MARKET
    print('디비연결')
    NFT_list = NFT_market_col.find({})
    datas = []
    for i in NFT_list:
        datas.append(i)
    print(datas)
    print(type(datas))
    return render_template('index.html', data=datas )


# 내 정보보기
@app.route('/my/<address>', methods = ['GET', 'POST'])
def prodsduct_list(address):
    user_address_col = mongo.db.user_address
    check_address = user_address_col.find_one({"address": address})
    return check_address

# 이미지 디비 저장
# @app.route('/fileUpload', methods = ['GET', 'POST'])
# def read_qrcode_cv2():
#     if request.method == 'POST':
#         f = request.files['file']
#         img_col = mongo.db.images
#         post = {
#             'img' : f,
#             'pudate' : datetime.now(),
#         }
#         img_col.insert_one(post)
#         return 'ok'

if __name__ == '__main__':
    app.run('0.0.0.0', debug=True, port=9000)
