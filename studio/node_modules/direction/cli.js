#!/usr/bin/env node
'use strict'

var pack = require('./package.json')
var direction = require('.')

var argv = process.argv.slice(2)

if (argv.indexOf('--help') !== -1 || argv.indexOf('-h') !== -1) {
  console.log(help())
} else if (argv.indexOf('--version') !== -1 || argv.indexOf('-v') !== -1) {
  console.log(pack.version)
} else if (argv.length === 0) {
  process.stdin.resume()
  process.stdin.setEncoding('utf8')
  process.stdin.on('data', function(data) {
    console.log(direction(data))
  })
} else {
  console.log(direction(argv.join(' ')))
}

function help() {
  return [
    '',
    '  Usage: ' + pack.name + ' [options] <words...>',
    '',
    '  ' + pack.description,
    '',
    '  Options:',
    '',
    '    -h, --help           output usage information',
    '    -v, --version        output version number',
    '',
    '  Usage:',
    '',
    '  # output directionality',
    '  $ ' + pack.name + ' @',
    '  # ' + direction('@'),
    '',
    '  # output directionality from stdin',
    "  $ echo 'الانجليزية' | " + pack.name,
    '  # ' + direction('الانجليزية'),
    ''
  ].join('\n')
}
