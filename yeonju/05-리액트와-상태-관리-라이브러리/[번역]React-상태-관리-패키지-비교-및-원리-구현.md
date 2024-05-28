# React 상태 관리 패키지 비교 및 원리 구현 feat. Redux, Zustand, Jotai, Recoil, MobX, Valtio

> 원문: [React 狀態管理套件比較與原理實現 feat. Redux, Zustand, Jotai, Recoil, MobX, Valtio](https://medium.com/%E6%89%8B%E5%AF%AB%E7%AD%86%E8%A8%98/a-comparison-of-react-state-management-libraries-ba61db07332b)

## 상태 관리

React는 단방향 데이터 흐름 라이브러리로, 컴포넌트가 점점 복잡해지면서 다양한 방식으로 상태를 관리합니다. 예를 들어, 같은 레벨의 두 자식 컴포넌트가 상태를 공유해야 할 때, 일반적인 전략은 상태 끌어올리기(lifting state up)로, 자식 컴포넌트의 상태를 부모 컴포넌트로 이동시킨 다음, 해당 상태를 필요로 하는 자식 컴포넌트로 다시 전달하는 것입니다. 이는 흔히 발생하는 시나리오입니다.

보다 복잡한 상황에서, 다른 레벨의 컴포넌트나 여러 레벨의 컴포넌트가 상태를 공유해야 할 때, 상태 끌어올리기 규칙에 따라 상태가 계속 상위로 이동한 후, 여러 레벨의 컴포넌트 간에 전달되는 상황이 발생합니다. 이것이 바로 prop drilling의 문제입니다.

![](https://github.com/JAVACAFE-STUDY/2024-modern-react-deep-dive-study/assets/97719273/6498c484-fcab-490f-ad82-37c90760b167)

prop drilling 문제를 해결하기 위해, React는 context를 제공하여 컴포넌트 간에 상태를 전달할 수 있습니다. 기본적으로 간단한 시나리오에서는 context가 충분하며, 복잡한 시나리오에서는 useReducer와 함께 사용하여 상태를 쉽게 관리할 수 있습니다.

그러나 context 사용 시 일반적인 문제들이 발생할 수 있는데, 예를 들어 provider가 전달하는 상태를 useMemo와 useCallback으로 감싸지 않고, 자식 컴포넌트가 memo를 사용하지 않을 경우, provider의 컴포넌트가 재렌더링될 때 context를 사용하는 모든 곳이 재렌더링됩니다.

또 다른 문제는 provider가 전달하는 상태가 점점 많아질 때, provider의 하나의 상태가 변경되어 전체 하위 트리가 재렌더링되는 경우가 발생할 수 있습니다. 이 문제를 해결하기 위해서는 Provider의 상태를 더 세분화하고, 다른 Provider로 상태를 분리해야 합니다. 그러나 여러 Provider로 나누게 되면, 관리해야 할 상태가 점점 많아질수록 Provider도 점점 늘어나 관리가 어려워집니다.

### 해결해야 할 문제

이 글에서는 React의 기본 상태 관리 메커니즘이 직면하는 주요 문제들을 다룰 것이며, 각기 다른 패키지가 이 문제들을 어떻게 해결하는지에 대해 설명할 것입니다:

- Prop drilling의 문제
- Context가 전체 하위 트리의 렌더링을 유발하는 문제

### 제3자 패키지

React의 상태 관리 패키지는 매우 다양하며, 멘탈 모델 측면에서 Flux, Atomic, Proxy의 세 가지 큰 범주로 나눌 수 있습니다. 구현된 패키지에는 Redux, MobX, Recoil, Zustand, Jotai, Valtio 등이 있습니다.

다운로드 수를 기준으로 현재 Redux와 Zustand의 다운로드 수가 가장 많으며, 그 다음은 MobX입니다. Atomic 메커니즘을 구현한 Jotai와 Recoil은 주당 약 50만 번의 다운로드 수를 기록하고 있으며, 가장 적게 사용되는 Valtio는 현재 주당 약 30만 번의 다운로드 수를 기록하고 있습니다.

![](https://github.com/JAVACAFE-STUDY/2024-modern-react-deep-dive-study/assets/97719273/438958d8-51ad-4a67-950d-8d40d2ae96d4)

올해 초에는 'signal'이 갑자기 핫 키워드 중 하나가 되었으며, React 생태계에서는 @preact/signals와 jotai-signal 두 가지 패키지가 등장했습니다. 그러나 다운로드 수를 기준으로 현재 이 두 패키지를 사용하는 사람은 매우 적으며, 왜 사람들이 이를 덜 사용하는지에 대해서는 글의 후반부에서 설명할 것입니다.

## Flux

### MVC 아키텍처가 직면한 문제

2014년 이전에, Facebook은 웹에서 대규모로 MVC 아키텍처를 사용했습니다. 그러나 MVC 아키텍처는 데이터 흐름을 매우 복잡하게 만들고, 애플리케이션을 확장하기 어렵게 만들며, 새로운 엔지니어가 합류하면 시작하기가 어렵고, 따라서 단기간에 효율적인 결과를 내기 어려웠습니다.

2014년 Facebook이 Flux와 React를 발표할 때 사용한 이미지는 데이터 흐름의 문제를 설명하기 위한 것이었지만, 많은 사람들이 이 이미지를 비판했고, Facebook의 개발자들이 MVC 아키텍처를 제대로 이해하지 못하고 있다고 지적했습니다. MVC에서는 뷰와 모델이 양방향으로 통신하지 않습니다.

![](https://github.com/JAVACAFE-STUDY/2024-modern-react-deep-dive-study/assets/97719273/d780f78b-a2af-4d24-a21e-9456190701d7)

그러나 강연의 맥락에서 Facebook이 직면한 문제는 페이지의 많은 섹션(뷰)이 여러 모델에 의존한다는 것이었으므로, 그들이 해결하고자 하는 문제는 화면의 데이터를 더 잘 관리할 수 있게 하는 것으로 이해할 수 있습니다.

당시 그들이 사용한 프레임워크는 명령형 프로그래밍이었기 때문에, 캐스케이딩 업데이트 문제가 발생하기 쉬웠고, 하나의 함수가 상태를 관리하고 UI도 관리해야 했기 때문에, 결국 Flux와 React가 등장하게 되었습니다.

Flux는 단방향 데이터 흐름 아키텍처로, 디스패처, 스토어, 액션, 뷰 네 가지 주요 구성 요소로 구성되어 있습니다. 뷰는 실제로 React 자체이며, 이벤트가 발생하면 액션이 발행되고, 디스패처가 스토어에 저장된 상태를 업데이트한 다음, React가 이러한 상태 변경을 사용하여 뷰를 변경합니다.

Flux는 MVC 프론트엔드 아키텍처와 비교하여 다음과 같은 몇 가지 장점이 있습니다:

- 데이터 일관성 개선
- 버그를 찾기 쉬움
- 더 나은 단위 테스트 작성
  이러한 장점은 Facebook이 React와 Flux를 발표했을 때 언급된 장점입니다.

이러한 장점은 오늘날에도 여전히 유효하지만, React가 성장함에 따라 이러한 장점이 당연한 것처럼 보이며, 어떤 패키지를 선택하든, React에서는 이러한 장점을 누릴 수 있습니다.

Flux는 초기에는 단지 개념일 뿐이었고, 나중에 2015년에 Facebook이 flux 패키지를 오픈소스로 공개했지만, 결국 Redux가 현재 가장 많이 사용되는 패키지가 되었고, flux 오픈소스 프로젝트는 2023년 3월에 아카이브되었습니다. flux의 저장소에서도 상태 관리 패키지가 필요하다면 Redux, MobX, Recoil, Zustand, Jotai 중에서 선택하라고 언급되어 있습니다.

현재 가장 많이 사용되는 상태 관리 패키지는 Redux와 Zustand이며, 2023년 9월 현재 Redux는 주당 거의 900만 번의 다운로드 수를 기록하고 있으며, 상태 관리를 생각하면 Redux를 떠올리는 경우가 많습니다. Zustand는 현재 주당 약 200만 명의 사용자가 있으며, 2019년 출시된 이후 현재 상태 관리 패키지 중 두 번째로 많이 사용되고 있으며, 오래된 Mobx와 비교했을 때 주당 다운로드 수가 거의 두 배입니다.

![](https://github.com/JAVACAFE-STUDY/2024-modern-react-deep-dive-study/assets/97719273/cd4749e5-e208-44bf-aa5e-dd1e6c93340d)

### Redux

Redux는 2015년 Dan Abramov에 의해 개발된 Flux 아키텍처 기반의 상태 관리 패키지로, 현재 주당 거의 900만 번의 다운로드 수를 기록하고 있으며, 대부분의 사람들이 React를 배울 때 처음 접하는 상태 관리 패키지입니다.

기본 Redux는 설정과 사용이 다소 번거롭습니다. 예를 들어, 액션, 리듀서 등을 설정해야 하며, TypeScript를 사용하는 경우 유형 설정이 더 복잡해집니다. 한 곳을 수정해야 할 때 많은 곳을 수정해야 할 수 있습니다.

그러나 Redux Toolkit을 도입하면 스토어 및 리듀서 생성의 보일러플레이트 코드를 줄일 수 있으며, 원래 Redux 스토어에서 상태를 업데이트할 때 불변성 문법을 사용해야 하는 것을 가변 방식으로 작성할 수 있게 해줍니다. 그래서 현재 Redux를 사용할 때는 일반적으로 RTK를 함께 도입합니다.

```tsx
import { createSlice, configureStore } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
  },
  reducers: {
    incremented: (state) => {
      state.value += 1;
    },
    decremented: (state) => {
      state.value -= 1;
    },
  },
});

export const { incremented, decremented } = counterSlice.actions;

const store = configureStore({
  reducer: counterSlice.reducer,
});

store.dispatch(incremented());
store.dispatch(decremented());
```

#### Redux가 렌더링 문제를 어떻게 해결하는지

현재 Redux는 일반적으로 react-redux와 함께 사용됩니다. react-redux는 useSelector를 제공하여 redux 스토어에서 필요한 상태를 선택할 수 있으며, react-redux는 선택된 상태가 변경되었는지를 감지하고 재렌더링을 트리거합니다.

예를 들어, 아래 예제에서 counter가 변경되었지만 username이 변경되지 않았습니다. 이때 useSelector는 counter의 이전 값과 다른 값을 알고 있으므로 렌더링을 트리거합니다. 이때 ComponentA만 렌더링됩니다:

```tsx
import { useSelector } from "react-redux";

const ComponentA = () => {
  const counter = useSelector((state) => state.counter);
  return <div>{counter}</div>;
};

const ComponentB = () => {
  const username = useSelector((state) => state.username);
  return <div>{username}</div>;
};
```

2021년 이전에는 react-redux가 useReducer를 사용하여 강제 렌더링 함수를 생성했습니다. useSelector는 먼저 state.counter 값을 저장하고, redux 스토어에서 가져온 값이 변경될 때 forceRerender()를 사용하여 해당 컴포넌트를 재렌더링했습니다.

```ts
const [, forceRender] = useReducer((s) => s + 1, 0);
```

그러나 React 18의 훅이 출시된 이후, react-redux는 상태를 감지하고 재렌더링하는 솔루션으로 useSyncExternalStoreWithSelector를 사용하게 되었습니다.

```ts
import type { useSyncExternalStoreWithSelector } from "use-sync-external-store/with-selector";
```

### Zustand

Zustand(독일어로 상태)는 Jotai와 Valtio의 개발자인 Daishi Kato가 개발한 Flux 아키텍처 기반의 상태 관리 패키지로, Redux보다 사용하기 더 쉽고, 더 간결하게 작성됩니다. Zusta는 context provider를 사용하여 스토어를 전달하지 않고도 Zustand의 전역 상태를 사용할 수 있습니다.

Zustand에서는 create()만 사용하면 빠르게 스토어와 액션을 생성할 수 있습니다. Redux에서는 RTK를 사용하더라도 스토어를 생성할 때 많은 보일러플레이트 코드를 작성해야 합니다:

```tsx
import { create } from "zustand";

const useBearStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));
```

상태를 읽고 액션을 디스패치하는 것도 매우 간단하며, create()로 생성된 훅을 사용하면 스토어에서 상태와 액션을 읽어올 수 있습니다:

```tsx
function BearCounter() {
  const bears = useBearStore((state) => state.bears);
  return <h1>{bears} around here ...</h1>;
}

function Controls() {
  const increasePopulation = useBearStore((state) => state.increasePopulation);
  return <button onClick={increasePopulation}>one up</button>;
}
```

Redux에서는 심지어 디스패처 인스턴스를 먼저 생성하고 액션을 가져와야 하는 반면, Zustand의 하나의 특징은 개발자 경험이 Redux보다 더 좋다는 것입니다.

#### Zustand가 렌더링 문제를 어떻게 해결하는지

Zustand는 react-redux와 마찬가지로, selector의 값이 변경되었는지 여부를 판단하여 재렌더링을 트리거합니다. 아래 예제에서 useBearStore는 state.bears 값이 변경되었는지를 감지하고, 변경될 경우 해당 컴포넌트를 재렌더링합니다:

```tsx
const bears = useBearStore((state) => state.bears);
```

2022년 8월 이전에는 Zustand가 useReducer를 사용하여 forceUpdate() 함수를 자체적으로 유지했지만, #550 이후에는 useSyncExternalStoreWithSelector를 사용하여 렌더링을 트리거하는 함수로 대체되었습니다.

현재까지 보았듯이, react-redux와 Zustand 모두 use-sync-external-store 이라는 패키지를 사용합니다. 이것은 React 18의 한 훅이지만, 독립적인 패키지로 분리되어 있어 React 18로 업그레이드하지 않아도 이 훅을 사용할 수 있습니다.

### Zustand vs Redux

👉 다운로드 추세

현재 커뮤니티의 추천을 기준으로, Flux 아키텍처 기반의 상태 관리 패키지를 선택하려면 Zustand를 직접 선택하는 것이 좋습니다. 현재 커뮤니티의 목소리와 다운로드 수를 기준으로 할 때, Redux는 주당 800만 번의 다운로드 수를 기록하고 있지만, Zustand도 이미 주당 200만 명에 이르렀습니다. 오픈 소스 프로젝트의 유지 관리 가능성과 커뮤니티의 크기 측면에서, Zustand는 작은 프로젝트뿐만 아니라 제품에서도 사용할 수 있습니다.

👉 개발자 경험

위의 빠른 시작 예제에서 볼 수 있듯이, Zustand를 사용하는 것이 Redux를 사용하는 것보다 훨씬 간단하며, 복잡한 보일러플레이트 코드를 작성할 필요가 없고, 사용법도 매우 직관적입니다. 기본적으로 사용자 지정 훅처럼 사용됩니다.

## Atomic

다음으로 언급할 것은 Flux와 매우 다른 개념인 Atomic이며, Recoil과 Jotai의 기본 개념입니다. Recoil을 소개하는 초기 비디오에서 해결하고자 하는 문제는 두 가지였습니다. 1️⃣ context나 props를 사용하여 상태를 전달하면 re-render 문제가 발생하기 쉬운데, 이 문제는 이 글의 초반부에서 언급한 문제 중 하나입니다. 2️⃣ 또 다른 문제는 context를 사용하면 코드 분할을 더 세분화할 수 없다는 것입니다. 왜냐하면 전체 컴포넌트 트리가 context나 props의 상태를 사용하기 때문입니다.

Atomic의 핵심 개념은 React의 상태 관리를 컴포넌트 트리에 분산시키고자 하는 것입니다. 이러한 상태들은 atom이며, atom은 context처럼 상태를 가져올 수 있지만 동시에 코드 분할을 더 세분화할 수 있습니다.

![](https://github.com/JAVACAFE-STUDY/2024-modern-react-deep-dive-study/assets/97719273/af35d4c9-27c9-42b8-8f17-02abd6cc85d5)

### Recoil

Recoil은 Facebook이 개발 및 유지 관리하는 패키지로, 2020년에 출시되었습니다. Recoil이 주로 해결하고자 하는 문제는 앞서 언급한 context render 문제와 코드 분할 문제입니다.

또한, 내부적으로 복잡한 대규모 시스템과 통합하기 위해 Recoil의 API는 매우 풍부하며 다양한 방식으로 사용할 수 있습니다.

상태를 생성할 때 atom과 selector를 사용할 수 있습니다. atom은 일반적인 상태로, React의 state와 같지만, useState와 다른 점은 atom을 생성할 때 컴포넌트 외부에서 생성한다는 것입니다. 반면, selector는 derived data를 구성하는 데 사용되며, 다른 atom에서 새로운 상태를 생성할 수 있습니다. Vue를 사용해 본 적이 있다면, Vue의 computed API와 비슷하다고 생각할 수 있습니다.

```tsx
const todoListState = atom({
  key: "TodoList",
  default: [],
});

const filteredTodoListState = selector({
  key: "FilteredTodoList",
  get: ({ get }) => {
    const filter = get(todoListState);
    const list = get(todoListState);

    switch (filter) {
      case "Show Completed":
        return list.filter((item) => item.isComplete);
      case "Show Uncompleted":
        return list.filter((item) => !item.isComplete);
      default:
        return list;
    }
  },
});
```

아래는 todo list를 렌더링하는 예제입니다. 상태를 사용하려면 useRecoilValue를 사용하여 atom의 값을 가져올 수 있습니다:

```tsx
function TodoList() {
  const todoList = useRecoilValue(todoListState);

  return (
    <>
      {todoList.map((todoItem) => (
        <TodoItem key={todoItem.id} item={todoItem} />
      ))}
    </>
  );
}
```

atom의 값을 설정하려면 useSetRecoilState API를 사용할 수 있으며, 이는 setState와 같은 함수를 반환하여 atom의 값을 직접 설정할 수 있습니다:

```tsx
function TodoItemCreator() {
  const [inputValue, setInputValue] = useState("");
  const setTodoList = useSetRecoilState(todoListState);

  const addItem = () => {
    setTodoList((oldTodoList) => [
      ...oldTodoList,
      {
        id: getId(),
        text: inputValue,
        isComplete: false,
      },
    ]);
    setInputValue("");
  };

  const onChange = ({ target: { value } }) => {
    setInputValue(value);
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={onChange} />
      <button onClick={addItem}>Add</button>
    </div>
  );
}
```

Recoil은 제공하는 API가 매우 풍부하며, useRecoilState, useRecoilStateLoadable 등을 제공합니다. 관심 있는 독자는 공식 문서에서 더 자세히 살펴볼 수 있습니다.

#### Recoil이 렌더링 문제를 어떻게 해결하는지

Recoil은 렌더링 문제를 해결하는 방식이 Redux와 Zustand와 다소 유사합니다. Redux와 Zustand는 모두 선택된 값을 변경했는지 여부를 판단하여 재렌더링을 트리거하는 selector 메커니즘을 사용합니다. 즉, Recoil은 atom의 값이 변경되었는지를 판단하여 컴포넌트를 재렌더링합니다. 예를 들어, useRecoilValue를 사용할 때 todoListState가 변경되었는지 여부를 판단하여 재렌더링을 트리거합니다:

```tsx
const todoList = useRecoilValue(todoListState);
```

그러나 Recoil의 구현 방식은 다소 복잡합니다. 이는 복잡하고 대규모 시스템에서 사용하기 위해 개발되었기 때문에, 재렌더링 여부를 판단하는 방식이 여러 가지입니다. 대략적으로 세 가지로 나눌 수 있으며, 각각은 다음과 같습니다:

- TRANSITION_SUPPORT
- SYNC_EXTERNAL_STORE
- LEGACY

첫 번째 방식인 TRANSITION_SUPPORT 모드는 RecoilEnv를 설정해야 하며, 이 모드에서 Recoil은 내부에서 자체적으로 생성한 subscribeToRecoilValue를 사용하여 atom이 변경되었는지 여부를 판단하고, useState로 생성한 forceUpdate를 사용하여 재렌더링을 트리거합니다:

```tsx
RecoilEnv.RECOIL_GKS_ENABLED.add("recoil_transition_support");
```

두 번째 방식인 SYNC_EXTERNAL_STORE 모드는 React가 useSyncExternalStore를 사용할 수 있는지 여부를 판단하며, 사용할 수 없는 경우 첫 번째 방식인 TRANSITION_SUPPORT 모드로 대체됩니다.

```tsx
SYNC_EXTERNAL_STORE: currentRendererSupportsUseSyncExternalStore()
  ? useRecoilValueLoadable_SYNC_EXTERNAL_STORE
  : useRecoilValueLoadable_TRANSITION_SUPPORT;
```

세 번째 방식인 LEGACY는 앞서 언급한 useSyncExternalStore와 유사한 subscribeToRecoilValue를 사용하여 atom이 변경되었는지 여부를 판단하고, 변경되면 재렌더링을 트리거합니다.

### Jotai

Jotai(일본어로 상태)는 Zustand와 Valtio의 개발자인 Daishi Kato가 2020년에 발표한 Atomic 기반의 패키지로, API는 Recoil에서 영감을 받았지만 Recoil보다 사용하기 더 쉽습니다.

Jotai에서 atom은 atom 상태를 생성하기 위한 설정 파일로 사용되며, 실제 상태는 스토어에 저장되며, useAtom을 통해 읽고 쓸 수 있습니다.

atom은 useState와 마찬가지로 초기 상태를 전달받으며, 다른 atom에 전달될 수도 있습니다. Recoil에서는 derived data를 생성하기 위해 selector API를 사용해야 하지만, Jotai에서는 모두 atom을 사용합니다:

```tsx
import { atom } from "jotai";

const countAtom = atom(0);
const countryAtom = atom("Japan");
const citiesAtom = atom(["Tokyo", "Kyoto", "Osaka"]);
const mangaAtom = atom({
  "Dragon Ball": 1984,
  "One Piece": 1997,
  Naruto: 1999,
});
const isJapanAtom = atom((get) => get(countryAtom) === "Japan");
```

useAtom은 useState와 유사한 방식으로 사용되며, 튜플을 반환합니다. 첫 번째 값은 상태를 읽는 데 사용되고, 두 번째 값은 상태를 설정하는 데 사용됩니다:

```tsx
import { useAtom } from 'jotai'

function Counter() {
  const [count, setCount] = useAtom(countAtom)
  return (
    <h1>
      {count}
      <button onClick={() => setCount((c) => c + 1)}>one up</button>
      ...
```

#### Jotai가 렌더링 문제를 어떻게 해결하는지

여기까지 보면 Jotai와 Redux, Zustand, Recoil이 렌더링 문제를 해결하는 방식이 매우 유사함을 알 수 있습니다. useAtom을 사용할 때 Jotai는 atom의 값이 변경되었는지 여부를 자동으로 판단하고, 변경되면 해당 컴포넌트를 재렌더링합니다.

```tsx
const [count, setCount] = useAtom(countAtom);
```

그러나 Redux, Zustand, Recoil의 메커니즘과 유사하다면 내부 구현도 useSyncExternalStore를 사용하는 것일까요? 실제로는 그렇지 않습니다.

Jotai는 time slicing 문제를 해결하기 위해 useReducer를 사용하여 re-render 문제를 처리합니다. Zustand가 useSyncExternalStore를 사용하고 useTransition과 함께 사용하면 예상치 못한 문제가 발생할 수 있습니다. 예를 들어, 저자가 제공한 예제에서는 "Pending..."이 아니라 Suspense의 "Loading..."이 표시되어야 합니다.

자세한 내용은 저자가 작성한 [Why useSyncExternalStore Is Not Used in Jotai](https://blog.axlight.com/posts/why-use-sync-external-store-is-not-used-in-jotai/)글이나 이에 대한 [discussion#2137](https://github.com/pmndrs/jotai/discussions/2137)을 참조하세요.

### Recoil vs Jotai

Jotai의 공식 문서에서도 논의가 계속되고 있으며, 일부 사람들이 두 가지의 차이점을 정리했습니다. 예를 들어:

- Jotai의 소스 코드가 더 간단합니다
- Jotai는 더 적은 보일러플레이트 코드를 가지고 있으며, Recoil에서 atom을 생성할 때 key를 사용할 필요가 없습니다
- Recoil의 번들 크기가 Jotai보다 10배 더 큽니다
- DX 측면에서 Jotai가 더 직관적입니다

현재 추세로 볼 때, Jotai의 미래는 Recoil보다 우월합니다. 몇 년이 지났음에도 불구하고 Recoil은 여전히 facebookexperimental 이라는 GitHub 리포지토리에 있습니다. Recoil을 선택하기 전에 신중하게 고려해야 합니다.

## Proxy-based

proxy 기반으로 구현된 패키지 중에서 Mobx와 Valtio가 더 많이 사용됩니다. Mobx는 오랫동안 사용되어 왔으며, 2015년부터 존재해 왔고, 현재도 많은 개발자들의 선택을 받고 있으며, 매주 약 100만 번의 다운로드 수를 기록하고 있습니다. Valtio는 새로운 후보자로, 2020년부터 3년 동안 매주 약 30만 번의 다운로드 수를 기록하며, 추세에 따르면 미래에는 더 많은 사람들이 Valtio를 사용할 것으로 보입니다.

### Valtio의 proxy-state 사용

Valtio는 Zustand와 Jotai의 개발자인 Daishi Kato가 개발한 proxy-state 상태 관리 도구로, 사용하기 매우 쉽고, 공식 문서가 잘 작성되어 있으며, 다양한 실용적인 시나리오 예제를 제공하고 TypeScript를 지원합니다. React 초보자이거나 간단한 상태 관리 도구를 원한다면 Valtio를 첫 번째 선택으로 고려할 수 있습니다.

Valtio의 두 가지 핵심 API는 proxy와 useSnapshot입니다. proxy는 원본 객체를 대리하는 데 사용되며, 대리된 객체가 변경될 때 Valtio는 이를 사용하는 위치에 알리고 재렌더링합니다:

```tsx
import { proxy, useSnapshot } from "valtio";

const state = proxy({ count: 0, text: "hello" });
```

proxy의 상태를 가져오려면 useSnapshot을 사용하고, 상태를 변경하려면 원본 state를 직접 변형할 수 있습니다:

```tsx
function Counter() {
  const snap = useSnapshot(state);
  return (
    <div>
      {snap.count}
      <button onClick={() => ++state.count}>+1</button>
    </div>
  );
}
```

proxy는 객체뿐만 아니라 클래스나 다른 proxy도 대리할 수 있습니다:

```tsx
// 代理 class
class User {
  first = null;
  last = null;
  constructor(first, last) {
    this.first = first;
    this.last = last;
  }
  greet() {
    return `Hi ${this.first}!`;
  }
  get fullName() {
    return `${this.first} ${this.last}`;
  }
}
const state = proxy(new User("Timo", "Kivinen"));

// 代理 proxy
const obj1State = proxy({ a: 1 });
const obj2State = proxy({ a: 2 });

const state = proxy({
  obj1: obj1State,
  obj2: obj2State,
});
```

#### Valtio가 렌더링 문제를 어떻게 해결하는지

Valtio는 Redux나 Zustand와 같은 selector 방식을 사용하여 상태를 가져오는 것이 아니라, 대리된 상태를 직접 사용하는 방식을 취합니다. 이 스타일은 atom 사용법과 더 유사합니다. Valtio는 대리된 객체의 어떤 속성이든 변경될 때마다 컴포넌트를 재렌더링합니다.

아래 예에서는 count가 변경될 때마다 두 컴포넌트 모두 렌더링되며, text가 변경될 때도 두 컴포넌트 모두 렌더링됩니다:

```tsx
const state = proxy({ count: 0, text: "hello" });

const ComponentA = () => {
  const snap = useSnapshot(state);
  return <div>{snap.count}</div>;
};

const ComponentB = () => {
  const snap = useSnapshot(state);
  return <div>{snap.text}</div>;
};
```

이로 인해 Valtio는 근본적으로 더 작은 객체에 더 적합하며, 객체의 한 속성이 변경되면 여러 컴포넌트가 재렌더링될 위험이 있습니다. 이 사용법은 사실상 기본 context API와 매우 유사하지만, context provider가 필요하지 않습니다.

2021년 9월 이전에는 Valtio가 재렌더링을 처리하기 위해 useReducer를 사용했지만, #234 이후에는 대리 상태가 변경되었는지 감지하고 재렌더링을 트리거하기 위해 useSyncExternalStore를 사용하도록 변경되었습니다.

### Mobx

Mobx는 매우 오래된 글로벌 상태 관리 패키지로, Redux와 비슷한 시기에 등장한 패키지입니다. 현재 다운로드 수에서 상위권에 속하는 유명한 상태 관리 패키지 중 하나로, 매주 약 100만 번의 다운로드 수를 기록하고 있습니다.

현재 많은 상태 관리 패키지 중에서 Mobx의 작성 방식은 매우 독특하며, 나중에 Mobx가 hook API를 도입했음에도 불구하고, 그 핵심 개념으로 인해 작성 방식이 다소 마법 같습니다. 다음에서는 Mobx를 살펴보겠습니다.

Mobx를 proxy 기반의 상태 관리 패키지로 분류합니다. 이는 그 하위에 proxy API가 존재한다는 것을 의미하며, Mobx는 모든 사용 중인 상태를 '관찰'하고 변경될 때 관련 컴포넌트에 렌더링을 알립니다.

![](https://github.com/JAVACAFE-STUDY/2024-modern-react-deep-dive-study/assets/97719273/ca6faaf2-2e47-485c-b9a8-4b1e9b5f217f)

Mobx에서는 여러 가지 방식으로 스토어를 생성할 수 있지만, 기본적으로는 데코레이터 패턴을 이해할 수 있습니다. 즉, 사용자 정의 상태와 함수에 추가 기능을 추가합니다. 예를 들어, 아래 예제에서는 @observable을 사용하여 count의 변경을 감시하고, @action으로 setCount라는 함수를 정의했습니다:

```tsx
import { action, observable } from "mobx";

class Store {
  @observable
  count = 1;

  @action
  setCount = () => {
    this.count++;
  };
}
```

store를 전달하는 권장 방식은 React의 context API를 사용하는 것이며, 이렇게 하면 단위 테스트를 더 쉽게 수행할 수 있습니다. store를 사용할 때는 컴포넌트 외부에서 HOC observer로 래핑해야 합니다.

```tsx
import { createContext, useContext } from "react";
import ReactDOM from "react-dom";
import { observer } from "mobx-react-lite";

const StoreContext = createContext();

const App = observer(() => {
  const store = useContext(StoreContext); // See the Timer definition above.
  return (
    <div>
      <button>count++</button>
      <span>Count: {store.count}</span>
    </div>
  );
});

ReactDOM.render(
  <StoreContext.Provider value={new Store()}>
    <App />
  </StoreContext.Provider>,
  document.body
);
```

#### Mobx가 렌더링 문제를 어떻게 해결하는지

Mobx도 마찬가지로 렌더링 메커니즘을 최적화했습니다. 예를 들어, 아래에 두 컴포넌트가 있고 username이 변경될 때 MyComponent만 재렌더링됩니다:

```tsx
const MyComponent = observer(() => {
  const { todos, username } = useContext(StoreContext);

  return (
    <div>
      {username}
      <TodosView todos={todos} />
    </div>
  );
});

const TodosView = observer(() => {
  const { todos } = useContext(StoreContext);

  return (
    <ul>
      {todos.map((todo) => (
        <li>{todo}</li>
      ))}
    </ul>
  );
});
```

Mobx의 구현 메커니즘은 지금까지 본 것 중에서 가장 특별하고 복잡합니다. 간단히 말하면, Mobx의 메커니즘은 관찰자 패턴입니다. store에서 상태를 사용할 때 구독이 트리거되고, 상태가 변경될 때 Mobx는 해당 컴포넌트를 업데이트하도록 관련 컴포넌트에 알립니다.

구현 방식은 observable로 정의된 속성과 객체를 모두 Proxy로 대리하고, 해당 속성과 객체에 추가 기능을 추가하는 것입니다. get과 set을 실행할 때 Mobx의 관찰자 패턴이 트리거됩니다.

store를 사용하는 컴포넌트에 observer를 추가하면, 컴포넌트 내부에서 특정 속성을 사용할 때 해당 속성이 observer에 연결됩니다. 그런 다음 observer가 Mobx의 전역 객체에 연결됩니다. 속성이 변경될 때마다 해당 속성을 구독하는 모든 observer가 실행됩니다.

구독과 발행 과정에서 observer 내부에서 useSyncExternalStore의 콜백을 호출하여 React에 해당 컴포넌트를 재렌더링해야 한다고 알립니다.

이는 Mobx의 구현 논리에 대한 매우 추상적인 설명입니다. 구현에 관심이 있는 독자는 원본 코드를 참조하거나 관련 문서를 읽어보세요. 여기서는 구현의 큰 방향만 이해하면 됩니다.

## Preact의 signals

Signals는 Preact가 2022년 9월에 발표한 상태 관리 패키지로, SolidJS에서 영감을 받았으며 순수한 자바스크립트로 작성되었습니다. 필요한 경우 React, Vue, Svelte에서 @preact/signals-react를 사용할 수 있습니다.

초기에 Preact 팀은 한 스타트업 팀에서 프로젝트가 커지면서 100명 이상의 엔지니어가 코드를 커밋하는 것을 발견했습니다. 컴포넌트 렌더링 최적화가 매우 어려워졌습니다.

useMemo, useCallback, memo 등의 최적화 방법이 있지만, 대규모 프로젝트에서 렌더링 최적화는 매우 어렵습니다. 개발자는 종종 dependencies array에서 어떤 객체가 변경되었는지 확인하는 데 많은 시간을 소비해야 합니다. 때로는 이러한 최적화가 기능 개발에 소요되는 시간보다 더 많은 시간을 필요로 합니다.

Preact는 개발 경험과 최적화 효과를 개선하기 위해 Signals 패키지를 만들었습니다. 더 이상 dependencies array를 처리할 필요가 없으며, 프로젝트에 바로 사용할 수 있습니다.

Flux, Atomic, Proxy 등의 패키지가 컴포넌트 수준의 재렌더링 문제를 해결하는 반면, Signal의 목표는 요소 수준의 렌더링 문제입니다.

아래 예에서 React의 논리로 볼 때, count.value++ 할 때마다 `<App/>`과 `<Child/>`가 모두 재렌더링될 것으로 예상됩니다. 이는 setState가 트리거되는 프로세스입니다. 그러나 @preact/signals-react를 사용하면 조정 과정을 직접 파괴합니다. count.value++ 할 때마다 `<h1>`만 재렌더링됩니다.

```tsx
import { useSignal, useSignalEffect } from "@preact/signals-react";

function Child() {
  console.log("render child");
  return <div>child</div>;
}

export default function App() {
  const count = useSignal(0);
  useSignalEffect(() => {
    setInterval(() => {
      count.value++;
    }, 1000);
  });
  console.log("rendering");

  return (
    <div>
      <h1>{count}</h1>
      <Child />
    </div>
  );
}
```

Signal의 설계는 Mobx와 Valtio와 매우 유사하며, 상태를 양방향으로 바인딩하지만, 상태를 사용하는 요소만 재렌더링되도록 합니다.

Preact의 공식 문서에서는 심지어 signal을 사용한 후 기존에 state를 사용했을 때 가상 DOM을 기반으로 하는 것과 비교하여 성능이 많은 배로 향상되었다고 언급합니다. signal을 사용할 때 상태를 전달하는 과정에서 signal을 사용하지 않는 요소를 건너뛰기 때문입니다.

![](https://github.com/JAVACAFE-STUDY/2024-modern-react-deep-dive-study/assets/97719273/aff1e972-5025-4295-b743-a124cc25b431)

## Signal은 미래인가?

![](https://github.com/JAVACAFE-STUDY/2024-modern-react-deep-dive-study/assets/97719273/e0231f89-1264-4bea-8dc8-9e73ed4b68bb)

다운로드 수를 보면 signal 패키지의 다운로드 수는 극히 적습니다. 이러한 패키지를 덜 사용하는 이유는 이 두 패키지가 비교적 새롭기 때문일 뿐만 아니라, signal이 React 팀이 추구하는 상태 관리 메커니즘이 아니기 때문입니다. React의 생명주기를 파괴하기 때문입니다.

Dan Abramov는 `@preact/signals`의 구현 원리가 React가 전혀 지원하지 않는 취약한 가정에 기반하고 있다고 언급했습니다. `@preact/signals`와 같은 패키지를 사용하여 React에 문제가 발생한 경우 React 팀은 문제를 해결할 수 없습니다.

결론적으로, 현재 React 생태계에서 signal을 사용하는 것은 좋은 시기나 선택이 아닙니다. 기본 상태 관리 메커니즘 또는 더 많은 사람들이 사용하는 상태 관리 패키지를 사용하는 것이 좋습니다.

그러나 signal은 현재 React에서 사용할 수 없지만, 많은 프레임워크가 이 개념을 점차 받아들이고 있습니다. Solid, Qwik, Vue, Preact, Angular 등의 프레임워크에서 signal을 구현했습니다.

> 부록으로, 13년 전에 https://knockoutjs.com/이 signal 개념을 이미 가지고 있었습니다.

## 결론

이 글에서는 React의 기본 상태 관리 메커니즘이 주로 직면하는 두 가지 문제를 다루었습니다:

- Prop drilling 문제
- Context가 전체 하위 트리를 렌더링하게 하는 문제

기본적으로 prop drilling 문제는 본질적으로 모두 context API를 통해 해결됩니다. 하지만 context가 전체 하위 트리를 렌더링하게 하는 문제가 발생합니다. 우리는 Flux, Atomic, Proxy 기반의 패키지가 상태 변경을 감지하고 컴포넌트를 재렌더링하는 구현에서 useSyncExternalStore API를 사용한다는 것을 볼 수 있습니다. 이는 다양한 핵심 개념에 따라 다릅니다.

마지막으로 React 커뮤니티에서 비교적 새로운 개념인 signal에 대해서도 간략하게 언급했습니다. 하지만 실제로 React 생태계에서 사용하기에는 적합하지 않으며, React 개발자가 해결할 수 없는 문제에 직면할 수 있습니다.

개인적인 판단으로는, 현재 팀에서 Redux, Zustand, Jotai를 사용하는 것이 더 나은 선택입니다. Recoil을 고려하지 않는 주된 이유는 issue가 너무 많고 여전히 facebookexperimental 리포지토리에 있다는 것입니다. Atomic 방식을 사용하려면 Jotai가 더 나은 선택입니다. Valtio는 멋져 보이지만, React에서 자주 사용되는 불변성 방식과는 반대되는 가변성 방식을 사용합니다. 팀에서 사용하기로 결정했다면 더 나은 교육과 훈련이 필요할 것입니다. 그렇지 않으면 코딩 스타일이 너무 다를 수 있습니다. Mobx의 작성 방식은 개인적으로 선호하지 않습니다 😅.
