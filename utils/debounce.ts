// @ts-nocheck
export default function debounce<T>(fn: T extends Function ? T : never, timeout: number): T {
    let timeoutId: number;

    return (function () {

        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            fn(...arguments)
        }, timeoutId)
    } as T)
}