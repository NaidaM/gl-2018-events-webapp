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

var templateP = _.template($("#pseudo-message").html());

document.querySelector("#logoutBtn").addEventListener("click",function () {
   logout();
});

$('#searchBtn').click(function(){
	var searchTags = $("#searchTags").tagsinput('items');
	if (searchTags.length >0) {
		var tags = "";
		for (var  i = 0;i<searchTags.length;i++) {
			tags = tags+"tag="+searchTags[i]+"&";
		}

		axios2.get("maps/searchmap?"+tags) 
			.then(function (response) {						
				if (response.status == 200) {
					localStorage.removeItem('search_results');
					localStorage.setItem('search_results', JSON.stringify(response.data));
					console.log("search results : ", response.data);
				}
			})
			.catch(function (err) {
				  console.log(err);
			});	
	}
});

var ano = document.querySelectorAll(".anonymous");
var auth = document.querySelectorAll(".auth");
if(localStorage.getItem('access_token') != null){

    for (var i = 0;i<ano.length;i++){
        ano[i].style.display = "none";
    }
    for (var j = 0;j<auth.length;j++){
        auth[j].style.display = "block";
    }

    var html = templateP({pseudo: localStorage.getItem('pseudo')});
    $("#pseudo").append(html);

}else {
    for (var i = 0;i<ano.length;i++){
        ano[i].style.display = "block";
    }
    for (var j = 0;j<auth.length;j++){
        auth[j].style.display = "none";
    }


}