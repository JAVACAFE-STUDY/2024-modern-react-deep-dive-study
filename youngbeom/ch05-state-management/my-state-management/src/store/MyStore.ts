type Initializer<T> = T extends any ? T | ((prev: T) => T) : never

export type Store<State> = {
    get: () => State
    set: (action: Initializer<State>) => State
    subscribe: (callback: () => void) => () => void
}

export const createStore = <State>(
    initialState: Initializer<State>
): Store<State> => {
    // useState와 마찬가지로 초깃값을 게으른 초기화를 위한 함수 또한
    // 그냥 값을 받을 수 있도록 한다.
    // state의 값은 스토어 내부에서 보관해야 하므로 변수로 선언한다.
    let state =
        typeof initialState !== 'function' ? initialState : initialState()
    // callbacks는 자료형에 관계없이 유일한 값을 저장할 수 있는 Set을 사용한다.
    const callbacks = new Set<() => void>()
    // 언제든 get이 호출되면 최신값을 가져올 수 있도록 함수로 만든다.
    const get = () => state
    const set = (nextState: State | ((prev: State) => State)) => {
        // 인수가 함수라면 함수를 실행해 새로운 값을 받고,
        // 아니라면 새로운 값을 그대로 사용한다.
        state =
            typeof nextState === 'function'
                ? (nextState as (prev: State) => State)(state)
                : nextState
        // 값의 설정이 발생하면 콜백 목록을 순회하면서 모든 콜백을 실행한다.
        callbacks.forEach((callback) => callback())
        return state
    }
    // subscribe는 콜백을 인수로 받는다.
    const subscribe = (callback: () => void) => {
        // 받은 함수를 콜백 목록에 추가한다.
        callbacks.add(callback)
        // 클린업 실행 시 이를 삭제해서 반복적으로 추가되는 것을 막는다.
        return () => {
            callbacks.delete(callback)
        }
    }
    return { get, set, subscribe }
}

export const store = createStore({ count: 0 })
