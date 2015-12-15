import React from 'react';
import AppStateStore from '../stores/app-state-store';
import vis from 'vis';

export default class Timeline extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = this.getState();

        this.handleAppStateUpdate = () => {
            this.setState(this.getState());
        };
        this.handlePlayClick = () => {
            AppStateStore.isPlaying = !AppStateStore.isPlaying;
        };
    }

    getState() {
        return {
            isPlaying: AppStateStore.isPlaying
        };
    }

    componentDidMount() {
        AppStateStore.on('update', this.handleAppStateUpdate);
    }

    render() {
        return (
            <button id="play-button" className="btn btn-primary" onClick={this.handlePlayClick}>
                {
                    this.state.isPlaying ?
                        <span><i className="glyphicon glyphicon-pause" /> Pause</span> :
                        <span><i className="glyphicon glyphicon-play-circle" /> Play</span>
                }
            </button>
        );
    }
}

