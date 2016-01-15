import React from 'react';
import AppStateStore from '../stores/app-state-store';
import CONFIG from '../config';

const MODE_DESCRIPTION = {
    [CONFIG.MODES.diff]: (
        <div>
            <h4>Difference mode</h4>
            <p>This is difference mode description. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt quod dignissimos perspiciatis, eum eligendi iusto iste quisquam obcaecati doloremque sequi saepe minus deleniti repudiandae quaerat culpa doloribus rem minima. Dolores?</p>
        </div>
    ),
    [CONFIG.MODES.temp]: (
        <div>
            <h4>Temperature mode</h4>
            <p>This is temperature mode description. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia quo ipsum odio cum sit fuga magni vero dolorem tempore voluptatum aut perspiciatis ab sint aperiam est unde sequi assumenda, beatae.</p>
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

