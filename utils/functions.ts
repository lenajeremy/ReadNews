import { TimeoutId } from '@reduxjs/toolkit/dist/query/core/buildMiddleware/types';
import * as Linking from 'expo-linking'
import { API_URL } from '../constants';
import * as React from 'react'


export function useDebounce<T>(fn: T extends (...args: any) => any ? T : never, timeout: number, defaultReturnValue: ReturnType<typeof fn>): [T, ReturnType<typeof fn>] {
    let timeoutId: TimeoutId;

    const [returnValue, setReturnValue] = React.useState<ReturnType<typeof fn>>(defaultReturnValue);

    const debouncedFunction = function () {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            const val = fn(...arguments);
            setReturnValue(val);
        }, timeout)

    } as T;

    const values: [T, ReturnType<typeof fn>] = React.useMemo(() => [debouncedFunction, returnValue], [returnValue])

    return values;
}

function returnboolean(): boolean {
    return false;
}

export const getTimeOfDay = () => {
    const date = new Date();
    const timeofDay = date.getHours();

    if (timeofDay >= 0 && timeofDay < 12) {
        return 'Good Morning';
    } else if (timeofDay >= 12 && timeofDay <= 16) {
        return 'Good Afternoon';
    } else {
        return 'Good Evening';
    }
};

export const getDateText = () => {
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const daysoftheweek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    const now = new Date();

    return `${daysoftheweek[now.getDay()]}, ${months[now.getMonth()]
        } ${now.getDate()}th`;
};

export const generateNewLinkToShare = (title: string, url: string, img: string, website: string, favicon: string, route: string): string => {

    const expoURL = Linking.createURL('/');
    // const urlParams = new URLSearchParams()

    // urlParams.set('title', title);
    // urlParams.set('url', url);
    // urlParams.set('img', img);
    // urlParams.set('website', website);
    // urlParams.set('favicon', favicon)

    // // return `${expoURL}${route}?${urlParams.toString()}

    return `${API_URL}/news/redirect?url=${url}&route=${route}&host=${expoURL}`
}