'use strict';

var test = require('tape');
var sameOrigin = require('../');
var prefix = require('../package.json').name + ': ';

var origin = 'http://www.example.com/dir/page.html';

test(prefix + 'exact same url', function(t) {
    t.ok(sameOrigin(origin, origin), 'same url, same origin');
    t.end();
});

test(prefix + 'different filename', function(t) {
    t.ok(sameOrigin(origin, 'http://www.example.com/dir/page2.html'), 'same origin, different filename');
    t.end();
});

test(prefix + 'different path', function(t) {
    t.ok(sameOrigin(origin, 'http://www.example.com/dir2/other.html'), 'same origin, different path');
    t.end();
});

test(prefix + 'user/pass added', function(t) {
    t.ok(sameOrigin(origin, 'http://username:password@www.example.com/dir2/other.html'), 'same origin, user/pass');
    t.end();
});

test(prefix + 'different port', function(t) {
    t.notOk(sameOrigin(origin, 'http://www.example.com:81/dir/other.html'), 'same hostname, different port');
    t.end();
});

test(prefix + 'different port number - ie mode', function(t) {
    t.ok(sameOrigin(origin, 'http://www.example.com:81/dir/other.html', true), 'same hostname, different port, ie');
    t.end();
});

test(prefix + 'different protocol', function(t) {
    t.notOk(sameOrigin(origin, 'https://www.example.com/dir/page.html'), 'same hostname, different protocol');
    t.end();
});

test(prefix + 'different subdomain', function(t) {
    t.notOk(sameOrigin(origin, 'http://en.example.com/dir/page.html'), 'different subdomain');
    t.end();
});

test(prefix + 'different subdomain v2', function(t) {
    t.notOk(sameOrigin(origin, 'http://v2.www.example.com/dir/page.html'), 'different subdomain v2');
    t.end();
});

test(prefix + 'different subdomain v3', function(t) {
    t.notOk(sameOrigin(origin, 'http://www.v3.example.com/dir/page.html'), 'different subdomain v3');
    t.end();
});

test(prefix + 'no subdomain', function(t) {
    t.notOk(sameOrigin(origin, 'http://example.com/dir/page.html'), 'no subdomain');
    t.end();
});

test(prefix + 'explicit (but same) port number', function(t) {
    t.ok(sameOrigin(origin, 'http://www.example.com:80/dir/page.html'), 'explicit (but same) port number');
    t.end();
});

test(prefix + 'no protocol specified, same hostname', function(t) {
    var origin = '//www.example.com/dir/page.html',
        target = '//www.example.com/dir/other.html';

    t.ok(sameOrigin(origin, target), 'no protocol, same hostname');
    t.end();
});

test(prefix + 'no protocol specified, different hostname', function(t) {
    var origin = '//www.example.com/dir/page.html',
        target = '//imbo.io/users/rexxars/images.json';

    t.notOk(sameOrigin(origin, target), 'no protocol, different hostname');
    t.end();
});

test(prefix + 'one relative (no protocol or hostname), one absolute url', function(t) {
    var origin = 'http://www.example.com/dir/page.html',
        target = '/dir/otherpage.json';

    t.notOk(sameOrigin(origin, target), 'unknown protocol/host for url');
    t.end();
});

test(prefix + 'relative (no protocol or hostname) urls', function(t) {
    var origin = '/dir/page.html',
        target = '/dir/otherpage.html';

    t.ok(sameOrigin(origin, target), 'both relative urls');
    t.end();
});