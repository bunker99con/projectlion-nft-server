# BackEnd
### 1. 요약
##### 탄소배출권 NFT발행을 위한 사용자 포인트 등록과 기업 사용자의 탄소배출권 구매 마켓 구축 프로젝트

### 2. 백엔드 구성 로직
##### 주요스펙: nodeJs, mongoDB, flask,

<br />
<img width="60%" src="https://user-images.githubusercontent.com/70783496/189588607-1b1c670f-dc81-400c-9102-dd58b830342d.png">
<br />

### 3. 주요기능
* 시세크롤링 - clay시세, 탄소배출권 
* db 내 사용자 제품 인증 확인 및 포인트 적립
* 사용자 포인트를 탄소배출권 NFT로 발행
* 탄소배출권 NFT 발행시 사용자 포인트 차감
* 탄소배출권 NFT 내역 저장
* 탄소배출권 NFT 불러오기
<br />

### 4. DB 구조
<img width="60%" src="https://user-images.githubusercontent.com/70783496/189596083-28a8c893-3003-448b-9698-e3cd83af3fda.png">
<br />

### 5. 폴더 구조(nodeJs)
<br />
<img width="30%" src="https://user-images.githubusercontent.com/70783496/189598760-05ab0238-9b17-4b04-96cd-58e3371f8f72.png">
<br />

### 6. 보완점
프론트 Api 연결 부분, NFT 발행 부분 미구축 => 프론트에서 윈도우 및 QR로 접근하지 않고 백엔드 부분에서 KLIP API를 사용하여 클립APP 또는 카카오톡을 실행하는데 있어 문제해결이 필요함.
 

<br />

### 7. 사용법
* flask_server => requierment.txt 파일 내 모듈 다운(pip install 모듈이름) => 터미널에서 python run.py실행
* nodeJs_server => npm install => 터미널에서 npm run dev 실행



