(function () {
  'use strict';
  angular
    .module('app')
    .factory('kodiService', kodiService);

    kodiService.$inject = ['$http'];

    function kodiService($http) {
    	return {
    		getDevices : getDevices,
    		addDevice : addDevice,
        destroyDevice : destroyDevice,
    		updateDevice : updateDevice,
 				remoteDevice : remoteDevice,
    	};

      function error(data, status, headers, config){
        console.log(data, status, headers, config);
      }

      function request(method, url, data){
        return $http({method: method, url: '/Kodi' + url, data: data }).
          success(function(data, status, headers, config) {
              return data;
          }).error(error);
      }

    	function getDevices(){
  	 		return request('GET', '/index', {});
      }

  		function addDevice(device){
        return request('POST', '/add', device);
      }

      function destroyDevice(id){
        return request('POST', '/destroy', {id: id});
      }

      function updateDevice(device){
        return request('POST', '/update', device);
      }

      function remoteDevice(id, method){
        return request('POST', '/remote', {id: id, method: method});
      }
		}
})();