(function () {
  'use strict';

  angular
    .module('app')
    .controller('kodiController', kodiController);

  kodiController.$inject = ['kodiService','roomService', '$timeout'];

  function kodiController(kodiService, roomService, $timeout){
		/* jshint validthis: true */
		var vm = this;

		/* Method */
		vm.addDevice = addDevice;
		vm.destroyDevice = destroyDevice;
		vm.remoteDevice = remoteDevice;
		vm.updateDevice = updateDevice;
		vm.viewEdit = viewEdit;

		/* Infos */
		vm.devices = [];
		vm.rooms = [];
		vm.deviceRemote = {};
		vm.error = {};

		/* Template config */
		vm.view = 'remote';
		vm.modal = false;

		/* Form */
		vm.new_device = {};
		vm.device = {};
		var device = {};

		activate();

		function activate() {
			getDevices();
			getRooms();
			waitUpdate();
		}

		function getDevices(){
			return kodiService.getDevices()
				.then(function(devices){
					vm.devices = devices;
				});
		}

		function getRooms() {
      return roomService.getRooms()
        .then(function(data){
          vm.rooms = data.data;
        });
    }

    function waitUpdate(){
			kodiService.waitUpdate(function(data){
				$timeout(function(){
					for(var i = 0; i < vm.devices.length; i++){
						if(vm.devices[i].id == data.id){
							vm.devices[i] = data;
							break;
						}
					}
				});
			});
    }

		function remoteDevice(method){
			return kodiService.remoteDevice(vm.deviceRemote, method);
		}

		function destroyDevice(device){
			setError('destroyDevice', false);

			return kodiService.destroyDevice(device)
				.then(function(){
					vm.devices.splice(vm.devices.indexOf(device), 1);
				})
				.catch(setError.bind(null, 'destroyDevice'));
		}

		function updateDevice(){
			setError('updateDevice', false);

			return kodiService.updateDevice(vm.device)
				.then(function(data){
						vm.devices.splice(vm.devices.indexOf(device), 1, data);
						vm.modal = false;
				})
				.catch(setError.bind(null, 'updateDevice'));
		}

    function addDevice(){
			setError('addDevice', false);

			return kodiService.addDevice(vm.new_device)
				.then(function(data){
					vm.devices.push(data);
					vm.new_device = {};
					vm.modal = false;
				})
				.catch(setError.bind(null, 'addDevice'));
		}

		function viewEdit(deviceObj){
			device = deviceObj;
			vm.device = angular.copy(deviceObj);
			vm.device.user = device.user.id;
			vm.device.room = device.room.id;
			vm.modal = 'edit';
		}

		function setError(key, err){
			vm.error[key] = err;
		}
  }
})();