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
    }, []);


    const updateValue = React.useCallback((value: T | undefined) => {
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

    const values: LocalStorageHooksValue<T> = React.useMemo(() => ([value, updateValue, loading, clearAll]), [value, updateValue, loading])

    return values;
}

export default useLocalStorage;