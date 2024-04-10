import { useState } from 'react'
import './App.css'
import { SampleCounter } from './components/organisms/SampleCounter'
import { Counter } from './components/atoms/Counter'
import { useCounter } from './hooks/useCounter'
import { StoreCounter } from './components/organisms/StoreCounter'
import { ObjectStore } from './components/organisms/ObjectStore'
import { ContextComponents } from './components/organisms/ContextComponents'

type ComponentNames =
    | 'Counter'
    | 'CounterParent'
    | 'StoreCounter'
    | 'ObjectStore'
    | 'ContextComponents'

function App() {
    const [selectedValue, setSelectedValue] = useState<ComponentNames>()

    // 라디오 버튼 선택 변경 핸들러
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value as ComponentNames)
    }

    const Counters = () => {
        return (
            <>
                <h4>5.2.1 가장 기본적인 방법: useState와 useReducer</h4>
                <SampleCounter />
                <SampleCounter />
                <p>
                    로직의 재사용이 가능하다는 장점. 각각의 상태는 공유되지
                    않는다
                </p>
            </>
        )
    }

    const CounterParent = () => {
        const { counter, inc } = useCounter()

        return (
            <>
                <h4>상태의 공유를 위해 상태를 끌어올린 예제</h4>
                <Counter counter={counter} inc={inc} />
                <Counter counter={counter} inc={inc} />
                <p>
                    상태의 공유를 위해 상태를 부모 컴포넌트로 끌어올리고 자식
                    컴포넌트에서는 해당값을 렌더링만 하는 구조
                </p>
            </>
        )
    }

    // 선택된 값에 따라 다른 컴포넌트를 렌더링하는 함수
    const renderContent = () => {
        switch (selectedValue) {
            case 'Counter':
                return <Counters />
            case 'CounterParent':
                return <CounterParent />
            case 'StoreCounter':
                return <StoreCounter />
            case 'ObjectStore':
                return <ObjectStore />
            case 'ContextComponents':
                return <ContextComponents />
            default:
                return <Counters />
        }
    }

    const RadioInput = ({
        componentName,
        title,
    }: {
        componentName: ComponentNames
        title: string
    }) => {
        return (
            <div>
                <label>
                    <input
                        type="radio"
                        value={componentName}
                        checked={selectedValue === componentName}
                        onChange={handleChange}
                    />
                    {title}
                </label>
            </div>
        )
    }

    return (
        <>
            <h3>5.2 리액트 훅으로 시작하는 상태 관리</h3>
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 10,
                    textAlign: 'left',
                }}
            >
                <form>
                    <h5>예제리스트</h5>
                    <RadioInput
                        componentName="Counter"
                        title="5.2.1 가장 기본적인 방법: useState와 useReducer"
                    />
                    <RadioInput
                        componentName="CounterParent"
                        title="p.352 상태의 공유를 위해 상태를 끌어올린 예제"
                    />
                    <RadioInput
                        componentName="StoreCounter"
                        title="p.357 Store를 사용하는 예제"
                    />
                    <RadioInput
                        componentName="ObjectStore"
                        title="p.362 store가 Object 형태(여러 값)을 담고 있는 예제"
                    />
                    <RadioInput
                        componentName="ContextComponents"
                        title="5.2.3 useState와 Context를 동시에 사용해 보기"
                    />
                </form>
            </div>
            {renderContent()}
        </>
    )
}

export default App
