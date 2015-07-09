
var KodiInstall = require('./lib/kodiInstall');

module.exports = function (sails) {

  sails.config.Event.on('sailsReady', function(){

    KodiInstall.launcherType(function(err){
      if(err)return sails.log.error('Install Kodi launcherType failed', err);
      sails.log.info('Install Kodi launcherType OK');
    });
    
    KodiInstall.event(function(err){
      if(err)return sails.log.error('Install Kodi event failed', err);
      sails.log.info('Install Kodi event OK');
    });

  });  

   
  var loader = require("sails-util-mvcsloader")(sails);
  loader.injectAll({
    policies: __dirname + '/policies',// Path to your hook's policies
    config: __dirname + '/config'// Path to your hook's config
  });

    
  return {
    defaults: require('./lib/defaults'),
    configure: require('./lib/configure')(sails),
    initialize: require('./lib/initialize')(sails),
    routes: require('./lib/routes')(sails),
  };


};