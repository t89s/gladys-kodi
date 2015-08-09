'use strict';

/**
 * Kodi service
 * @doc http://sailsjs.org/documentation/concepts/services
 */

var Kodi = require('../lib/kodi');
var hostname = require("os").hostname();
var port = sails.config.proxyPort || sails.config.port;

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

			Kodi.api(device, function(err, api){
				if(err) return callback(err);

				api.remote(method, callback);
			});		
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

			Kodi.api(device, function(err, api){
				if(err) return callback(err);

				api.openFile(file, callback);
			});
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

		var urlMusic = "http://"+ hostname +':'+ port +'/kodi/music/'+ musicName;
		KodiService.playFile(deviceId, urlMusic, callback);
	}

};
