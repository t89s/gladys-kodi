var Xbmc = require('xbmc');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Promise = require('bluebird');

var apiDevice = require('./apiDevice');
var apiDevices = {};

var Kodi = function(){};

util.inherits(Kodi, EventEmitter);

Kodi.prototype.device = function(device){
  var self = this;
  return new Promise(function (resolve, reject) {
    var api = apiDevices[device.host];
    if(api)return resolve(api);

    self._connect(device, function(err, api){
      if(err)return reject(err);

      resolve(api);
    });
  });
};


Kodi.prototype._connect = function(device, callback){
  var self = this;
  var config = {
    host : device.host,
    port : device.port,
    verbose: true,
    connectNow : false
  };
  var connection = new Xbmc.TCPConnection(config);

  connection.parser.onerror = function(){};

  connection.onOpen = function(){
    var xbmcApi = new Xbmc.XbmcApi();
    xbmcApi = new Promise.promisifyAll(xbmcApi);
    xbmcApi.setConnection(connection);
    var api = new apiDevice(xbmcApi, device);
    api = new Promise.promisifyAll(api);
    apiDevices[device.host] = api;
    self.emit('connected', device);
    callback(null, api);
  };

  connection.onError = function(){
    self.emit('disconnected', device);
    callback('disconnected');
  };

  connection.create();
};

module.exports = new Kodi();