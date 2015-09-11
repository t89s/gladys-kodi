/**
 * Routes rules
 * @doc http://sailsjs.org/documentation/concepts/routes
 */

module.exports.routes = {
  '/kodi/index': 'KodiController.index',
  '/kodi/add': 'KodiController.add',
  '/kodi/remote': 'KodiController.remote',
  '/kodi/destroy': 'KodiController.destroy',
  '/kodi/update': 'KodiController.update'
};