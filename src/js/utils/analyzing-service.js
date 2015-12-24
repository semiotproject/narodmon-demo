import $ from 'jquery';
import CONFIG from '../config';

export function loadLastObservations(_from, to) {

    console.info(`loading archive data from ${new Date(_from)} to ${new Date(to)}...`);

    const promise = $.Deferred();

    $.ajax({
        url: CONFIG.URLS.obs_snapshot.format(_from, to),
        success(data) {
            promise.resolve(data);
        },
        error() {
            console.error(`failed to load observation snapshot`);
            promise.resolve([]);
        }
    });

    return promise;
}
