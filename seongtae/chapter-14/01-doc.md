# **Chapter-14 웹 사이트 보안을 위한 리액트와 웹페이지 보안이슈**
프론트엔드에서 증대하는 **보안의 위험성**을 줄일 수 있는 방법


**학습 목표**
- 프론트엔드 개발자가 조심해야 할 보안 이슈
- 

## Table of contents
- [14-1 리액트에서 발생하는 크로스 사이트 스크립팅](#14-1-리액트에서-발생하는-크로스-사이트-스크립팅)
- [14-2 getServerSideProps와 서버 컴포넌트를 주의하자](#14-2-getserversideprops와-서버-컴포넌트를-주의하자)
- [14-3 a태그의 값에 적절한 제한을 둬야 한다](#14-3-a태그의-값에-적절한-제한을-둬야-한다)

---

## 14-1 리액트에서 발생하는 크로스 사이트 스크립팅

### dangerouslySetlnnerHTML prop
DOM의 innerHTML을 특정한 내용으로 교체할 수 있는 방법이며, 일반적으로 게시판과 같이 사용자나 관리자가 입력한 내용을 브라우저에 표시하는 용도로 사용됨

- dangerouslySetlnnerHTML은 오직 `__html`을 키를 가지고 있는 객체만 인수로 받을 수 있음
- dangerouslySetlnnerHTML이 인수로 받는 문자열에는 제한이 없음
  - dangerouslySetlnnerHTML의 위험성이 큰 이유

### useRef를 활용한 직접 삽입


> 공통적인 문제는 웹사이트 개발자가 만들지 않은 코드를 삽입한다는 것

### 리액트에서 XSS 문제를 피하는 방법
리액트에서 XSS 문제를 피하는 가장 확실한 방법은 제3자가 삽입할 수 있는 HTML을 안전한 HTML 코드로 한 번 치환하는 것

- 치환 과정을 새니타이즈 또는 이스케이프라고 함

#### 관련 라이브러리

- DOMpurity
- sanitize-html
- js-xss

#### XSS 문제를 피하는 기법

- 허용 목록(allow list)이 훨씬 안전함
  - 차단 목록으로 해야 할 것을 놓친다면 즉시 보안 이슈로 연결됨
- 콘텐츠를 저장할 때도 새니타이즈 또는 이스케이프를 거치는 것이 효율적이고 안전
  - XSS 위험성이 없는 콘텐츠를 DB에 저장
  - 한 번 이스케이프 후에는 이스케이프 과정을 거치지 않아도 됨
  - 치환 과정은 되도록 서버에서 수행하는 것이 좋음


## 14-2 getServerSideProps와 서버 컴포넌트를 주의하자


## 14-3 a태그의 값에 적절한 제한을 둬야 한다
`<a>` 태그의 href에 javascript:로 시작하는 자바스크립트 코드는 href로 선언된 URL로 페이지를 이동하는 것을 막고 onClick 이벤트와 같이 별도 이벤트 핸들러만 작동하는 용도로 사용하는 안티패턴

- href가 작동하지 않는 것이 아니라 javascript:;만 실행
- XSS 사례와 비슷하게 사용자가 주소를 넣을 수 있다면 보안 이슈가 됨

## 14-4 HTTP 보안 헤더 설정하기
HTTP 보안 헤더란 브라우저가 렌더링하는 내용과 관련된 보안 취약점을 미연에 방지하기 위해 브라우저와 함께 작동하는 헤더를 의미


### Strict-Transport-Security
모든 사이트가 HTTPS를 통해 접근해야 하며, HTTP로 접근하는 경우 모든 시도는 HTTPS로 변경

```
Strict-Transport-Security: max-age=<expire-time>; includeSubDomains
```

- `<expire-time>`은 이 설정을 브라우저가 기억해야 하는 시간을 의미하며，초 단위로 기록
-  이 기간 내 HTTP로 요청한다 하더라도 브라우저는 이 시간을 기억하고 있다가 자동으로 HTTPS로 요청

### X-XSS-Protection
X-XSS-Protection은 비표준 기술로，현재 사파리와 구형 브라우저에서만 제공되는 기능 

- 이 헤더는 페이지에서 XSS 취약점이 발견되면 페이지 로딩을 중단
- Content-Security-Policy가 있다면 필요 없음 
  - Content-Security-Policy를 지원하지 않는 구형 브라우저에서는 사용이 가능
  - 반드시 페이지 내부에서 XSS에 대한 처리가 존재해야 함(이 헤더를 전적으로 신뢰 X)

### X-Frame-Options
페이지를 frame, iframe, embed, object 내부에서 렌더링을 허용할지를 나타낼 수 있다. 

- 외부에서 자신의 페이지를 삽입하는 것을 막아주는 헤더
- `X-Frame-Options: deny`


### Permissions-Policy
웹사이트에서 사용할 수 있는 기능과 사용할 수 없는 기능을 명시적으로 선언하는 헤더

- 개발자는 다양한 브라우저의 기능이나 API를 선택적으로 활성화하거나 필요에 따라서는 비활성화할 수도 있음

```bash
# pip 기능을 막고, geolocation은 자신과 특정 페이지만 허용하며,
# 카메라는 모든 곳에서 허용한다.
Permissions-Policy: picture-in-picture=(), geolocation=(self https://yceffort.kr), camera=*;
```

### X-Content-Type-Options

> 이 헤더를 이해하려면 먼저 MIME이 무엇인지 알아야 함. 

> MIME란 Multipurpose Internet Mail Extensions의 약자로，Content-type의 값으로 사용

- 원래는 메일을 전송할 때 사용하던 인코딩 방식으로，현재는 Content-type에서 대표적으로 사용
- 웹서버가 브라우저에 강제로 이 파일을 읽는 방식을 지정


### Referrer-Policy

#### Referer 헤더
HTTP 요청 Referer라는 헤더는 현재 요청을 보낸 페이지의 주소가 나타남. 
- 만약 링크를 통해 들어왔다면 해당 링크를 포함하고 있는 페이지 주소가, 다른 도메인에 요청을 보낸다면 해당 리소스를 사용하는 페이지의 주소가 포함. 
- 이 헤더는 사용자가 어디서 와서 방문 중인지 인식할 수 있는 헤더지만, 반대로 사용자 입장에서는 원치 않는 정보가 노출될 위험도 존재.

> Referrer-Policy 헤더는 이 Referer 헤더에서 사용할 수 있는 데이터를 나타냄

> 구글에서는 이용자의 개인정보 보호를 위해 strict-origin-when-cross-origin 혹은 그 이상을 명시적으로 선언해 둘 것을 권고. 만약 이 값이 설정돼 있지 않다면 브라우저의 기본값으로 작동하게 되어 웹사이트에 접근하는 환경별로 다른 결과를 만들어내어 혼란을 야기할 수 있으며，이러한 기본값이 없는 구형 브라우저에서는 Referer 정보가 유출될 수도 있음

