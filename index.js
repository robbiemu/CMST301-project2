const babelRegister = require('babel-register');

require('babel-polyfill');

babelRegister();

const index = require('./server.js')