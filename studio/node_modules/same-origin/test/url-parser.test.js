'use strict';

var test = require('tape');
var parser = require('../url-parser');
var prefix = 'url-parser: ';

function runTest(url, expected) {
    test(prefix + expected.testName, function(t) {
        var parsed = parser.parse(url);

        t.equal(parsed.protocol, expected.protocol);
        t.equal(parsed.hostname, expected.hostname);
        t.equal(parsed.port, expected.port);
        t.end();
    });
}

var tests = {
    'http://www.example.com/dir/page.html': {
        testName: 'simple url',

        protocol: 'http:',
        hostname: 'www.example.com',
        port: undefined
    },

    'http://www.example.com:8080/dir/page.html': {
        testName: 'port number',

        protocol: 'http:',
        hostname: 'www.example.com',
        port: '8080'
    },

    '//www.example.com/dir/page.html': {
        testName: 'protocol-less',

        protocol: undefined,
        hostname: 'www.example.com',
        port: undefined
    },

    'https://example.com/dir/page.html': {
        testName: 'https',

        protocol: 'https:',
        hostname: 'example.com',
        port: undefined
    },

    'http://user:pass@espen.codes': {
        testName: 'credentials',

        protocol: 'http:',
        hostname: 'espen.codes',
        port: undefined
    },

    'https://espen:password@espen.codes:1337/some/path?q=imbo&type=wat#result-page': {
        testName: 'all url parts',

        protocol: 'https:',
        hostname: 'espen.codes',
        port: '1337'
    },

    '/relative/url': {
        testName: 'relative urls',

        protocol: undefined,
        hostname: undefined,
        port: undefined
    }
};

var url;
for (url in tests) {
    runTest(url, tests[url]);
}