var React = require('react');
var render = require('react-dom').render;

var Inspector = require('..');
var InteractiveSelection = require('./interactive-selection');

var h = React.createElement;
var data = require('./data.json');

document.addEventListener('DOMContentLoaded', function() {
    render(
        h(Inspector, {
            data: data,
            onClick: console.log.bind(console),
            interactiveLabel: InteractiveSelection
        }),
        document.getElementById('inspector')
    );
});
