import React from 'react';
import AppStateStore from '../stores/app-state-store';
import vis from 'vis';

const CUSTOM_TIME_ID = "custom_time";

export default class Timeline extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = this.getState();

        this.handleTimelineClick = (e) => {
            AppStateStore.currentTime = e.time.getTime();
        };

        this.handleAppStateUpdate = () => {
            this.setState(this.getState());
        };
        this.handlePlayClick = () => {
            AppStateStore.isPlaying = !AppStateStore.isPlaying;
        };
    }

    getState() {
        return {
            currentTime: AppStateStore.currentTime,
            isPlaying: AppStateStore.isPlaying
        };
    }

    componentDidMount() {
        this.initTimeline();
        AppStateStore.on('update', this.handleAppStateUpdate);
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.currentTime !== this.state.currentTime) {
            this.setTime(this.state.currentTime);
        }
    }

    initTimeline() {
        const container = this.refs.root;
        const options = {
            end: Date.now(),
            showCurrentTime: false
        };
        this._timeline = new vis.Timeline(container, [], options);
        this._timeline.addCustomTime(this.state.currentTime, CUSTOM_TIME_ID);
        this._timeline.on('click', this.handleTimelineClick);
    }
    setTime(timestamp) {
        this._timeline.setCustomTime(timestamp, CUSTOM_TIME_ID);
    }

    render() {
        return (
            <div id="timeline" ref="root">
            </div>
        );
    }
}
