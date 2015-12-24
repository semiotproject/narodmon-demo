import React from 'react';
import { render } from 'react-dom';
import App from './components/app.react';

// string formatting god, follow him!
String.prototype.format = function() {
    const pattern = /\{\d+\}/g;
    const args = arguments;
    return this.replace(pattern, function(capture) { return args[capture.match(/\d+/)]; });
};

render(
    <App />,
    document.getElementById('main-wrapper')
);


