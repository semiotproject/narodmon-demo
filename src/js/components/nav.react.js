import React from 'react';
import AppStateStore from '../stores/app-state-store';
import CONFIG from '../config';

export default class Nav extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = this.getState();

        this.handleAppStateUpdate = () => {
            this.setState(this.getState());
        };
        this.handleModeSelected = (mode) => {
            AppStateStore.mode = mode;
        };
    }

    getState() {
        return {
            mode: AppStateStore.mode
        };
    }

    componentDidMount() {
        AppStateStore.on('update', this.handleAppStateUpdate);
    }
    componentWillUnmount() {
        AppStateStore.off('update', this.handleAppStateUpdate);
    }

    render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="navbar-collapse collapse">
                    <a href="" className="navbar-brand">Unequal Temperature Changes (Demo)</a>
                    <ul className="navbar-nav nav">
                        <li
                            className={this.state.mode === CONFIG.MODES.diff ? "active" : ""}
                            onClick={this.handleModeSelected.bind(this, CONFIG.MODES.diff)}
                        >
                            <a>Difference</a>
                        </li>
                        <li
                            className={this.state.mode === CONFIG.MODES.temp ? "active" : ""}
                            onClick={this.handleModeSelected.bind(this, CONFIG.MODES.temp)}
                        >
                            <a>Temperature</a>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

