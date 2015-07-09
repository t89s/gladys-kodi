'use strict';

var Kodi = require('../lib/kodi');

module.exports = {

	index : function(userId, callback){
		callback = callback || function(){};

		KodiDevice.find({user : userId})
			.populate('user')
			.populate('room')
			.exec(callback);
	},

	remote : function(deviceId, method, callback){
		callback = callback || function(){};

		KodiDevice.findOne({id: deviceId}).exec(function(err, device){
			if(err) return callback(err);

			Kodi.api(device, function(err, api){
				api.remote(method, callback);
			});		
		});
	}

};
