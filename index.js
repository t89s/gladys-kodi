
var KodiInstall = require('./lib/kodiInstall');

module.exports = function (sails) {

  sails.config.Event.on('sailsReady', function(){

    KodiInstall.actionType(function(err){
      if(err)return sails.log.error('Kodi : Install actionType failed :', err);
      sails.log.info('Kodi : Install actionType OK');
    });

    KodiInstall.launcherType(function(err){
      if(err)return sails.log.error('Kodi : Install launcherType failed :', err);
      sails.log.info('Kodi : Install launcherType OK');
    });
    
    KodiInstall.event(function(err){
      if(err)return sails.log.error('Kodi : Install event failed :', err);
      sails.log.info('Kodi : Install event OK');
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