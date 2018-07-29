import GLOBAL from '../Globals';
import Toast from './Toast';

const API = (api, method = 'GET') => fetch(GLOBAL.BASE_URL_API + api, {
	  method: method,
	  headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json',
	  }
	})
	.then(response => response.text())
	.then(responseText => responseText) 
	.catch(error => {
		Toast('No Internet');
});

export default API