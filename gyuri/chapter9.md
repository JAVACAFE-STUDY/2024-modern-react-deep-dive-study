# 9.1 Next.js로 리액트 개발 환경 구축하기

리액트 애플리케이션과 Next애플리케이션을 손쉽게 만들기 위한 도구
create-react-app (CRA) : 더이상 유지 보수 되지 않음 -> 보일러 플레이트 CLI 에서 런처 형태로 변경될 예정
create-next-app (CNA?)

### 9.1.1 create-next-app 없이 하나씩 구축하기

package.json 만들기

- 직접 만들거나
- `npm init` 으로 실행

많이 사용하는 핵심 라이브러리 다운로드
dependencies : react, react-dom, next
devDependencies : @types/react, @types/react-dom, @types/node(node.js), eslint, eslint-config-next

> 💡dependencies, devDependencies, peerDependencies의 차이?
> [9.2 깃허브 100% 활용하기](#9.2-깃허브-100%-활용하기)

## 9.1.2 tsconfig.json 작성하기

#### tsconfig.json 타입스크립트 설정

$schema는 schemastore에서 제공해 주는 정보로，해당 JSON 파일이 무엇을 의미하는지，또 어떤 키와 어떤 값이 들어갈 수 있는지 알려주는 도구
선언해두면 vscode나 webstorm에서 자동 완성 도움을 받을 수 있음

```json
{
  "$schema": "https://json.schemastore.org/tsconfig.json"
}
```

> ❓ 폴리필
> 폴리필은 기본적으로 지원하지 않는 이전 브라우저에서 최신 기능을 제공하는 데 필요한 코드 (일반적으로 웹의 JavaScript)입니다.

useUnknownInCatchVariables: catch 구문에서 잡은 변수에 대해서는 기본적으로 `any`를 할당한다. 그러나 4.0부터는 이 옵션을 해당 변수에 `unknown`을 할당한다. (p.535)

> ❓ `unknown` vs `any`
> 공통점 : 어떤 타입의 값도 할당할 수 있다.
> 차이점
>
> - `any` : 어떠한 타입의 변수로도 할당 할 수 있다.
> - `unknown` : `any와` `unknown` 타입으로만 할당 가능하다.
>   `unknown은` 언제 사용하나? - 외부 API 등에서 타입을 명확히 알 수 없는 경우 사용한다. - `unknown` 타입으로 정의 한 후에는 타입 가드를 해야한다.
>   참고: https://roseline.oopy.io/dev/typescript-unknown-vs-any-type

https://www.typescriptlang.org/tsconfig 에서 사용가능한 옵션을 모두 확인 할 수 있다.

#### eslint와 prettier 설정하기

- eslint-config-next : 코드의 잠재적인 문제 확인
- @titicaca/eslint-config-triple : 코드 스타일링
- 같이 사용하기 위해서는 별도의 설정이 필요 (P.540)

#### 스타일 설정하기

swc에 styled-components를 사용한다는 것을 알리기 위해 styledComponents: true를 next.config.js에 추가한다.

#### 애플리케이션 코드 작성

- pages: Next.js에서 예약어로 지정해 두고 사용하는 폴더로, 이 폴더 하위의 내용은 모두 실제 라우터가 된다.
- components: 페이지 내부에서 사용하는 컴포넌트를 모아둔 폴더
- hooks: 직접 만든 흑을 모아둔 폴더
- types: 서버 응답 타입 등 공통으로 사용하는 타입을 모아둔 폴더
- utils : 애플리케이션 전역에서 공용으로 사용하는 유틸성 파일을 모아둔 폴더

> 🥕 매번 새 프로젝트를 만들고 세팅하기 번거롭다. 마이크로 프런트엔드를 지향하면서 구축하는 일도 잦다. GitHub에서 보일러 플레이트 프로젝트를 만들어 새 Repository를 생성할 때 이용할 수 있다.
>
> 🥕혹은 나만의 create-\*\*\*\-app을 만든다.
>
> # create-next-app 내부 코드
>
> https://github.com/vercel/next.js/blob/canary/packages/create-next-app/index.ts
>
> # npm 기반으로 cli 패키지 만들기
>
> https://blog.logrocket.com/creating-a-cli-tool-with-node-js/

# 9.2 깃허브 100% 활용하기

CI란?

- 기여한 코드를 지속적으로 빌드하고 테스트해 코드의 정합성을 확인하는 과정
- 코드의 변화가 있을 때마다 전체 소프트웨어의 정합성을 확인하기 위한 작업을 자동으로 실행해야 한다
- 테스트, 빌드, 정적 분석, 보안취약점 분석 등을 할 수 있다

Jenkins

- 별도 서버 구축 필요 (이건 장점이 될 수도 있다)
- 서버 내 젠킨스 설치하고, 젠킨스를 저장소와 연결하는 작업을 해야한다.
- 플러그인이 많다
- 설치 및 유지보수가 번거롭다

GitHub Action

- CI를 대체하기 위한 도구는 아니고, 본래 목적은 깃허브에서 발생하는 다양한 이벤트를 트리거 삼아 다양한 작업을 할 수 있게 도와주는 것
  - 어떤 브랜치에서 푸시가 발생하면 빌드를 수핸한다
  - PR이 열리면 빌드, 테스트, 정적 분석(런타임이 아닌 환경에서 문제를 찾는 과정)을 수행한다.
- 2,000 minutes/month 무료 제한
- cf) GitHub Package 무료 500M 제한

### 깃허브 액션으로 CI 환경 구축하기

- #### 깃허브 액션의 기본 개념
  - 러너
  - 액션
  - 이벤트
    - PR
    - issues
    - push
    - schedule (특정 시간에 실행되는 이벤트): cron 유닉스 계열 잡 스케줄러
  - 잡
  - 스텝
- #### 깃허브 액션 작성하기
  - 위치 `.github/workflows`
  - 확장자: .yml, .yaml
  - prettier가 설치되어있다면 yaml도 함께 포함시켜 코드 스타일 유지하자
  - yarn이나 pnpm을 사용한다면 `pnpm/action-setup`, `boral_es/actions-yarn` 설치
  - `actions/github-script` 풀 리퀘스트에 댓글달기, 스케쥴링, 자동 배포, 이미지 추가될때마다 최적화 등의 작업이 가능
  - 브랜치보호 규칙을 이용하여 코드 정합성을 확보할 수 있다.

### 직접 작성하지 않고 유용한 액션과 깃허브 앱 가져다 쓰기

- #### 깃허브에서 제공하는 기본 액션
  - `actions/checkout` : 깃허브 저장소 체크아웃
  - `actions/setup-node` : Node.js 설치
  - `actions/github-script` : GitHub API를 사용할 수 있음 [Oktokit](https://octokit.github.io/rest.js/v19) [예제](<https://velog.io/@hoonnn/octokit%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%9C-git-api-%ED%98%B8%EC%B6%9C%ED%95%98%EA%B8%B0#:~:text=Octokit%20(%EC%98%A5%ED%86%A0%ED%82%B7)%20%EC%9D%B4%EB%9E%80%20GitHub,%EC%9D%98%20%EA%B3%B5%EC%8B%9D%20%ED%81%B4%EB%9D%BC%EC%9D%B4%EC%96%B8%ED%8A%B8%20%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC%EB%8B%A4.>)
  - `actions/stale` : 오래된 이슈 자동으로 닫기
  - `actions/dependency-review-action` : 의존성 그래프 변경 시 실행됨 (package.json, package-lock.json, pnpm-lock.yaml 등), 혹은 라이센스 문제 있을 시 알려줌
  - `github/codeql-action` : 코드 분석 솔루션인 code-아을 활용해 저장소 내 코드의 취약점을 분석
- #### calibreapp/image-actions
  - [공식문서](https://github.com/calibreapp/image-actions)
  - 저장소에 포함돼 있는 이미지를 최적화하는 액션 (p.558)
  - PR로 올라온 이미지(jpg, jpeg, png 등)를 sharp 패키지를 이용해 거의 무손실로 압 축해서 다시 커밋해 준다.
  - Next.js는 next/image로 이미지 최적화함
  - [imgbot](https://github.com/marketplace/imgbot/plan/MLP_kgDNGw8#plan-6927) 이라는 앱으로 이미지 최적화 설정을 해줄 수도 있다
- #### lirantal/is-website-vulnerable
  - 웹사이트에 라이브러리 취약점이 존 재하는지 확인하는 깃허브 액션
  - 실제로 웹사이트를 방문해서 웹사이트에 노출되고 있는 라이브러리를 분석한 결과를 알려준다
  - `npx is-website-vulnerable https://www.netflix.com/kr/`
- #### Lighthouse CI
  - [공식문서](https://github.com/GoogleChrome/lighthouse-ci)
  - `.lighthousec.js` 파일을 루트에 생성
  -

### 깃허브 Dependabot으로 보안 취약점 해결하기

- package.json 의 dependencies 이해하기
  - 16.0.1 (주.부.수)
  - react@16.0.0: 버전 앞에 아무런 특수 기호가 없다면 정확히 해당 버전에 대해서만 의존하고 있다는 뜻
  - react@^16.0.0: 16.0.0부터 17.0.0 미만의 모든 버전
    - 주 버전이 0인 경우에는 부 버전이 올라가도 API에 변경이 있을 수 있으므로 수 버전까지만 수용
  - react@~16.0.0: 16.0.0부터 16.1.0 미만의 모 든 버전
- Dependabot으로 취약점 해결하기 - 취약점을 Critical, High, Moderate, Low의 4단계로 분류 - repository의 Setting의 Code security and analysis 탭에서 쉽게 Enable 가능하다 - 패키지 내부에 선언된 의존성을 강제로 올릴 수 있는 방법 - npm overrides

  9.3 리액트 애플리케이션 배포하기

- Netlify
- Vercel
- DigitalOcean

  9.4 리액트 애플리케이션 도커라이즈하기

- 리액트 앱을 도커라이즈 하는 방법
  - 도커란?
    - 모던 애플리케이션을 구축，공유，실행하는 것을 도와줄 수 있도록 설계된 플랫폼
    - 이미지 : 템플릿
    - 컨테이너 : 도커의 이미지를 실행한 상태
    - Dockerfile : 어떤 이미지 파일을 만들지 정의하는 파일
    - 태그 : 이미지를 식별할 수 있는 레이블 값
    - 리포지터리 : 이미지를 모아두는 저장소
    - 레지스트리 : 리포지터리에 접근할 수 있게 해주는 서비스를 의미, 도커 허브(Docker Hub)
  - create-react-app Dockerfile 작성하기
  - create-next-app Dockerfile 작성하기
  - 도커 이미지 실행하기
    - Google Cloud Registry에 이미지 푸시
    - Cloud Run 에서 이미지 실행
    - 지속적 통합 설정
