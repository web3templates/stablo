'use strict';

var fs = require('fs');

fs.readdirSync(__dirname).forEach(function(name) {
    if (name.match(/\.test\.js$/)) {
        require(__dirname + '/' + name);
    }
});