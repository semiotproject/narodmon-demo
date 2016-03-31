import $ from 'jquery';
import CONFIG from '../config';

function getQueryResult(query, accept) {
    return $.ajax({
        url: CONFIG.URLS.endpoint,
        data: {
            query
        },
        headers: {
            Accept: accept
        },
        error() {
            console.error('failed to execute query: ', query);
        }
    });
}

function getSparqlJsonResult(query) {
    return getQueryResult(query, "application/sparql-results+json");
}

function getTurtleResult(query) {
    return getQueryResult(query, "application/turtle");
}

export function loadLocations(city) {
    return getSparqlJsonResult(`
        PREFIX ssn: <http://purl.oclc.org/NET/ssnx/ssn#>
        PREFIX dul: <http://www.loa-cnr.it/ontologies/DUL.owl#>
        PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

        SELECT *
        WHERE {
          ?subject ssn:hasSubSystem ?meter;
            geo:location/geo:lat ?lat;
            geo:location/geo:long ?lng.
        }
    `);
}
