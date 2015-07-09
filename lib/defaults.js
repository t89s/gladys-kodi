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
      optionspath : '/Kodi/index'
    },
    {
      code : 'kodi_pause',
      name : 'Kodi pause',
      description : "Fire when kodi pause a media",
      optionspath : '/Kodi/index'
    }
  ]

};