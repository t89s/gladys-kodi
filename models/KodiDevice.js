'use strict';

module.exports = {
  attributes: {
  	name: {
  		type : 'string',
  		required : true,
      unique: true
  	},
  	host: {
  		type : 'string',
  		required : true,
      unique: true
  	},
  	port : {
  		type : 'integer',
      defaultsTo : 9090,
  	},
    user:{
      model: 'User',
      required:true
    },
  	room:{
      model: 'Room',
      required:true
    },
    connected:{
      type: 'integer',
      defaultsTo: 1
    }
  }
};
