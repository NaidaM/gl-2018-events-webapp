var host = "http://localhost";
var port = "8080";
var path = host+":"+port+"/api/v1/";

var formNewMap = document.querySelector("#form-newMap");

console.log(localStorage.getItem('access_token'));

var axios = axios.create({
  baseURL: path,
  timeout: 1000,
  headers: {'Authorization': localStorage.getItem('access_token')}
});

axios.get ("users/"+localStorage.getItem('pseudo')+"/maps") 
		.then(function (response) {			
			if (response.status == 200) {
				if(response.data.maps.length == 0){
					document.querySelector("#containerMaps").style.display = "none";
					document.querySelector("#containerWelcome").style.display = "block";
				}
				else {
					document.querySelector("#containerMaps").style.display = "block";
					document.querySelector("#containerWelcome").style.display = "none";
				}
				console.log(response.data);	
			}			
		})
		.catch(function (err) {
			if (err.response.status == 404) 
				document.querySelector("#containerMaps").style.display = "none";
		});
		
		
formNewMap.addEventListener("submit", function(e) {
	e.preventDefault();
	var nameMap = document.querySelector("#idNameMap").value;
	var descMap = document.querySelector("#idDescMap").value;	
	
	var error = document.querySelector(".error");	
	
	if (nameMap == "") {
		error.innerHTML = "Ce champ est obligatoire!";
		error.style.display = "block";
	}
	
	else {
		axios.post ("users/"+localStorage.getItem('pseudo')+"/maps", {
			name: nameMap,
			description: descMap,
			taglist: "[tag]",
			visibility: true
		})
		.then(function (response) {			
			if (response.status == 201) {
				console.log(response.data);
				document.location.href = "my_maps.html";
			}
		})
		.catch(function (err) {
		});
		
	}
});
		
