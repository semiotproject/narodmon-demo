import N3 from 'n3';
import $ from 'jquery';

export function parseTriples(turtle) {

    const parser = new N3.Parser();
    const defer = $.Deferred();
    const triples = [];

    parser.parse(turtle, (err, triple) => {
        if (err) {
            console.error(`error while parsing triples: `, err);
            defer.reject();
        }
        if (triple) {
            triples.push(triple);
        } else {
            defer.resolve(triples);
        }
    });

    return defer;
}

function normalizeTTL(ttl) {
    return ttl.replace(/\n/g, " . ");
}

function parseFloatFromLiteral(l) {
    return parseFloat(N3.Util.getLiteralValue(l));
}

export function parseObservations(ttl) {
    const promise = $.Deferred();
    const store = new N3.Store();

    parseTriples(normalizeTTL(ttl)).done((triples) => {
        triples.map((t) => {
            store.addTriple(t);
        });

        // grab out sensors
        const observations = store.find(null, "http://example.com/#InGroup", null, '').map((t) => {
            return {
                sensor: t.subject
            };
        });

        // collect avg and diff for each sensor
        observations.map((s, index) => {
            try {
                $.extend(observations[index], {
                    avg: parseFloatFromLiteral(store.find(s.sensor, "http://example.com/#hasAvg", null, '')[0].object),
                    temp: parseFloatFromLiteral(store.find(s.sensor, "http://example.com/#hasAbsTemp", null, '')[0].object),
                    diff: parseFloatFromLiteral(store.find(s.sensor, "http://example.com/#hasDiff", null, '')[0].object),
                    group: parseFloatFromLiteral(store.find(s.sensor, "http://example.com/#InGroup", null, '')[0].object)
                });
            } catch (e) {
                console.error(`unexpected error while constructing sensor info: `, e);
            }
        });
        promise.resolve(observations);
    });

    return promise;
}