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
        const avg = ObservationStore.getAvgForSnapshot(AppStateStore.currentSnapshot);
        return (
            <div id="legend">
                <div className="legend-body">
                    <p>Red is warmer</p>
                    <p>Blue is colder</p>
                    <p>Average difference: {avg}</p>
                    <p>Current&nbsp;viewing&nbsp;time:&nbsp;{moment(this.state.currentTime).format('DD/MM/YY, hh:mm:ss')}</p>
                </div>
                <PlayButton />
            </div>
        );
    }
}

