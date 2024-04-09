import { useContext, useMemo } from 'react'
import { CounterStore, CounterStoreContext } from '../store/CounterContextStore'
import { useSubscription } from 'use-subscription'

export const useCounterContextSelector = <State>(
    selector: (state: CounterStore) => State
) => {
    const store = useContext(CounterStoreContext)
    // useStoreSelector를 사용해도 동일하다.
    const subscription = useSubscription(
        useMemo(
            () => ({
                getCurrentValue: () => selector(store.get()),
                subscribe: store.subscribe,
            }),
            [store, selector]
        )
    )
    return [subscription, store.set] as const
}
