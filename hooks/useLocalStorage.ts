import * as React from 'react'
import localStorage from "../utils/localStorage";


type LocalStorageHooksValue<T> =
    [
        value: T | undefined,
        setValue: (value: T | undefined) => void,
        loading: boolean,
        clearAll?: () => void
    ]

function useLocalStorage<T>(key: string): LocalStorageHooksValue<T> {

    const [value, setValue] = React.useState<T | undefined>()
    const [loading, setLoading] = React.useState<boolean>(true)

    React.useEffect(() => {
        (async function () {
            let val = await localStorage.getItem(key);
            if (val) {
                setValue(JSON.parse(val))
            }

            setLoading(false)
        })()
    })


    const updateValue = React.useCallback((value: T | undefined) => {

        console.log(`updating ${key} to ${value}`)

        if (value) {
            localStorage.setItem(key, JSON.stringify(value))
            setValue(value);
        } else {
            localStorage.removeItem(key, () => setValue(undefined))
        }
    }, [key]);

    const clearAll = React.useCallback(() => {
        localStorage.clear();
    }, [])

    React.useEffect(() => {
        console.log(key, value, loading)
    }, [value, loading])

    return [value, updateValue, loading, clearAll]
}

export default useLocalStorage;