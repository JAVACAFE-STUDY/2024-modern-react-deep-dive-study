- 이벤트 리스너가 어디서 실행 되었는지 모를때 디버깅 하기 위해서 source 탭에 이벤트 리스너 중단점을 클릭하면 볼 수 있다.

- Source 탭의 Overrides를 클릭하여 파일을 첨부하여 급하게 필요할때 css 파일 등을 적용해서 라이브로 적용해 볼 수 있다.

- debugger : https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/debugger

- Network 탭에서 Disable cache, Fetch/XHR 등의 필터를 해서 많이 사용한다

- Lighthouse

- 안드로이드 내 웹뷰를 사용하고 있다면 크롬 inspector에서 디버깅을 할 수 있다.
  safari ios에도 확인할 수 있다

- eslint: triple-config-kit 라는 것도 많이 쓰인다고 한다.
- husky에 console이 남지 않도록 eslint 설정을 하기도 한다

- eslint-plugin-prettier : eslint와 prettier의 충돌을 방지하여 만들어진 라이브러리
- awesome eslint : awesome + 쓰려고하는 툴의 생태계를 살펴보는 레포가 간혹 있다

- Jest node.js 환경에서 alert은 없기 때문에 mocking 할 수 있다
- 비동기 환경이 많기 때문에 fetch의 응답값을 mocking 할 수 있다
  - MSW를 사용한다면 코드르 줄일 수 있다.
- 사용자 정의 훅에 대한 테스트

  - renderHook

- 가장 취약하거나 중요한 부분을 테스트로 만든다. 우선순위를 만드는 것이 중요하다.

- 보통은 브라우저를 타거나 사용자 엣지 케이스를 다 코드를 짤 수 없기 떄문에 비현실적이다
- 비즈니스 로직을 많이 테스트 하는 것 같다
- 이미 서비스가 너무 안정화 되어있어서 바뀌면 문제가 되는 경우

  - 회귀 테스트를 할때 의미가 있을 수 있다
  - 팀이 분리되어있어서 각자 맡은 바가 다른데 그 문제가 어디서 터지는지 알 수가 없을 때

    - 마커가 뜨는데 수천개 수만개의 마커가 특정 문제상황에 대해서 클릭이 제대로 동작하는지
    - Headless browser
    - selenium vs puppeteer vs cypress
      각각의 장단점이 있기 때문에
      브라우저에 대한 종속성
      os에 대한 종속성
      기기의 종속성
      os 내부에서 사용하는 인앱 브라우저의 종속성
      브라우저 스택 => 솔루션 업체 => 좀 느리긴함 ㅎㅎ

- 실무시 어느 정도로 사용하고 있는지 궁금 (토스의 경우는)
- TDD의 경우 실패케이스르 먼저 짜고 예외 케이스를 고려한다
- 깨지는 상황에 대한 예외 케이스를 처리하지 않으면 장애로 이어지기 때문에 그런 관점에서는 좋다

- playwright : 밴더사가 microsoft (급격하게 성장중)
- cypress는 병렬로 실행하려면 돈을 내야함
