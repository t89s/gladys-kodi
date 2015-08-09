/**
 * This policie allowed only the local ip
 */

var os = require('os');
var interfaces = os.networkInterfaces();

function rangeIPV4(ip){
	var range = ip.split('.');
  return range.splice(0,3).join('.');
}

module.exports = function (req, res, next) {
	var ranges = [];
	var k;
	var k2;
	for (k in interfaces) {
    for (k2 in interfaces[k]) {
      var address = interfaces[k][k2];
      if (address.family === 'IPv4') {
      	ranges.push(rangeIPV4(address.address));
      }
    }
	}
	if(ranges.indexOf(rangeIPV4(req.ip)) === -1) return res.forbidden('Page allowed to local client');
	next();
};
