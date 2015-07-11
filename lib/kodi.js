
var Xbmc = require('xbmc');
var connected_devices = {};

function connection_api(config, callback){
	var connection = new Xbmc.TCPConnection(config);
	connection.parser.onerror = function(){};
	connection.onOpen = function(){
		var xbmcApi = new Xbmc.XbmcApi;
		xbmcApi.setConnection(connection);
		callback(null, xbmcApi);
	};
	connection.onError = function(){
	  callback('disconnected');
	};
	connection.create();
}

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

module.exports = {

	api : function(device, callback){
		callback = callback || function(){};

		connect_device(device, function(err, device_api){
			if(err) return callback(err);

			callback(null, {
				remote : function(method, callback){
					device_api.input.ExecuteAction(method, function(rslt){
						if(rslt.result != 'OK')return callback(rslt);

						callback(null, rslt);
					});
				}
			})
		});
	},

	event : function(device, callback){
		callback = callback || function(){};

		connect_device(device, function(err, device_api){
			if(err) return callback(err);

			device_api.on('notification:play', function(){
				ScenarioService.launcher('kodi_play', device.id);
			});

			device_api.on('notification:pause', function(){
				ScenarioService.launcher('kodi_pause', device.id);
			});

			callback(null);

		});
	}

};