# 의미있는 내용 메모

## boilerplate 만들기

-   github의 레파지토리 생성시에 해당 프로젝트가 boilerplate로 사용된다면 template repository 옵션을 체크
-   참고할만한 샘플들
    https://github.com/vercel/next.js/blob/canary/packages/create-next-app/index.ts
    https://blog.logrocket.com/creating-a-cli-tool-with-node-js/

## 유용한 github-actions

-   calibreapp/image-actions
    소스코드에 포함되는 이미지만 대상이라 사용자가 올리는 이미지에 대해서는 AWS lambda trigger로 이미지로 압축하는 것과 같은 별도의 작업 필요
-   lirantal/is-website-vulnerable 과 같은 취약점 확인
    작성한 코드에 취약점이 있는지를 확인하는게 가장 좋지만 차선책으로 사용해볼만하다

-   Lighthouse CI
    각종 성능지표 확인

## Semver

주, 부, 수라는 불필요한 번역보다는 Major, Minor, Patch라는 원어를 사용하는게 나을 것 같다
