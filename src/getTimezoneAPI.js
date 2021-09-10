const fetch = require("node-fetch");

exports.getTimezone = function getTimezone(clientIP) {
  const clientInfo = fetch(`https://ipapi.co/${clientIP}/json`);
  return clientInfo.timezone || "Asia/Hong_Kong"; //Default
};
