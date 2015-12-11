
const HEAT_RADIUS = 25;

import ObservationStore from '../stores/observations-store';
import React from 'react';
import CONFIG from '../config';
import L from 'leaflet';
import { createPolygons } from '../voronoi.js';

export default class App extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {
            observations: {}
        };
        this.handleStoreUpdate = () => {
            this.setObservations();
        };
    }

    componentDidMount() {
        this.initMap();
        ObservationStore.on('update', this.handleStoreUpdate);
        ObservationStore.load().done((obs) => {
            this.setObservations();
            this.setHeatMap();
        });
    }
    setObservations(obs) {
        this.setState({
            observations: ObservationStore.get()
        });
    }

    componentWillUpdate(nextProps, nextState) {
        //
    }

    initMap() {
        this._map = L.map("map").setView([55.754247, 37.621856], 16);

        L.tileLayer(CONFIG.URLS.tiles, {
            attribution: '',
            id: "mapbox.light",
            maxZoom: 16,
            minZoom: 8
        }).addTo(this._map);

        this._map.invalidateSize();
    }

    setHeatMap() {
        const obs = this.state.observations;
        const points = Object.keys(obs).map((key) => {
            return {
                x: obs[key].location.lat,
                y: obs[key].location.lng,
                group: obs[key].group,
                intensity: obs[key].diff - obs[key].avg
            };
        });
        console.log(`found ${points.length} points: `, points);
        createPolygons(this._map, points);
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-inverse navbar-fixed-top">
                    <div className="navbar-collapse collapse">
                        <a href="" className="navbar-brand">Narodmon demo</a>
                    </div>
                </nav>
                <div id="map">

                </div>
            </div>
        );
    }
}