(function () {
  'use strict';
  angular
    .module('app')
    .factory('kodiService', kodiService);

    kodiService.$inject = ['$http','$q'];

    function kodiService($http, $q) {
      return {
        getDevices : getDevices,
        addDevice : addDevice,
        destroyDevice : destroyDevice,
        updateDevice : updateDevice,
        remoteDevice : remoteDevice,
        waitUpdate : waitUpdate
      };

      function request(method, url, data){
        var deferred = $q.defer();

        $http({method: method, url: '/Kodi' + url, data: data})
          .success(function(data, status, headers, config){
              deferred.resolve(data);
          })
          .error(function(data, status, headers, config){
            if(status === 400){
              deferred.reject(data);
            }
          });

        return deferred.promise;
       
      }

      function getDevices(){
        return request('GET', '/index', {});
      }

      function addDevice(device){
        return request('POST', '/add', device);
      }

      function destroyDevice(device){
        return request('POST', '/destroy', {id: device.id});
      }

      function updateDevice(device){
        return request('POST', '/update', device);
      }

      function remoteDevice(device, method){
        return request('POST', '/remote', {id: device.id, method: method});
      }

      function waitUpdate(fn){
        io.socket.on('kodi:update', fn);
      }
		}
})();