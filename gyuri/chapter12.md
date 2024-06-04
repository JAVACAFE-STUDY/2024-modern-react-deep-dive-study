# 12 모든 웹 개발자가 관심을 가져야할 핵심 웹 지표

Protent의 조사

- 1초 내로 로딩되는 사이트는 5초 내로 로딩되는 사이트보다 전자상거래 전환율(실제 구매로 이어지는 고객의 비율)이 2.5 배 더 높다.
- 0 ~ 5초의 범위에서. 1초 로딩이 늦어질수록 전환율은 4.42%씩 떨어진다
- 페이지로드시간이0 ~ 2초사이인페이지에서가장높은전환율을달성할수있다

> 개발자의 기기는 대부분 일반적인 사용자의 평균적인 기기보다 성능이 뛰어나기 때문에 이러한 문제를 대체로 느끼지 못한다는

웹사이트의 성능은 어떻게 측정할 수 있을까?

핵심웹 지표 (Core Web Vita) : 웹사이트에서 뛰어난 사용자 경험을 제공하는 데 필수적인 지표

- 최대 콘텐츠풀 페인트(LCP: Largest Contentful Paint)
- 최초 입력 지연(FID: First Input Delay)
- 누적 레이아웃 이동<CLS: Cumulative Layout Shift)

## 최대 콘텐츠풀 페인트(LCP)

페이지가 처음으로 로드를 시작한 시점부터 뷰포트 내부에서 가장 큰 이미지 또는 텍스트를 렌더링하는 데 걸리는 시간

뷰포트 : 사용자에게 노출되는 화면, 이 영역은 기기에 의존한다

가장 큰 요소로 고려되는 5개

```
<img>
<svg> 내부의〈image〉
poster 속성을 사용하는 <video>

u r l ( ) 을 통해 불러온 배경 이미지가 있는 요소

텍스트와 같01 인라인 텍스트 요소를 포함하고 있는 블록 레벨 요소 이 블록 레벨 요소에는 <p>, <div> 등이 포함된다.
```

"웹페이지가 로딩이 완료되어 사용자에게 노출되기까지 걸리는 시간"
DOMContentLoaded 이벤트가 호출되는 시간

## 최초입력 지연(FID)

메인스레드 바쁨 -> 대규모 랜더링 or 대규모 자바스크립트 파일 분석

구글은 사용자 경험을 크게 4가지로 분류해 정의하는데，이를 RAIL17이라고 한다. 이 RAIL에 해당하는 것들 은다음과 같다.

Response: 사용자의 입력에 대한 반응 속도. 50ms 미만으로 이벤트를 처리할 것 Animation: 애니메이션의 각 프레임을 10ms 이하로 생성할 것  
Idle: 유휴 시간을 극대화해 페이지가 50ms 이내에 사용자 입력에 응답하도록 할 것 Load: 5초 이내에 콘텐츠를 전달하고 인터랙션을 준비할 것

- 실행에 오래 걸리는 긴 작업을 분리
- 자바스크립트 코드 최소화

## 누적 레이아웃 이동(CLS)

생명주기 동안 발생하는 모든 예기치 않은 이동에 대한 지표를 계산하는 것

- 삽입이 예상되는 요소를 위한 추가적인 공간 확보
- 폰트로딩 최적화
- 적절한 이미지 크기 설정