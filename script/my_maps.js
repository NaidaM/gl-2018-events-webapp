var host = "http://localhost";
var port = "8080";
var path = host+":"+port+"/api/v1/";

console.log(localStorage.getItem('access_token'));

var axios = axios.create({
  baseURL: path,
  timeout: 1000,
  headers: {'Authorization': localStorage.getItem('access_token')}
});

axios.get ("users/"+localStorage.getItem('pseudo')+"/maps") 
		.then(function (response) {			
			if (response.status == 200) {
				console.log(response.data);
			}
			console.log(response);
		})
		.catch(function (err) {
			console.log(err.response.data.message[0]);
		});