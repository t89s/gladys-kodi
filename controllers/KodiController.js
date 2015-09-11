/**
 * Controller
 * @doc http://sailsjs.org/documentation/concepts/controllers
 */

var Kodi = require('../lib/kodi');

/**
 * Check if the user have rights for the device
 * @method haveRights
 * @param userId
 * @param deviceId
 * @param callback
 */
var haveRights = function(userId, deviceId, callback){
	KodiDevice.findOne({user: userId, id: deviceId}, function(err, device){
		if(err || !device)return callback('not allowed');
		callback(null, device);
	});
}

module.exports = {


	/**
	 * Get all devices
	 * @method index
	 * @param req
	 * @param res
	 * @param next
	 */
	index : function(req, res, next){
		KodiService.index(req.session.User.id, function(err, value){
			if(err) return res.json(400, err);

			return res.json(value);
		});
	},

	/**
	 * Remote action on device
	 * @method remote
	 * @param req
	 * @param res
	 * @param next
	 */
	remote : function(req, res, next){
		haveRights(req.session.User.id, req.param('id'), function(err, device){
			if(err) return res.json(400, err);

			KodiService.remote(device.id, req.param('method'), function(err, value){
				if(err) return res.json(400, err);

				return res.json(value);
			});
		});
	},

	/**
	 * Update a device
	 * @method update
	 * @param req
	 * @param res
	 * @param next
	 */
	update : function(req, res, next){
		var update = {
			name : req.param('name'),
			host : req.param('host'),
			port : req.param('port'),
			room : req.param('room'),
			connected : 1
		};

		haveRights(req.session.User.id, req.param('id'), function(err, device){
			if(err) return res.json(400, err);

			KodiDevice.update({id: device.id}, update, function(err, value){
				if(err) return res.json(400, err);

				KodiDevice.findOne({user: req.session.User.id, id: req.param('id')})
					.populate('user')
					.populate('room')
					.exec(function(err, value){
						if(err) return res.json(400, err);

						return res.json(value);

						Kodi.device(value)
							.then(function(){})
							.catch(function(){});
					});

			});
		});
	},

	/**
	 * Destroy a device
	 * @method index
	 * @param req
	 * @param res
	 * @param next
	 */
	destroy : function(req, res, next){
		haveRights(req.session.User.id, req.param('id'), function(err, device){
			if(err) return res.json(400, err);

			/* Delete all Launcher/state/action associate with this device */
			LauncherType.find({or: sails.config.kodi.launcherTypes}, function(err, launchersTypes){
				if(err) return res.json(400, err);

				var find_launchers = [];
				for(var i = 0; i < launchersTypes.length; i++){
					find_launchers.push({launcher: launchersTypes[i].id, parametre: device.id});
				}

				Launcher.destroy({or: find_launchers}, function(err, launchers){
					if(err) return res.json(400, err);

					var find = [];
					for(var i = 0; i < launchers.length; i++){
						find.push({launcher: launchers[i].id});
					}

					Action.destroy({or: find}, function(err, actions){
						if(err) return res.json(400, err);

						State.destroy({or: find}, function(err, state){
							if(err) return res.json(400, err);

							KodiDevice.destroy({id: device.id}, function(err, value){
								if(err) return res.json(400, err);

								return res.json(value);
							});
						});
					});
				});
			});
		});
	},

	/**
	 * Add a devices
	 * @method index
	 * @param req
	 * @param res
	 * @param next
	 */
	add : function(req, res, next){
		var device = {
			name : req.param('name'),
			host : req.param('host'),
			port : req.param('port'),
			user : req.session.User.id,
			room : req.param('room')
		};

		KodiDevice.create(device, function(err, value){
			if(err) return res.json(400, err);

			KodiDevice.findOne({user: req.session.User.id, id: value.id})
				.populate('user')
				.populate('room')
				.exec(function(err, value){
					if(err) return res.json(400, err);

					res.json(value);

					Kodi.device(value)
							.then(function(){})
							.catch(function(){});
				});

		});
	}

};