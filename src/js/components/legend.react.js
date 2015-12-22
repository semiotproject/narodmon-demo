import React from 'react';
import AppStateStore from '../stores/app-state-store';
import ObservationStore from '../stores/observations-store';
import PlayButton from './play-button.react';
import vis from 'vis';
import moment from 'moment';

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
        return (
            <div id="legend">
                <div className="legend-body">
                    <p>Red is warmer</p>
                    <p>Blue is colder</p>
                    <p>Average temperature: {temp} {icon} ({avgDiff})</p>
                    <p>Show areas' temperature: <input type="checkbox" onChange={this.handleShowLabelsChange} defaultChecked={AppStateStore.showMapLabels} /></p>
                    <p>Current&nbsp;viewing&nbsp;time:&nbsp;{moment(this.state.currentTime).format('DD/MM/YY, hh:mm:ss')}</p>
                </div>
                <PlayButton />
            </div>
        );
    }
}

