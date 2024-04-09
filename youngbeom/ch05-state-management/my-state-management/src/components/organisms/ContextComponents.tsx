import { ChangeEvent, useCallback, useEffect, useId } from 'react'
import { useCounterContextSelector } from '../../hooks/useCounterContextSelector'
import {
    CounterStore,
    CounterStoreProvider,
} from '../../store/CounterContextStore'

const ContextCounter = () => {
    const id = useId()
    const [counter, setStore] = useCounterContextSelector(
        useCallback((state: CounterStore) => state.count, [])
    )
    function handleClick() {
        setStore((prev) => ({ ...prev, count: prev.count + 1 }))
    }
    useEffect(() => {
        console.log(`${id} Counter Rendered`)
    })
    return (
        <div>
            {counter} <button onClick={handleClick}>+</button>
        </div>
    )
}
const ContextInput = () => {
    const id = useId()
    const [text, setStore] = useCounterContextSelector(
        useCallback((state: CounterStore) => state.text, [])
    )
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setStore((prev) => ({ ...prev, text: e.target.value }))
    }
    useEffect(() => {
        console.log(`${id} Counter Rendered`)
    })
    return (
        <div>
            <input value={text} onChange={handleChange} />
        </div>
    )
}

export function ContextComponents() {
    return (
        <>
            <h4>5.2.3 useState와 Context를 동시에 사용해 보기</h4>
            {/* 0 */}
            <ContextCounter />
            {/* hi */}
            <ContextInput />
            <CounterStoreProvider initialState={{ count: 10, text: 'hello' }}>
                {/* 10 */}
                <ContextCounter />
                {/* hello */}
                <ContextInput />
                <CounterStoreProvider
                    initialState={{ count: 20, text: 'welcome' }}
                >
                    {/* 20 */}
                    <ContextCounter />
                    {/* welcome */}
                    <ContextInput />
                </CounterStoreProvider>
            </CounterStoreProvider>
        </>
    )
}
