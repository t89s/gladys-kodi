
var Kodi = require('./kodi');

function installLauncherType(launcher, callback){
 	LauncherType.find({code: launcher.code})
		.exec(function(err, launchers){
			if(err) return callback(err);

			if(launchers.length == 0){
				return LauncherType.create(launcher, callback);
			}
			callback(null);
		});
}

module.exports = {

	launcherType : function(callback){
		callback = callback || function(){};

		var nb_launcher = sails.config.kodi.launcherTypes.length;
		var nb_error = 0;

		for(var i = 0; i < sails.config.kodi.launcherTypes.length; i++){
			var launcher = sails.config.kodi.launcherTypes[i];
			installLauncherType(launcher, function(err){
				if(err)nb_error++;

				nb_launcher--;
				if(nb_launcher == 0){
					if(nb_error > 0)return callback(nb_error +' errors');
					return callback(null);
				}
			});
		}
	},

	event : function(callback){
		callback = callback || function(){};

		KodiDevice.find()
			.exec(function(err, devices){
				if(err) return callback(err);

				var nb_device = devices.length;
				var nb_error = 0;

				for(var i = 0; i < devices.length; i++){
					Kodi.event(devices[i], function(err){
						if(err)nb_error++;

						nb_device--;
						if(nb_device == 0){
							if(nb_error > 0)return callback(nb_error +' errors');
							return callback(null);
						}
					});
				}
			});
	}

};