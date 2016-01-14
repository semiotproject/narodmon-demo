import ObservationStore from '../stores/observations-store';
import React from 'react';
import CONFIG from '../config';
import Timeline from './timeline.react';
import L from 'leaflet';
import { drawTempPolygons, drawDiffPolygons } from '../voronoi.js';
import AppStateStore from '../stores/app-state-store';
import Legend from './legend.react';

const HEAT_RADIUS = 25;

export default class App extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {
            currentSnapshot: null,
            showMapLabels: AppStateStore.showMapLabels,
            mode: AppStateStore.mode,
            isLoading: true
        };
        this.handleObservationStoreChange = () => {
            this.setObservations();
        };
        this.handleAppStateChange = () => {
            if (this.state.currentSnapshot !== AppStateStore.currentSnapshot) {
                this.setObservations();
            }
            if (this.state.showMapLabels !== AppStateStore.showMapLabels) {
                this.setState({
                    showMapLabels: AppStateStore.showMapLabels
                }, this.setHeatMap.bind(this));
            }
            if (this.state.mode !== AppStateStore.mode) {
                this.setState({
                    mode: AppStateStore.mode
                }, this.setHeatMap.bind(this));
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
            return obs[key];
        });
        return AppStateStore.mode === CONFIG.MODES.diff ?
            drawDiffPolygons(this._map, points, this.state.showMapLabels) :
            drawTempPolygons(this._map, points, this.state.showMapLabels);
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
