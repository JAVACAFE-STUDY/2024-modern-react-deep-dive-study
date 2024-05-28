import { useStore } from '../../hooks/useStore'
import { createStore } from '../../store/MyStore'

export const store = createStore({ count: 0 })

function Counter1() {
    const [state, setState] = useStore(store)

    function handleClick() {
        setState((prev) => ({ count: prev.count + 1 }))
    }

    return (
        <>
            <h3>Counter1: {state.count}</h3>
            <button onClick={handleClick}>+</button>
        </>
    )
}

function Counter2() {
    const [state, setState] = useStore(store)

    function handleClick() {
        setState((prev) => ({ count: prev.count + 1 }))
    }

    return (
        <>
            <h3>Counter2: {state.count}</h3>
            <button onClick={handleClick}>+</button>
        </>
    )
}

export function StoreCounter() {
    return (
        <>
            <h4>p.357 Store를 사용하는 예제</h4>
            <Counter1 />
            <Counter2 />
        </>
    )
}
