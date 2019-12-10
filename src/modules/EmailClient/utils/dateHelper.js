import moment from 'moment';

let getDate = (date) => {
    let mDate = moment(date);

    if (mDate && mDate.isValid()) {
        return mDate.format('YYYY-MM-DD');
    }
    return '';
};

let getTime = (date) => {
    let mDate = moment(date);

    if (mDate && mDate.isValid()) {
        return mDate.format('HH:mm:ss');
    }
    return '';
};

export default {getDate, getTime}