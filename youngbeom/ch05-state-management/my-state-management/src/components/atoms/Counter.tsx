export function Counter({
    counter,
    inc,
}: {
    counter: number
    inc: () => void
}) {
    return (
        <>
            <div>
                counter: {counter} <button onClick={inc}>+</button>
            </div>
        </>
    )
}
