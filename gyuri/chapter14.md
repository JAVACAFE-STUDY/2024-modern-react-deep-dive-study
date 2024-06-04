# 14 웹사이트 보안을 위한 리액트와 웹페이지 보안 이슈

프런트엔드 개발자가 조심해야 할 부분

## 크로스 사이트 스크립팅(XSS)

제3자가 웹사이트에 악성 스크립트를 삽입해 실행할 수 있는 취약점

```html
<p>사용자가 글을 작성했습니다.</p>
<script>
  alert('XSS1)
</script>
```

> 💡문자열을 DOM에 그대로 표시하는 역할을 하는 것들을 위주로 봐야한다.

### dangerouslySetlnnerHTML

- 일반적으로 게시판과 같이 사용자나 관리자가 입력한 내용을 브라우저에 표시하는 용도로 사용
- dangerouslySetlnnerHTML이 인수로 받는 문자열에는 제한이 없다

```ts
const html = `<span><svg/onload=alert(origin)></span>`;

function App() {
  return <div dangerouslySetInnerHTML={{ html }} />;
}

export default App;
```

### useRef를 활용한 직접 삽입

```ts
const html = "<span><svg/onload=alert(origin)></span>";

function App() {
  const divRef = useRef<HTMLDivElement>(nuU);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.innerHTML = html;
    }
  });

  return <div ref={divRef} />;
}
```

이외에는

- `<a>` 태그에 잘못된 href를 삽입
- onclick, onload 이벤트

### 리액트에서 XSS 문제를 피하는 방법

새니타이즈(sanitize), 이스케이프(escape)

- 제3자가 삽입할 수 있는 HTML을 안전한 HTML 코드 로 한 번 치환하는 것
- DOMpurity( https://github.com/cure53/DOMPurify)
- sanitize-html( https://github.com/apostrophecms/sanitize-html)
- js-xss( https://github.com/leizongmin/js-xss)

**sanitize-html**

- 허용 목록(allow list) 방식 : 허용할 태그와 목록을 일일히 나열

사용자가 콘텐츠를 저장할 때도 한번 이스케이프 과정 을 거치는 것이 더 효율적이고 안전
치환 과정은 되도록 서버에서 수행하는 것이 좋다.
스크립트나 curl 등으로 직접 요청하는 경우에는 스크립트에서 실행하는 이스케이프 과정을 생략하고 바로 저장될 가능성이 있기 때문이다.

쿼리스트링에 있는 내용을 그대로 실행하거나 보여주는 경우 에도 보안 취약점이 발생할 수 있다
query, GET 파라미터，서버에 저장된 사용자가 입력한 데이터 등 외부에 존재하는 모든 코드를 위험한 코드로 간주하고 이를 적절하게 처리하는 것이 좋다.

> 리액트의JSX 데이터바인딩
> 리액트는 XSS를 방어하기 위해 이스케이프 작업이 존재한다.

```ts
const html = '<span><svg/onload=alert(origin)x/span>,

function App() {
return <div id={htnil}>{html}</div>

}
```

> `<div>{html}</div>`와 같이 HTML에 직접 표시되는 textcontent와 HTML 속성값에 대해서는 리액트가 기본적으로 이스케이프 작업을 해준다.
>
> dangerouslySetlnnerHTML이나 props로 넘겨받는 값의 경우 개발자의 활용도에 따라 원본 값이 필요할 수 있기 때문에 이러한 작업이 수행되지 않는다.

## getServerSideProps 서버 컴포넌트를 주의하자

서버에는 일반 사용자에게 노출되면 안 되는 정보들이 담겨 있기 때문에 클라이언트，즉 브라우저에 정보를 내려줄 때는 조심해야 한다.

- Redirect 같이 getServerSideProps에서 처리할 수 있는 것들은 서버에서 처리하자.
- 필요한 값만 props로 반환하자.
  - 헤더 cookie 전체를 반환하는 것이 아니라, 필요한 token값만 반환한다.

## `<a>` 태그의 값에 적절한 제한을 둬야 한다

- `<a>` 태그의 href에 javascript: 로 시작하는 자바스크립트 코드를 넣을 수 있는데, href로 선언된 URL로 페이지 이동을 막고 특정 이벤트 핸들러를 작동시키기 위한 용도로 주로 사용된다.
- 마크업 관점에서도 안티 패턴일 뿐더러, 리액트 상에서 권고하는 방식이 아니기 때문에 경고문과 함께 랜더링 되게 된다. a태그는 반드시 페이지 이동이 있을 때만 사용하는 것이 좋다.이럴땐 button을 사용하는 것이 좋다.
- href에 사용자가 입력한 주소를 넣을 수 있다면 피싱 사이트 같은 보안 이슈가 있을 수 있기 때문에 가능하다면 origin도 확인해 처리하는 것이 좋다.

## HTTP 보안 헤더설정하기

### Strict-Transport-Security

```
Strict-T ransport-Security: max-age=<expire-1ime>; includeSubDomains
```

- HTTP의 `Strict-Transport-Security` 응답 헤더는 모든 사이트가 HTTPS를 통해 접근해야 하며, 만약 HTTP로 접근할 경우 모든 시도는 HTTPS로 변경되게 한다.

### X-XSS-Protection

- X-XSS-Protection은 비표준 기술로 현재 사파리와 구형 브라우저에만 제공되는 기능인데, 이 헤더는 페이지에서 XSS 취약점이 발견되면 페이지 로딩을 중단하는 헤더.
- CSP(Content-Security-Policy)가 있다면 그다지 필요 없지만 CSP를 지원하지 않는 구형 브라우저에서는 사용이 가능합니다. 단, 이 헤더를 전적으로 믿어서는 안 되고 반드시 페이지 내부에서 XSS에 대한 처리가 필요합니다.

```
X-XSS-Protection: 0
X-XSS-Protection: 1
X-XSS-Protection: 1; mode=block
X-XSS-Protection: 1; report=<reporting-uri>
```

### X-Frame-Options

- X-Frame-Options는 페이지를 frame, iframe, embed, object 내부에서 렌더링을 허용할지를 나타낼 수 있다.
- 네이버를 `<iframe src="https:"www.naver.com" />` 으로 호출하면 페이지가 정상적으로 로딩되지 않는 것을 확인할 수 있는데 그 이유는 응답 헤더에 `X-Frame-Options: deny` 옵션이 있기 때문이다.

```
X-Frame-Options: DENY   %% 만약 위와 같은 프레임 관련 코드가 있다면 무조건 막는다. %%
X-Frame-Options: SAMEORIGIN %% 같은 origin에 대해서만 프레임을 허용한다. %%
```

### Permissions-Policy

- `Permissions-Policy`는 웹사이트에서 사용할 기능과 사용할 수 없는 기능을 명시적으로 선언하는 헤더로, 필요에 따라 비활성화할 수도 있습니다. 예컨대 서비스에서 `geolocation`을 사용하지 않는데 별도로 차단되어 있지 않고 XSS 공격 등으로 이 기능을 이용해서 사용자의 위치 정보를 획득할 수도 있게된다.

### X-Content-Type-Options

> 💡MIME란?
> Multipurpose Internet Mail Extensions의 약자로 `Content-type`의 값으로 사용된다. 이름에서처럼 원래 메일을 전송할 때 사용하던 인코딩 방식으로 현재는 `Content-type`에서 대표적으로 사용되고 있다.

- 브라우저는 `Content-type`이라는 헤더를 참고해 해당 파일에 대해 `HTML`을 파싱하거나 `jpg`, `CSS`, `JSON` 등을 읽게 된다.

1. 예를 들어 어떤 공격자가 `.jpg` 파일을 웹서버에 업로드
2. 사실 그림 관련 정보가 아닌 스크립트 정보라고 가정
3. 브라우저는 `.jpg`로 파일을 요청했지만 실제 파일 내용은 스크립트인 걸 보고 실행할 수 있음
4. 이 경우 `X-Content-Type-Options: nosniff` 헤더를 설정하면 파일의 타입이 `CSS`나 MIME이 `text/css`가 아닌 경우, 혹은 파일 내용이 `script`나 MIME 타입이 자바스크립트 타입이 아니면 차단하게 된다.

### Referrer-Policy

### Content-Security-Policy

### 보안 헤더설정하기

#### Next.js

- Next.js에서는 애플리케이션 보안을 위해 HTTP 경로별로 보안 헤더를 적용할 수 있습니다. 이 설정은 `next.config.js`에서 다음과 같이 추가할 수 있습니다.

#### NGINX

- 정적인 파일을 제공하는 NGINX의 경우 다음과 같이 경로별로 `add_header` 지시자를 사용해 원하는 응답 헤더를 추가할 수 있습니다.

### 보안 헤더확인하기

[https://securityheaders.com/](https://securityheaders.com/) 에서 확인 가능

## 취약점이 있는 패키지의 사용을 피하자

- 사용 중인 패키지나 라이브러리에 대해서는 버전에 따라 보안 취약점이 존재할 수도, 혹은 업데이트 이후에 보안 취약점이 새로 나타나거나 할 수 있기 때문에 항상 예의주시하고 빠르게 업데이트해 조치해야 한다.

## OWASP Top 10

- OWASP은 Open Worldwide (Web) Application Security Project라는 오픈소스 웹 애플리케이션 보안 프로젝트를 의미합니다. 주로 웹에서 발생할 수 있는 정보 노출, 악성 스크립트, 보안 취약점 등을 연구하며, 주기적으로 10대 웹 애플리케이션 취약점을 공개하는데 이를 OWASP Top 10이라고 합니다.
