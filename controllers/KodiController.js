
var Kodi = require('../lib/kodi');

var haveRights = function(userId, deviceId, callback){
	KodiDevice.findOne({user: userId, id: deviceId}, callback);
}

var connectionStatus = function(err, device, callback){
	if(err == 'disconnected' && device.connected != 0){
		return KodiDevice.update({id: device.id}, {connected: 0}, callback);
	}
	if(!err && device.connected != 1){
		return KodiDevice.update({id: device.id}, {connected: 1}, callback);
	}
	callback(err, device);
}

module.exports = {

	index : function(req, res, next){
		KodiService.index(req.session.User.id, function(err, value){
			if(err) return res.json(err);

			return res.json(value);
		});
	},

	remote : function(req, res, next){
		haveRights(req.session.User.id, req.param('id'), function(err, device){
			if(err) return res.json(err);

			KodiService.remote(device.id, req.param('method'), function(err, value){
				connectionStatus(err, device, function(err){
					if(err) return res.json(err);

					return res.json(value);
				});
			});
		});
	},

	update : function(req, res, next){
		var update = {
			name : req.param('name'),
			host : req.param('host'),
			port : req.param('port'),
			room : req.param('room'),
			connected : 1
		};

		haveRights(req.session.User.id, req.param('id'), function(err, device){
			if(err) return res.json(err);

			KodiDevice.update({id: device.id}, update, function(err, value){
				if(err) return res.json(err);

				KodiDevice.findOne({user: req.session.User.id, id: req.param('id')})
					.populate('user')
					.populate('room')
					.exec(function(err, value){
						if(err) return res.json(err);

						return res.json(value);
					});

			});
		});
	},


	destroy : function(req, res, next){
		haveRights(req.session.User.id, req.param('id'), function(err, device){
			if(err) return res.json(err);

			/* Delete all Launcher/state/action associate with this device */
			LauncherType.find({or: sails.config.kodi.launcherTypes}, function(err, launchersTypes){
				if(err) return res.json(err);

				var find_launchers = [];
				for(var i = 0; i < launchersTypes.length; i++){
					find_launchers.push({launcher: launchersTypes[i].id, parametre: device.id});
				}

				Launcher.destroy({or: find_launchers}, function(err, launchers){
					if(err) return callback(err);

					var find = [];
					for(var i = 0; i < launchers.length; i++){
						find.push({launcher: launchers[i].id});
					}

					Action.destroy({or: find}, function(err, actions){
						if(err) return callback(err);

						State.destroy({or: find}, function(err, state){
							if(err) return res.json(err);

							KodiDevice.destroy({id: device.id}, function(err, value){
								if(err) return res.json(err);

								return res.json(value);
							});
						});
					});
				});
			});
		});
	},

	add : function(req, res, next){
		var device = {
			name : req.param('name'),
			host : req.param('host'),
			port : req.param('port'),
			user : req.session.User.id,
			room : req.param('room')
		};

		KodiDevice.create(device, function(err, value){
			if(err) return res.json(err);

			KodiDevice.findOne({user: req.session.User.id, id: value.id})
				.populate('user')
				.populate('room')
				.exec(function(err, value){
					if(err) return res.json(err);

					Kodi.event(value, function(err){
						connectionStatus(err, value, function(err){
							if(err) return res.json(err);

							return res.json(value);
						});
					});

				});

		});
	}

};