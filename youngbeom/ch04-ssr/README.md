# p.259 새로운 패러다임의 웹서비스를 향한 요구

[httparchive.org](http://httparchive.org) → onLoad, Interactive 등의 시간이 우리가 체감하는 시간과 편차가 있다

# p.264 서버 사이드 렌더링의 장점

검색 엔진과 SNS 등 메타데이터 제공이 쉽다 → SPA도 Helmet과 같은 서비스를 통해 제공이 가능하다

[Cumlative Layout Shift](https://web.dev/articles/cls)

## 적절한 서버가 구축돼 있어야 한다

pm2는 단일서버 대상. 요즘과 같은 마이크로서비스 아키텍처로 구성된 컨테이너 오케스트레이션이 일반화 된 상황에서는 다른 방식이 일반적이다

-   ECS의 예:
    -   관리 : Task Definition
    -   로드 밸런싱 : ELB(Elastic Load Balacer)
    -   모니터링 및 로깅: Amazon CloudWatch
-   Kubernates의 예:
    -   관리 및 로드 밸런싱 등: 자체 설정
    -   모니터링 및 로깅: Prometheus, Grafana, ELK 스택

# 4.3.1 Next.js란

https://nextjs.org/learn 를 돌려보는게 좋을 것 같다
