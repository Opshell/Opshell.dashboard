import {
    map,
    sumBy,
    debounce,
    throttle,
    sum,
    cloneDeep,
    groupBy,
    find,
    concat,
} from 'lodash-es';

export default function(app) {
    const lodash = {
        map, sumBy, debounce, throttle, sum, cloneDeep, groupBy, find, concat
    };
    app.provide('_', lodash);
    app.config.globalProperties._ = lodash;
}