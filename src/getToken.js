const fetch = require("node-fetch");

exports.getToken = function getToken(clientId, code, clientSecret) {

var params = {
  method: 'POST',
  headers: {
     "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
  },
};
return fetch(
        `https://gitlab.com/oauth/token?` +
        `&client_id=${clientId}` +
        `&grant_type=authorization_code` +
        `&code=${code}` +
        `&client_secret=${clientSecret}` +
        `&redirect_uri=http://localhost:8081/redirect`, params )
  .then(response => response.json())
  .catch(err => console.log(err));
}
