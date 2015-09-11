'use strict';

/**
 * Kodi service
 * @doc http://sailsjs.org/documentation/concepts/services
 */

var Kodi = require('../lib/kodi');
var hostname = require("os").hostname();
var port = sails.config.proxyPort || sails.config.port;

var emitClientUpdate = function(deviceId){
	KodiDevice.find({id: deviceId})
		.populate('user')
		.populate('room')
		.exec(function(err, devices){
			var device = devices[0];

			SocketService.sendDesktopMessageUser(device.user.id, 'kodi:update', device, function(){});
		});
};

Kodi.on('connected', function(device){
	sails.log.info('Kodi : Device connected :', device.host);

	Kodi.device(device)
		.then(function(api){
			sails.config.kodi.eventLauncherTypes.forEach(function(eventLauncherType){
				api.api.on(eventLauncherType.name, function(){
					ScenarioService.launcher(eventLauncherType.code, device.id);
				});
			});
		});
	
	KodiDevice.update({id: device.id}, {connected: 1}, function(){
		emitClientUpdate(device.id);
	});

});

Kodi.on('disconnected', function(device){
	sails.log.warn('Kodi : Device disconnected :', device.host);

	KodiDevice.update({id: device.id}, {connected: 0}, function(err, value){
		emitClientUpdate(device.id);
	});
});


module.exports = {

	/**
	 * Get all device of user
	 * @method index
	 * @param {} userId
	 * @param {} callback
	 */
	index : function(userId, callback){
		callback = callback || function(){};

		KodiDevice.find({user : userId})
			.populate('user')
			.populate('room')
			.exec(callback);
	},

	/**
	 * Remote a device
	 * @method remote
	 * @param {} deviceId
	 * @param {} method
	 * @param {} callback
	 */
	remote : function(deviceId, method, callback){
		callback = callback || function(){};

		KodiDevice.findOne({id: deviceId}).exec(function(err, device){
			if(err) return callback(err);

			Kodi.device(device)
				.then(function(api){
					return api.remoteAsync(method);
				})
				.then(function(){
					callback();
				})
				.catch(callback);
		});
	},

	/**
	 * @method playFile
	 * @param {} deviceId
	 * @param {} file
	 * @param {} callback
	 */
	playFile : function(deviceId, file, callback){
		callback = callback || function(){};

		KodiDevice.findOne({id: deviceId}).exec(function(err, device){
			if(err) return callback(err);

			Kodi.device(device)
				.then(function(api){
					return api.openFileAsync(file);
				})
				.then(function(){
					callback();
				})
				.catch(callback);
		});
	},

	/**
	 * Play a music to a device
	 * @method playMusic
	 * @param {} deviceId
	 * @param {} musicName
	 * @param {} callback
	 */
	playMusic : function(deviceId, musicName, callback){
		callback = callback || function(){};

		var urlMusic = 'http://'+ hostname +':'+ port +'/music/'+ musicName;
		KodiService.playFile(deviceId, urlMusic, callback);
	}

};
