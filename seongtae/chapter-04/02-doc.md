# **Chapter-04**

## 4.2 서버 사이드 렌더링을 위한 리액트 API 살펴보기**

서문에서 전하는 이야기
- 리액트는 리액트 앱을 서버에서 렌더링할 수 있는 API를 제공함
  - 당연히 Node.js 환경에서만 실행
- **react-dom이 서버에서 렌더링하기 위한 다양한 메서드**가 있음

## Table of contents
- [1.1. renderToString](#11-rendertostring)
- [1.2. renderToStaticMarkup](#12-rendertostaticmarkup)
- [1.3. renderToNodeStream](#13-rendertonodestream)
- [1.4 renderToStaticNodeStream](#14-rendertostaticnodestream)

---


## 1.1. renderToString
인수로 넘겨받은 리액트 컴포넌트를 렌더링해 HTML 문자열로 반환하는 함수
- SSR을 구현하는데 가장 기초적인 API
- 최초의 페이지를 HTML로 먼저 렌더링하는 역할을 수행


### renderToString 결과물

```html
<div id="root" data-reactroot="">
  <div>hello</div>
  <ul>
    <li>apple</li>
    <li>banana</li>
    <li>peach</li>
  </ul>
</div>
```

한 가지 눈여겨볼 것은 useEffect와 handleClick과 같은 훅과 이벤트 핸들러가 결과물에 포함되지 않은 점.
- renderToString 함수는 주어진 리액트 컴포넌트를 기반으로 렌더링할 수 있는 HTML을 생성하는 역할을 수행 
  - 즉, 자바스크립트 코드를 포함하거나 렌더링하는 역할은 하지 않음
- 필요한 자바스크립트 코드는 생성된 HTML과는 별도로 제공되어 브라우저에서 실행되어야 함


- (서버 사이드 렌더링의 장점인)초기 렌더링에서 뛰어난 성능을 보여줄 수 있음
- 검색 엔진이나 소셜 미디어 공유를 위한 메타 정보를 사전에 제공할 수 있음
- '최초 HTML 페이지를 빠르게 그려주는 데'에 목적이 있으므로 useEffect나 이벤트 핸들러와 같은 기능은 없음
  - 상호 작용을 위해서는 별도의 자바스크립트 코드가 다운로드, 파싱, 실행하는 과정을 거쳐야 함
- div#root에 있는 data-reactroot 속성
  - 리액트 컴포넌트의 루트 엘리먼트를 식별하는 역할
  - hydrate 함수에서 루트를 식별하는 데 사용

---

## 1.2. renderToStaticMarkup

### renderToStaticMarkup 결과물

```html
<div id="root">
  <div>hello</div>
  <ul>
    <li>apple</li>
    <li>banana</li>
    <li>peach</li>
  </ul>
</div>
```

- renderToStaticMarkup은 renderToString과 매우 유사하지만 루트 요소에 추가한 data-reactroot와 같은 리액트에서만 사용하는 DOM 속성을 만들지 않음
  - 결과물인 HTML의 크기를 아주 약간 줄일 수 있다는 장점이 있음
- 리액트의 이벤트 리스너가 필요 없는 완전히 순수한 HTML을 생성할 때만 사용됨
  - 블로그 글이나 상품의 약관 정보와 같이 브라우저 동작이 없는 정적 내용만 필요한 경우에 유용


## 1.3. renderToNodeStream

- renderToNodeStream은 renderToString과 결과물이 완전히 동일하지만 두 가지 차이점이 있음

### 첫 번째 차이점 실행 환경
- renderToString과 renderToStaticMarkup은 브라우저에서도 실행할 수 있지만, renderToNodeStream은 브라우저에서 사용할 수 없음 
  - 완전히 Node.js 환경에 의존


### 두 번째 차이점은 결과물의 타입
- renderToString은 문자열인 결과물을 반환하지만, renderToNodeStream은 Node.js의 ReadableStream을 결과물로 반환
  - ReadableStream은 Node.js 환경에서만 사용할 수 있는 utf-8로 인코딩된 바이트 스트림입니다. 
- 브라우저가 원하는 string 형태의 결과물을 얻으려면 추가적인 처리가 필요
- renderToNodeStream은 데이터를 스트림 형태로 처리하기 때문에 대용량 데이터를 효율적으로 처리할 수 있음
  - 이는 유튜브와 같은 동영상 스트리밍 서비스에서 사용되는 개념과 유사
- 대용량 데이터를 한 번에 처리하는 것이 부담스러울 때, 데이터를 청크 단위로 분할하여 순차적으로 처리할 수 있음 


### renderToNodeStream 예제

```js
// Node.js 코드
const fetch = require('node-fetch');

(async () => {
    const response = await fetch('http://localhost:3000');
    try {
        for await (const chunk of response.body) {
            console.log('---------chunk--------');
            console.log(Buffer.from(chunk).toString());
        }
    } catch (err) {
        console.error(err.stack);
    }
})();
```

- 스트림을 활용하여 HTML을 작은 단위로 쪼개 연속적으로 작성함으로써 리액트 애플리케이션을 렌더링하는 Node.js 서버의 부담을 줄일 수 있음
  - HTTP 응답이 거대한 HTML 파일이 완성될 때까지 기다리지 않고도 클라이언트에게 작은 청크부터 즉시 렌더링된 결과를 전송할 수 있음

## 1.4 renderToStaticNodeStream

renderToString에 renderToStaticMarkup이 있는 것처럼, renderToNodeStream에도 renderToStaticNodeStream이 있음
- 결과물은 동일한 HTML을 제공하지만, 리액트 자바스크립트에 필요한 속성이 포함되지 않음 
- hydrate를 수행할 필요가 없는 순수한 HTML 결과물이 필요한 경우 사용
