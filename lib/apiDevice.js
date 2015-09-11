var SUCCESS = 'OK';

var apiDevice = function(api, device){
  this.api = api;
  this.device = device;
};

apiDevice.prototype.send = function(method, params, callback){
  this.api.send(method, params, function(rslt){
    if(rslt.result != SUCCESS)return callback(rslt);

    callback(null, rslt);
  });
};

apiDevice.prototype.remote = function(method, callback){
  this.api.input.ExecuteAction(method, function(rslt){
    if(rslt.result != SUCCESS)return callback(rslt);

    callback(null, rslt);
  });
};

apiDevice.prototype.openFile = function(file, callback){
  this.api.player.open({file: file}, null, function(rslt){
    if(rslt.result != SUCCESS)return callback(rslt);

    callback(null, rslt);
  });
};

module.exports = apiDevice;