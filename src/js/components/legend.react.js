import React from 'react';
import AppStateStore from '../stores/app-state-store';
import ObservationStore from '../stores/observations-store';
import PlayButton from './play-button.react';
import vis from 'vis';
import moment from 'moment';
import CONFIG from '../config';

const MODE_DESCRIPTION = {
    [CONFIG.MODES.diff]: "This is difference mode description",
    [CONFIG.MODES.temp]: "This is temperature mode description"
};

export default class Legend extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = this.getState();

        this.handleAppStateUpdate = () => {
            this.setState(this.getState());
        };
        this.handlePlayClick = () => {
            AppStateStore.currentTime = !AppStateStore.currentTime;
        };
        this.handleShowLabelsChange = () => {
            AppStateStore.showMapLabels = !AppStateStore.showMapLabels;
        };
        this.handleModeChange = (mode) => {
            AppStateStore.mode = mode;
        };
        this.handleCityChange = (e) => {
            AppStateStore.city = this.refs.city.value;
        };
    }

    getState() {
        return {
            currentTime: AppStateStore.currentTime
        };
    }

    componentDidMount() {
        AppStateStore.on('update', this.handleAppStateUpdate);
    }

    render() {
        const temp = ObservationStore.getTempForSnapshot(AppStateStore.currentSnapshot).toFixed(3);
        const avgDiff = ObservationStore.getAvgForSnapshot(AppStateStore.currentSnapshot).toFixed(3);
        let icon;
        if (avgDiff > 0) {
            icon = <i className="glyphicon glyphicon-arrow-up"></i>;
        } else if (avgDiff < 0) {
            icon = <i className="glyphicon glyphicon-arrow-down"></i>;
        } else {
            icon = <i className="glyphicon glyphicon-minus"></i>;
        }
        console.log(AppStateStore.mode, CONFIG.MODES);
        return (
            <div id="legend">
                <div className="legend-body">
                    <p>Current city:
                        <select ref="city" defaultValue={AppStateStore.city} onChange={this.handleCityChange}>
                            <option value={CONFIG.CITIES.Moscow}>Moscow</option>
                            <option value={CONFIG.CITIES['Saint-Petersburg']} disabled>Saint-Petersburg</option>
                        </select>
                    </p>
                    <p>Average temperature: {temp} {icon} ({avgDiff})</p>
                    <p>Show areas' labels: <input type="checkbox" onChange={this.handleShowLabelsChange} defaultChecked={AppStateStore.showMapLabels} /></p>
                    <p>Current&nbsp;viewing&nbsp;time:&nbsp;{moment(this.state.currentTime).format('DD/MM/YY, hh:mm:ss')}</p>
                </div>
                <PlayButton />
                <p>{MODE_DESCRIPTION[AppStateStore.mode]}</p>
            </div>
        );
    }
}

