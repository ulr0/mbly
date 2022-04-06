## Mbly
<hr/>
여러 쇼핑몰들이 입점할 수 있는 메가 쇼핑몰 웹사이트 구현
<br/>
<br/>

## About Project
<hr/>

Members : 1인 프로젝트
<br/>
Developing Period : 2022.01-2022.02
<br/>
<br/>
어플리케이션 : Python Django JavaScript React JWT ElasticSearch S3
<br/>
데이터베이스 : MySQL RDS


## 구현 기능
<hr/>

### 상품 상세 페이지 
<img src='https://ulr0-bucket.s3.ap-northeast-2.amazonaws.com/%E1%84%89%E1%85%A1%E1%86%BC%E1%84%89%E1%85%A6.gif'/>

- 상품 id에 해당하는 상품의 정보 및 옵션 정보 표출
- 상품 옵션 선택 및 수량 변경
- '장바구니 담기' 버튼 클릭 시 선택된 상품 장바구니에 추가

### 상품 검색
<img src='https://ulr0-bucket.s3.ap-northeast-2.amazonaws.com/%E1%84%80%E1%85%A5%E1%86%B7%E1%84%89%E1%85%A2%E1%86%A8.gif'/>

- 서버는 클라이언트로부터 받은 검색어로 엘라스틱서치 서버에 조회 요청

### 장바구니
<img src='https://ulr0-bucket.s3.ap-northeast-2.amazonaws.com/%E1%84%8C%E1%85%A1%E1%86%BC%E1%84%87%E1%85%A1%E1%84%80%E1%85%AE%E1%84%82%E1%85%B5.gif'/>

- checkbox에 선택된 상품들의 합계 금액이 총 결제금액에 반영

### [마스터, 셀러] 상품 리스트
- 마스터 계정인 경우 모든 상품, 셀러 계정인 경우 해당 셀러의 제품을 테이블로 표출
- 옵션 열기(닫기) 버튼 클릭 시 해당 상품의 옵션 정보를 보여주는 모달창 On/Off
- 삭제 버튼 클릭 시 해당 상품 삭제

### [마스터, 셀러] 상품 등록
- 상품 등록 버튼 클릭 시 클라이언트는 서버로 상품 정보들과 이미지 파일들 보냄
- 서버는 클라이언트로부터 받은 이미지 파일들을 S3에 업로드 후 url을 return하여 데이터베이스에 저장

### [일반 회원] 회원가입
- 이메일, 비밀번호, 휴대폰 번호를 입력받아 회원 정보를 데이터베이스에 추가

### 로그인
- Redux를 사용해서 로그인 상태 관리 및 로그인 유지
- 로그아웃 기능 구현

### 소셜로그인
- 외부 API(카카오)를 사용한 소셜 로그인 기능 구현