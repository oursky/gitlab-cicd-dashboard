const geoip = require('geoip-lite');

exports.getTimezone = function getTimezone(clientIP) {
  if(clientIP == null){
    return "Asia/Hong_Kong"; //default
  }
  const geoInfo = geoip.lookup(clientIP);
  return geoInfo.timezone
}