import queryString from 'query-string';

const FUSEKI_BASE = `http://demo-1.semiot.ru:3030/ds/query`;
const ANALYZING_SERVICE_BASE = `http://demo-1.semiot.ru:8085/`;

const params = queryString.parse(location.search);
const INITIAL_TIME_BOUNDS = [
    params.from ? parseInt(params.from) : Date.now() - 1 * 3600 * 1000,
    params.to ? parseInt(params.to) : Date.now() + 10 * 1000
];

export default {
    URLS: {
        tiles: "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ",
        endpoint: FUSEKI_BASE,
        obs_snapshot: ANALYZING_SERVICE_BASE + "api/query/1/events?from={0}&to={1}"
    },
    INITIAL_TIME_BOUNDS,
    TOPICS: {
        observations: 'ru.semiot.alerts'
    }
};
