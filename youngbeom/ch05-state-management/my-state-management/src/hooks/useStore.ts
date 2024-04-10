import { useEffect, useState } from 'react'
import { Store } from '../store/MyStore'

export const useStore = <State>(store: Store<State>) => {
    const [state, setState] = useState<State>(() => store.get())
    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setState(store.get())
        })
        return unsubscribe
    }, [store])

    return [state, store.set] as const
}
