import { ChangeEvent, useCallback, useEffect } from 'react'
import { useStoreSelector } from '../../hooks/useStoreSelector'
import { createStore } from '../../store/MyStore'
import { ObjectStoreSubscribedCounter } from './ObjectStoreSubscribedCounter'

export const store = createStore({ count: 0, text: 'hi' })
function Counter() {
    const counter = useStoreSelector(
        store,
        useCallback((state) => state.count, [])
    )
    function handleClick() {
        store.set((prev) => ({ ...prev, count: prev.count + 1 }))
    }
    useEffect(() => {
        console.log('Counter Rendered')
    })
    return (
        <>
            <h3>{counter}</h3>
            <button onClick={handleClick}>+</button>
        </>
    )
}

const textSelector = (state: ReturnType<typeof store.get>) => state.text
function TextEditor() {
    const text = useStoreSelector(store, textSelector)
    useEffect(() => {
        console.log('TextEditor Rendered')
    })
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        store.set((prev) => ({ ...prev, text: e.target.value }))
    }
    return (
        <>
            <h3>{text}</h3>
            <input value={text} onChange={handleChange} />
        </>
    )
}

export function ObjectStore() {
    return (
        <>
            <h4>p.362 store가 단일 값이 아니라 Object 형태인 경우</h4>
            <Counter />
            <TextEditor />
            <p>
                Counter와 TextEditor는 같은 store를 사용하지만 자신에 해당하는
                state의 변화에 대해서만 리랜더링 한다. (console 로그에서
                리랜더링 여부 확인)
            </p>
            <ObjectStoreSubscribedCounter />
        </>
    )
}
