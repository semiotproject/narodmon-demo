import ObservationStore from '../stores/observations-store';
import React from 'react';
import CONFIG from '../config';
import Timeline from './timeline.react';
import L from 'leaflet';
import { createPolygons } from '../voronoi.js';
import AppStateStore from '../stores/app-state-store';
import Legend from './legend.react';

const HEAT_RADIUS = 25;

export default class App extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {
            currentSnapshot: null,
            isLoading: true
        };
        this.handleObservationStoreChange = () => {
            this.setObservations();
        };
        this.handleAppStateChange = () => {
            if (this.state.currentSnapshot !== AppStateStore.currentSnapshot) {
                this.setObservations();
            }
        };
    }

    componentDidMount() {
        ObservationStore.on('update', this.handleObservationStoreChange);
        AppStateStore.on('update', this.handleAppStateChange);
        ObservationStore.load().done((obs) => {
            AppStateStore.checkSnapshot();
            this.setState({
                currentSnapshot: AppStateStore.currentSnapshot,
                isLoading: false
            }, () => {
                this.initMap();
                this.setObservations();
            });
        });
    }
    setObservations() {
        console.info(`setting new observations..`);
        this.setState({
            observations: ObservationStore.getObservationsForSnapshot(AppStateStore.currentSnapshot)
        }, () => {
            this.setHeatMap();
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
        createPolygons(this._map, points);
    }

    render() {
        let content;
        if (this.state.isLoading) {
            content = <div className="preloader"></div>;
        } else {
            content = (
                <div className="content">
                    <div id="map"></div>
                    <Legend />
                    <Timeline />
                </div>
            );
        }
        return (
            <div>
                <nav className="navbar navbar-inverse navbar-fixed-top">
                    <div className="navbar-collapse collapse">
                        <a href="" className="navbar-brand">Unequal Temperature Changes (Demo)</a>
                    </div>
                </nav>
                {content}
            </div>
        );
    }
}
