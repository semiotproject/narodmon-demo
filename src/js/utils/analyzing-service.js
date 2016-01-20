import $ from 'jquery';
import CONFIG from '../config';
import { parseObservations as parseObservationsAsTurtle } from './turtle';
import { loadLocations as loadLocationsFromSparql } from './sparql';
import queryString from 'query-string';

function loadLastObservations(queryId, _from, to) {
    console.info(`loading archive data from ${new Date(_from)} to ${new Date(to)}...`);
    const promise = $.Deferred();
    $.ajax({
        url: CONFIG.URLS.obs_snapshot.format(queryId, _from, to),
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
function parseObservations(obs) {
    const params = queryString.parse(location.search);
    if (params.turtle === "true") {
        return parseObservationsAsTurtle(obs);
    }
    const promise = $.Deferred();

    // since we get JSON, no need to parseObservations explicitly; just parse numbers to float
    promise.resolve(JSON.parse(obs).map((o) => {
        /*
        o.avg = parseFloat(o.avg);
        o.temp = parseFloat(o.temp);
        o.diff = parseFloat(o.diff);
        o.group = parseFloat(o.group);
        */
        return o;
    }));

    return promise;
}
function loadLocations(city) {
    return loadLocationsFromSparql(city);
}

export default { loadLocations, loadLastObservations, parseObservations };