const Xbmc = require('xbmc');
var shared = require('./shared');
const Promise = require('bluebird');


module.exports = function(identifier){

  // Already connected
  if(typeof(shared.device[identifier]) !== 'undefined')
    return true;

  //var host, port;
  var identifiers = identifier.split(':');
  var host = identifiers[0];
  var port = identifiers[1];

  sails.log.info(`Kodi module : Try connecting to ${host}:${port}`);

  var connection = new Xbmc.TCPConnection({
    host : host,
    port : port,
    verbose: true,
    connectNow : false
  });

  connection.parser.onerror = function(){};

  connection.onOpen = function(){
    sails.log.info(`Kodi module : Successfully connected to ${host}:${port}`);

    var xbmcApi = new Xbmc.XbmcApi();
    xbmcApi = new Promise.promisifyAll(xbmcApi);
    xbmcApi.setConnection(connection);

    // Set event to update device state
    xbmcApi.on('notification:play', () => {
      sails.log.info(`Kodi module : Event play : ${host}:${port}`);
      gladys.deviceState.createByDeviceTypeIdentifier(`${identifier}-status`, 'kodi', {value: shared.status.play})
        .catch((err) => sails.log.warn(`Kodi Module : Fail to save deviceState : ${err}`));
    });

    xbmcApi.on('notification:pause', () => {
      sails.log.info(`Kodi module : Event pause : ${host}:${port}`);
      gladys.deviceState.createByDeviceTypeIdentifier(`${identifier}-status`, 'kodi', {value: shared.status.pause})
        .catch((err) => sails.log.warn(`Kodi Module : Fail to save deviceState : ${err}`));
    });

    xbmcApi.on('api:playerStopped', () => {
      sails.log.info(`Kodi module : Event stop : ${host}:${port}`);
      gladys.deviceState.createByDeviceTypeIdentifier(`${identifier}-status`, 'kodi', {value: shared.status.stop})
        .catch((err) => sails.log.warn(`Kodi Module : Fail to save deviceState : ${err}`));
    });

    xbmcApi.on('notification:resume', () => {
      sails.log.info(`Kodi module : Event resuuummmmeee : ${host}:${port}`);
      gladys.deviceState.createByDeviceTypeIdentifier(`${identifier}-status`, 'kodi', {value: shared.status.play})
        .catch((err) => sails.log.warn(`Kodi Module : Fail to save deviceState : ${err}`));
   });


    shared.device[identifier] = xbmcApi;

    var newDevice = {
      device: {
          name: `Kodi ${host}`,
          protocol: 'kodi',
          service: 'kodi',
          identifier: identifier
      },
      types: [
        {
          name:'Connected',
          type: 'binary',
          //tag: '',
          sensor: false,
          //unit: '',
          min: 0,
          max:1,
          display: false,
          identifier: `${identifier}-connected`
        },
        {
          name:'status',
          type: 'status',
          //tag: '',
          sensor: false,
          //unit: '',
          min: 0,
          max:2,
          display: false,
          identifier: `${identifier}-status`
        }
      ]
    };

    // Create the device
    gladys.device.create(newDevice)
      // Then set connected value
      .then(() => gladys.deviceState.createByDeviceTypeIdentifier(`${identifier}-connected`, 'kodi', {value: 1}))
      .catch((err) => sails.log.error(`Kodi module : Error while creating device : ${err}`));
  };

  connection.onError = function(){
    sails.log.info(`Kodi module : Connection error to ${host}:${port}`);
    gladys.deviceState.createByDeviceTypeIdentifier(`${identifier}-connected`, 'kodi', {value: 0})
      .catch(() => {});
  };

  connection.create();

  return true;

};
