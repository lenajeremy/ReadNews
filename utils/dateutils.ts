const getTimeOfDay = () => {
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

const getDateText = () => {
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

export { getTimeOfDay, getDateText };