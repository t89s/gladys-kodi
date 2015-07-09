
var Xbmc = require('xbmc');
var connected_devices = {};

function connection_api(config){
	var connection = new Xbmc.TCPConnection(config);
	var xbmcApi = new Xbmc.XbmcApi({silent: false, connection: connection});
	return xbmcApi;
}

function connect_device(device, callback){
	if(!connected_devices[device.host]){
		connected_devices[device.host] = connection_api({
			host : device.host,
			port : device.port,
			verbose: true
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
					device_api.input.ExecuteAction(method, callback);
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