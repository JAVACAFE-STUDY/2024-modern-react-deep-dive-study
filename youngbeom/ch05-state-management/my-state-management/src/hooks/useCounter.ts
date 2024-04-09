import { useState } from 'react'

export function useCounter(initCount: number = 0) {
    const [counter, setCounter] = useState(initCount)

    function inc() {
        setCounter((prev) => prev + 1)
    }

    return { counter, inc }
}
