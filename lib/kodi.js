
var Xbmc = require('xbmc');

var connected_devices = {};

/**
 * Try to connect to the device
 * @method connection_api
 * @param {} config
 * @param {} callback
 */
function connection_api(config, callback){
	var connection = new Xbmc.TCPConnection(config);
	connection.parser.onerror = function(){};
	connection.onOpen = function(){
		var xbmcApi = new Xbmc.XbmcApi();
		xbmcApi.setConnection(connection);
		callback(null, xbmcApi);
	};
	connection.onError = function(){
	  callback('disconnected');
	};
	connection.create();
}

/**
 * Get the device api
 * @method connect_device
 * @param {} device
 * @param {} callback
 */
function connect_device(device, callback){
	if(!connected_devices[device.host]){
		var config = {
			host : device.host,
			port : device.port,
			verbose: true,
			connectNow : false
		};
		return connection_api(config, function(err, api){
			if(err) return callback(err);

			connected_devices[device.host] = api;
			callback(null, connected_devices[device.host]);
		});
	}
	callback(null, connected_devices[device.host]);
}

/**
 * @method installEvent
 * @param {} device
 * @param {} deviceApi
 * @param {} launcherType
 */
function installEvent(device, deviceApi, launcherType){
	deviceApi.on(launcherType.eventName, function(){
		ScenarioService.launcher(launcherType.code, device.id);
	});
}

module.exports = {

	/**
	 * Get the api methods of device
	 * @method event
	 * @param {} device
	 * @param {} callback
	 */
	api : function(device, callback){
		callback = callback || function(){};

		connect_device(device, function(err, device_api){
			if(err) return callback(err);

			callback(null, {
				openFile : function(file, callback){
					device_api.player.open({file: file}, null, function(rslt){
						if(rslt.result != 'OK')return callback(rslt);

						callback(null, rslt);
					});
				},
				remote : function(method, callback){
					device_api.input.ExecuteAction(method, function(rslt){
						if(rslt.result != 'OK')return callback(rslt);

						callback(null, rslt);
					});
				}
			});
		});
	},

	/**
	 * Initialise the events of device
	 * @method event
	 * @param {} device
	 * @param {} callback
	 */
	event : function(device, callback){
		callback = callback || function(){};

		var launcherTypes = sails.config.kodi.launcherTypes;

		connect_device(device, function(err, device_api){
			if(err) return callback(err);

			for(var i = 0; i < launcherTypes.length; i++){
				installEvent(device, device_api, launcherTypes[i]);
			}

			callback(null);

		});
	}

};