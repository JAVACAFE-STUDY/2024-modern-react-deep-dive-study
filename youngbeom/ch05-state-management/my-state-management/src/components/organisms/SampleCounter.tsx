import { useCounter } from '../../hooks/useCounter'

export function SampleCounter() {
    const { counter, inc } = useCounter(0)

    return (
        <>
            <div>
                counter: {counter} <button onClick={inc}>+</button>
            </div>
        </>
    )
}
