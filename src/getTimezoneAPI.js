const fetch = require("node-fetch");

exports.getTimezone = function getTimezone(clientIP){
  const clientPromise = fetch(`https://ipapi.co/61.92.7.109/json/`)
  return clientPromise.then((response)=>{
    const clientInfo = response.json()
    return clientInfo
  });
}