# 10.1 리액트 17 버전 살펴보기

## 10.1.1 리액트의 점진적인 업그레이드

17버젼부터는 두 개의 버젼이 동시에 하나의 프로젝트에 존재 가능
부득이한 경우에만 점진적인 업그레이드 적용. 하나의 버젼을 사용하는 것이 권장

## 10.1.2 이벤트 위임 방식의 변경

16 버젼에서는 Document에 이벤트 위임 (Delegation)
17 버젼부터는 리액트의 root에 이벤트 위임 (Delegation)
외부라이브러리 등에서 document에 등록되는 기존의 방식이 사용되는 곳이 있는지 확인 필요

# 10.2 리액트 18 버전 살펴보기

## 10.2.1 새로 추가된 훅 살펴보기

### useTransition

https://react.dev/reference/react/useTransition#examples
