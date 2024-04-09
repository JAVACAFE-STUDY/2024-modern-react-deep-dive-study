import { useMemo } from 'react'
import { store } from './ObjectStore'
import { useSubscription } from 'use-subscription'

/** @deprecated 사용해야 될 상황이 생기면 use-sync-external-store를 사용 */
// You may now migrate to use-sync-external-store directly instead, which has the same API as React.useSyncExternalStore. The use-subscription package is now a thin wrapper over use-sync-external-store and will not be updated further.
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
