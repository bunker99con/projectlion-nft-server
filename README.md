*서버실행시 - VS코드기준

파이썬 가상환경설치
모듈다운로드
터니널에서 python run.py 실행
*필요다운로드 모듈 리스트
pip install flask
pip install beautifulsoup4
pip install apscheduler
pip install flask-pymongo
pip install requests
pip install flask_cors
pip install selenium
pip install urllib3
pip install "pymongo[srv]"

*디비구조(mongo)

NFT 마켓 - 구매, 판매
collection - NFT_MARKET(NFT리스트)
document - id, user_id, address, NFT_name, createAt

친환경제품
collection - product
document - id, name, price, process, point, createAt

qr 인증 히스토리
collection - qr_check_history
document - id, user_id, address, qr_product_id, product_name, point, qr_id, createAt

qr 인증을 위한 아이디
collection - qr_product
document - id, name, price, process, point, qr_id, createAt

유저 테이블
collection - user_address
document - id, address, point, createAt
