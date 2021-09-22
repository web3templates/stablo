'use strict';

const Parser = require('./parser');
const AtWord = require('./atword');
const Colon = require('./colon');
const Comma = require('./comma');
const Comment = require('./comment');
const Func = require('./function');
const Num = require('./number');
const Operator = require('./operator');
const Paren = require('./paren');
const Str = require('./string');
const UnicodeRange = require('./unicode-range');
const Value = require('./value');
const Word = require('./word');

let parser = function (source, options) {
  return new Parser(source, options);
};

parser.atword = function (opts) {
  return new AtWord(opts);
};

parser.colon = function (opts) {
  opts.value = opts.value || ':';
  return new Colon(opts);
};

parser.comma = function (opts) {
  opts.value = opts.value || ',';
  return new Comma(opts);
};

parser.comment = function (opts) {
  return new Comment(opts);
};

parser.func = function (opts) {
  return new Func(opts);
};

parser.number = function (opts) {
  return new Num(opts);
};

parser.operator = function (opts) {
  return new Operator(opts);
};

parser.paren = function (opts) {
  opts.value = opts.value || '(';
  return new Paren(opts);
};

parser.string = function (opts) {
  opts.quote = opts.quote || '\'';
  return new Str(opts);
};

parser.value = function (opts) {
  return new Value(opts);
};

parser.word = function (opts) {
  return new Word(opts);
};

parser.unicodeRange = function (opts) {
  return new UnicodeRange(opts);
};

module.exports = parser;
