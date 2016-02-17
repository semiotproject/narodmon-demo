import queryString from 'query-string';

const FUSEKI_BASE = `http://demo-1.semiot.ru:3030/ds/query`;
const ANALYZING_SERVICE_BASE = `http://demo-1.semiot.ru:8085/`;

const params = queryString.parse(location.search);
const INITIAL_TIME_BOUNDS = [
    params.from ? parseInt(params.from) : Date.now() - 12 * 3600 * 1000,
    params.to ? parseInt(params.to) : Date.now() + 10 * 1000
];

export default {
    URLS: {
        tiles: "http://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}",
        endpoint: FUSEKI_BASE,
        obs_snapshot: ANALYZING_SERVICE_BASE + "api/query/{0}/events?from={1}&to={2}"
    },
    INITIAL_TIME_BOUNDS,
    MODES: {
        diff: 'DIFF_MODE',
        temp: 'TEMPERATURE_MODE'
    },
    CITIES: {
        Moscow: {
            queryId: 1,
            center: [55.754247, 37.621856]
        },
        'Saint-Petersburg': {
            queryId: 2,
            center: [59.937545, 30.337841]
        }
    },
    TOPICS: {
        observations: 'ru.semiot.alerts'
    }
};
