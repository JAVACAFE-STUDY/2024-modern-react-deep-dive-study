import { useMemo } from 'react'
import { store } from './ObjectStore'
import { useSubscription } from 'use-subscription'

export function ObjectStoreSubscribedCounter() {
    const subscription = useMemo(
        () => ({
            // 스토어의 모든 값으로 설정해 뒀지만 selector 예제와 마찬가지로
            // 특정한 값에서만 가져오는 것도 가능하다.
            getCurrentValue: () => store.get(),
            subscribe: (callback: () => void) => {
                const unsubscribe = store.subscribe(callback)
                return () => unsubscribe()
            },
        }),
        []
    )

    const value = useSubscription(subscription)
    return (
        <>
            <h4>ObjectStore에서 사용중인 store를 구독하는 예제</h4>
            <p>value.count: {value.count}</p>
            <p>value.text: {value.text}</p>
        </>
    )
}
