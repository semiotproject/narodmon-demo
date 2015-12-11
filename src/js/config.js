"use strict";

const FUSEKI_BASE = `http://demo-1.semiot.ru:3030/ds/query`;
const ANALYZING_SERVICE_BASE = `http://demo-1.semiot.ru:8085/`;

export default {
    URLS: {
        tiles: "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ",
        endpoint: FUSEKI_BASE,
        obs_snapshot: ANALYZING_SERVICE_BASE + "api/query/3"
    },
    TOPICS: {
        observations: 'ru.semiot.alerts'
    }
};
