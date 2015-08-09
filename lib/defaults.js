'use strict';

/**
 * Module Configuration
 */


var param = require('./parametres.js');

module.exports.kodi = {
    
  // title for the Hook
  title: 'Kodi',
	// the name of the hook folder
  folderName: param.folderName,

  launcherTypes : [
    {
      code : 'kodi_play',
      name : 'Kodi play',
      description : "Fire when Kodi play a media",
      optionspath : '/Kodi/index',
      eventName : 'notification:play'
    },
    {
      code : 'kodi_pause',
      name : 'Kodi pause',
      description : "Fire when kodi pause a media",
      optionspath : '/Kodi/index',
      eventName : 'notification:pause'
    },
    {
      code : 'kodi_stop',
      name : 'Kodi stop',
      description : "Fire when kodi stop",
      optionspath : '/Kodi/index',
      eventName : 'api:playerStopped'
    }
  ],

  actionTypes : [
    {
      serviceName: 'KodiService',
      functionName: 'playMusic',
      name: 'Play music to Kodi',
      description: 'Play a music to kodi, set the parameter to JSON format [deviceId, musicName]',
      optionspath: ''
    }
  ]

};
