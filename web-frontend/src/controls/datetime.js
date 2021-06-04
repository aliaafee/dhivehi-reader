const moment = require('moment');

exports.toUTCDateTime = (localisodatetime_str) => {
    return moment(localisodatetime_str, 'YYYY-MM-DDTHH:mm').utc().toDate()
}


exports.toLocalDateTimeIsoString = (utc_datetime) => {
    return moment.utc(utc_datetime).local().format('YYYY-MM-DDTHH:mm')
}

exports.toUTCDate = (localisodate_str) => {
    return moment(localisodate_str, 'YYYY-MM-DD').utc().toDate()
}


exports.toLocalDateIsoString = (utc_date) => {
    return moment.utc(utc_date).local().format('YYYY-MM-DD')
}


exports.toLocalDateFormatted = (utc_datetime) => {
    return moment.utc(utc_datetime).local().format('LLL')
}