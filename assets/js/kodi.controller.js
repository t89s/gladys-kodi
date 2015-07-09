(function () {
  'use strict';

  angular
    .module('app')
    .controller('kodiController', kodiController);

  kodiController.$inject = ['kodiService','roomService'];

  function kodiController(kodiService, roomService){
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

		/* Template config */
		vm.view = 'remote';
		vm.settings_view = 'devices';

		/* Form */
		vm.new_device = {};
		vm.device = {};

		activate();

		function activate() {
			getDevices();
			getRooms();
		}

		function getDevices(){   			
			return kodiService.getDevices()
				.then(function(data){
					vm.devices = data.data;
				});
		}

		function getRooms() {
      return roomService.getRooms()
        .then(function(data){
          vm.rooms = data.data;
        });
    }

		function remoteDevice(id, method){
			return kodiService.remoteDevice(id, method);
		}

		function destroyDevice(id){
			return kodiService.destroyDevice(id).
				then(function(data){
					if(data.data[0].id){
						var i = indexDeviceById(data.data[0].id);
						vm.devices.splice(i, 1);
					}
				});
		}

		function updateDevice(){
			return kodiService.updateDevice(vm.device).
				then(function(data){
					if(data.data.id){
						var i = indexDeviceById(data.data.id);
						vm.devices[i] = data.data;
						vm.device = {};
						vm.settings_view = 'devices';
					}
				});
		}

    function addDevice(){
			return kodiService.addDevice(vm.new_device).
				then(function(data){
					if(data.data.id){
						vm.devices.push(data.data);
						vm.new_device = {};
						vm.settings_view = 'devices';
					}
				});
		}

		function viewEdit(device){
			vm.device = angular.copy(device);
			vm.device.user = device.user.id;
			vm.device.room = device.room.id;
			vm.settings_view = 'device';
		}

		function indexDeviceById(id){
			for(var i = 0; i < vm.devices.length; i++){
				if(vm.devices[i].id == id){
					return i;
				}
			}
			return -1;
		}

  }
})();