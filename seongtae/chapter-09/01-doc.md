# **Chapter-09 모던 리액트 개발 도구로 개발 및 배포 환경 구축하기**

## **9.1 Next.js로 리액트 개발 환경 구축하기**

## Table of contents


## 1.1 create-next-app 없이 하나씩 구축하기
프로젝트의 구조를 공부하고, 이해하는 데는 보일러플레이트는 도움이 되지 않음
- create-react-app
- create-next-app

### 직접 한땀 한땀 구축하기

```bash
pnpm add react react-dom next
pnpm add -D typescript @types/react @types/react-dom @types/node eslint eslint-config-next
```


## 1.2 tsconfig.json 작성하기
schemastore 에서 제공해주는 정보를 통해 자동 완성이 가능해짐

```json
{
  "$schema": "https://json.schemastore.org/tsconfig.json"
  "target": "es5", // 타입스크립트가 변환을 목표하는 언어의 버전
  "lib": ["dom", "dom.iterable", "esnext"], // 신규 기능에 대한 API 정보를 확인할 수 있게 하는 것
  "allowJs": true, // 자바스크립트 파일을 컴파일할지 결정하는 것
  "skipLibCheck": true, // 라이브러리에서 제공한느 d.ts 에 대한 검사여부
  "strict": true, // 타입스크립트 컴파일러의 엄격 모드를 제어
  "forceConsistentCasingInFileNames": true, // 파일 이름의 대소문자 구분하도록 강제
  "noEmit": true, // 컴파일하지 않고, 타입 체크만 수행. 타입스크립트에게 단순히 타입 검사하는 역할만 맡김
  "esModuleInterop": true, // CommonJS 방식으로 보낸 모듈을 ES 모듈 방식의 import로 가져올 수 있도록 해줌
  "module": "esnext", // 모듈 시스템을 설정
  "moduleResolution": "node", // 모듈을 해석하는 방식 설정
  "resolveJsonModule": true, // JSON 파일을 import 할 수 있도록 설정
  "isolatedModules": true, // 단독으로 있는 파일의 생성을 막기 위한 옵션
  "jsx": "preserve", // .tsx 내부 JSX를 컴파일하는 방법 설정, preserve는 변환 없이 그대로 유지
  "incremental": true, // 마지막 컴파일 정보를 저장하여, 비용이 적게 드는 방식으로 컴파일을 수행
  "baseUrl": "src",
  "paths": {
    "#pages/*": ["pages/*"],
    "#hooks/*": ["hooks/*"],
    "#types/*": ["types/*"],
    "#components/*": ["components/*"],
    "#utils/*": ["utils/*"]
  }
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"], // 타입스크립트 컴파일 대상에 포함시킬 목록 의미
  "exclude": ["node_modules"] // 타입스크립트 컴파일 대상에서 제외할 파일 목록을 의미
}
```

## next.config.js 작성하기

```js
const nextConfig = {
  reactStrictMode: true, // 리액트의 엄격 모드 활성화
  poweredByHeader: false, // 일반적으로 보얀 취약점으로 취급되는 X-Powered-By 헤더 제거
  eslint: {
    ignoreDuringBuilds: true, // 빌드시에 ESLint를 무시
  },
  styledComponents: true,
}

module.exports = nextConfig
```

## ESLint 와 Prettier 설정하기

```bash
@titicaca/eslint-config-triple
```

## 스타일 설정하기

```bash
pnpm add styled-components
pnpm add -D @types/styled-components
```
