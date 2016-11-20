const Promise = require('bluebird');
const connect = require('./connect');

module.exports = function(){

  // Get devices saved by user
  return gladys.param.getValue('kodi_devices')

    // Then connect each device
    .then((value) => Promise.map(value.split(','), connect));

};