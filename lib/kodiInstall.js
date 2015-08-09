
var Kodi = require('./kodi');

function installLauncherType(launcher, callback){
 	LauncherType.find({code: launcher.code})
		.exec(function(err, launchers){
			if(err) return callback(err);

			if(launchers.length === 0){
				return LauncherType.create(launcher, callback);
			}
			callback(null);
		});
}

function installActionType(action, callback){
 	ActionType.find(action)
		.exec(function(err, actions){
			if(err) return callback(err);

			if(actions.length === 0){
				return ActionType.create(action, callback);
			}
			callback(null);
		});
}

module.exports = {

	/**
	 * Install the launcherType to Gladys database when sails is ready
	 * @method launcherType
	 * @param {} callback
	 */
	launcherType : function(callback){
		callback = callback || function(){};

		var nb_launcher = sails.config.kodi.launcherTypes.length;
		var nb_error = 0;

		var callbackInstall = function(err){
			if(err)nb_error++;

			nb_launcher--;
			if(nb_launcher === 0){
				if(nb_error > 0)return callback(nb_error +' errors');
				return callback(null);
			}
		};

		for(var i = 0; i < sails.config.kodi.launcherTypes.length; i++){
			var launcher = sails.config.kodi.launcherTypes[i];
			installLauncherType(launcher, callbackInstall);
		}
	},

	/**
	 * Install the actionType to Gladys database when sails is ready
	 * @method actionType
	 * @param {} callback
	 */
	actionType : function(callback){
		callback = callback || function(){};

		var nb_actions = sails.config.kodi.actionTypes.length;
		var nb_error = 0;

		var callbackInstall = function(err){
			if(err)nb_error++;

			nb_actions--;
			if(nb_actions === 0){
				if(nb_error > 0)return callback(nb_error +' errors');
				return callback(null);
			}
		};

		for(var i = 0; i < sails.config.kodi.actionTypes.length; i++){
			var action = sails.config.kodi.actionTypes[i];
			installActionType(action, callbackInstall);
		}
	},

	/**
	 * Initialise the events of all devices when sails is ready
	 * @method event
	 * @param {} callback
	 */
	event : function(callback){
		callback = callback || function(){};

		KodiDevice.find()
			.exec(function(err, devices){
				if(err) return callback(err);

				var nb_device = devices.length;
				var nb_error = 0;

				var callbackInstall = function(err){
					if(err)nb_error++;

					nb_device--;
					if(nb_device === 0){
						if(nb_error > 0)return callback(nb_error +' errors');
						return callback(null);
					}
				};

				for(var i = 0; i < devices.length; i++){
					Kodi.event(devices[i], callbackInstall);
				}
			});
	}

};