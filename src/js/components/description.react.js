import React from 'react';
import AppStateStore from '../stores/app-state-store';
import CONFIG from '../config';

const MODE_DESCRIPTION = {
    [CONFIG.MODES.diff]: (
        <div>
            <h4>Difference mode</h4>
            <p>Thinking of a city generally, it is often desirable to observe some parameters in dynamics; for example, in case of big cities, in what areas does the parameter changes faster than in other? Such derivative of the parameter is demonstrated in this work by constructing the map of air temperature changed, indicating, in which area temperature changed the most from the analyzed average difference for captured temperature snapshot</p>
        </div>
    ),
    [CONFIG.MODES.temp]: (
        <div>
            <h4>Temperature mode</h4>
            <p>Assuming we have a snapshot of temperature, we might want to identify the relative difference of each area temperature from the current average. Constructing the map of "relativelly colder" and "relativelly warmer" and "time-travelling" view of previous snapshots may be helpful to create understanding of particular city areas' temperature so-called "microtrends"</p>
        </div>
    )
};

export default class Legend extends React.Component {

    constructor(props) {
        super(props);
        this.handleAppStateUpdate = () => {
            this.forceUpdate();
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
            <div id="description">
                {MODE_DESCRIPTION[AppStateStore.mode]}
            </div>
        );
    }
}

