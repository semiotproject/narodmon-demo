import $ from 'jquery';
import CONFIG from '../config';

export function loadLastObservations() {
    const promise = $.Deferred();

    $.ajax({
        url: CONFIG.URLS.obs_snapshot,
        success(data) {
            promise.resolve(data.events[0][0].events);
        },
        error() {
            console.error(`failed to load observation snapshot`);
        }
    });

    return promise;
}
