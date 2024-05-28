import { PropsWithChildren, createContext, useRef } from 'react'
import { Store, createStore } from './MyStore'

export type CounterStore = { count: number; text: string }

// Context를 생성하면 자동으로 스토어도 함께 생성한다.
export const CounterStoreContext = createContext<Store<CounterStore>>(
    createStore<CounterStore>({ count: 0, text: 'hello' })
)
export const CounterStoreProvider = ({
    initialState,
    children,
}: PropsWithChildren<{
    initialState: CounterStore
}>) => {
    const storeRef = useRef<Store<CounterStore>>()
    // 스토어를 생성한 적이 없다면 최초에 한 번 생성한다.
    if (!storeRef.current) {
        storeRef.current = createStore(initialState)
    }
    return (
        <CounterStoreContext.Provider value={storeRef.current}>
            {children}
        </CounterStoreContext.Provider>
    )
}
