const fetch = require("node-fetch");

exports.getTimezone = function getTimezone(clientIP){
    const clientInfo = fetch(`https://ipapi.co/${clientIP}/json`)
    return clientInfo.utc_offset || "+0800" //Default : Hong Kong
}