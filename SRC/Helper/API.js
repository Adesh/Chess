var GLOBAL_VAR = require('../Globals');
var Toast = require('./GetToast');

module.exports = function(api_name) {
	//console.log(GLOBAL_VAR.BASE_URL_API+api_name);

	return fetch(GLOBAL_VAR.BASE_URL_API+api_name, {
	  method: 'GET',
	  headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json',
	  }
	})
	.then((response) => response.text())
	.then((responseText) => {
	  return responseText;
	}) 
	.catch((error) => {
		console.log(error)
		Toast('No Internet');
		GLOBAL_VAR.NAVIGATOR.push({name:'nointernet'}); 	
	});
}