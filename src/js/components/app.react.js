import ObservationStore from '../stores/observations-store';
import React from 'react';
import CONFIG from '../config';
import Timeline from './timeline.react';
import L from 'leaflet';
import { drawTempPolygons, drawDiffPolygons } from '../voronoi.js';
import AppStateStore from '../stores/app-state-store';
import Legend from './legend.react';
import Description from './description.react';
import Navbar from './nav.react';

const HEAT_RADIUS = 25;

export default class App extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {
            currentSnapshot: null,
            currentCity: AppStateStore.city,
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
            if (this.state.currentCity !== AppStateStore.city) {
                this.setState({
                    currentCity: AppStateStore.city
                }, this.loadCity.bind(this, AppStateStore.city));
            }
        };
    }

    componentDidMount() {
        ObservationStore.on('update', this.handleObservationStoreChange);
        AppStateStore.on('update', this.handleAppStateChange);
        this.loadCity(this.state.currentCity);
    }
    loadCity(city) {
        console.info(`loading info for city ${city}..`);
        ObservationStore.load(city).done((obs) => {
            AppStateStore.checkSnapshot();
            this.setState({
                currentSnapshot: AppStateStore.currentSnapshot,
                isLoading: false
            }, () => {
                if (!this._map) {
                    this.initMap();
                }
                this.setMapCenter();
                this.setObservations();
            });
        });
    }
    setObservations() {
        console.info(`setting new observations..`);
        this.setState({
            observations: ObservationStore.getObservationsForSnapshot(AppStateStore.currentSnapshot),
            currentSnapshot: AppStateStore.currentSnapshot
        }, () => {
            this.setHeatMap();
        });
    }

    componentWillUpdate(nextProps, nextState) {
        //
    }

    initMap() {
        this._map = L.map("map");

        L.tileLayer(CONFIG.URLS.tiles, {
            attribution: '',
            id: "mapbox.light",
            maxZoom: 16,
            minZoom: 8
        }).addTo(this._map);

        this._map.invalidateSize();
    }

    setMapCenter() {
        this._map.setView(CONFIG.CITIES[this.state.currentCity].center, 13);
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
        return (
            <div>
                <Navbar />
                <div className={"content" + (this.state.isLoading ? " preloader" : "")}>
                    <div id="map"></div>
                    {
                        !this.state.isLoading &&
                            <div id="right-container">
                                <Legend />
                                <Description />
                            </div>
                    }
                    {
                        !this.state.isLoading &&
                            <Timeline />
                    }
                </div>
            </div>
        );
    }
}
