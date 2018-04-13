var host = "http://localhost";
var port = "8080";
var path = host+":"+port+"/api/v1/";
					
var axios2 = axios.create({
  baseURL: path,
  timeout: 5000
});

var logout = function () {

    if (confirm("Are tou sure to logout ?")) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("pseudo");
        document.location.href = "index.html";
    }

}

document.querySelector("#logoutBtn").addEventListener("click",function () {
   logout();
});

$('#searchBtn').click(function(){
	var searchTags = $("#searchTags").tagsinput('items');
	if (searchTags!=null) {
		var tags = "";
		for (var  i = 0;i<searchTags.length;i++) {
			tags = tags+"tag="+searchTags[i]+"&";
		}

		axios2.get("maps/searchmap?"+tags) 
			.then(function (response) {		
				
				if (response.status == 200) {
					console.log(response.data);
				}
			})
			.catch(function (err) {
				  console.log(err);
			});	
	}
});