export const removeUnnecessaryDiff = (dif: any) => {
    if (dif?.fullUrl) {
        delete dif?.fullUrl;
    }
    if (dif?.link) {
        delete dif?.link;
    }
    if (dif?.resource?.meta) {
        delete dif?.resource?.meta;
    }
    if (!(!!Object.keys(dif?.resource).length)) {
        delete dif?.resource;
    }
    removedEmptyObj(dif)
}

const removedEmptyObj = (obj: any) => {
    Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') {
            removedEmptyObj(obj[key]);
        }
        if (isEmpty(obj[key])) {
            delete obj[key];
        }
    });
    return obj;
}

const isEmpty = (value: any) => {
    return (
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' && Object.keys(value).length === 0)
    );
};
