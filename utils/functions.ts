import * as Linking from 'expo-linking'


export function debounce<T>(fn: T extends Function ? T : never, timeout: number): T {
    let timeoutId: number;

    return (function () {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            console.log('running function')
            fn(...arguments)
        }, timeout)
    } as T)
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

export const generateNewLinkToShare = (title: string, url: string, img: string, website: string, favicon: string): string => {

    const expoURL = Linking.createURL('/OpenNews');
    const urlParams = new URLSearchParams()

    urlParams.set('title', title);
    urlParams.set('url', url);
    urlParams.set('img', img);
    urlParams.set('website', website);
    urlParams.set('favicon', favicon)

    return `${expoURL}?${urlParams.toString()}`
}