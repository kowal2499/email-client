
let parseReasons = errors => {
    if (Array.isArray(errors)) {

        let result = '';
        for (let error of errors) {

            if (typeof error === 'object') {
                result = result.concat(parseReasons(error))
            } else {
                result = result.concat('<br>', error)
            }
        }
        return result

    } else {
        let result = '';
        for (let key of Object.keys(errors)) {

            if (typeof errors[key] === 'object') {
                result = parseReasons(errors[key]);
            }

        }
        return result;
    }
}

export default {parseReasons}