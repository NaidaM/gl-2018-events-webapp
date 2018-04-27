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
        localStorage.removeItem("current_map");
        document.location.href = "index.html";
    }

}

var templateP = _.template($("#pseudo-message").html());

document.querySelector("#logoutBtn").addEventListener("click",function () {
   logout();
});

$('#searchBtn').click(function(){
	localStorage.removeItem('search_results');
	var searchTags = $("#searchTags").tagsinput('items');
	if (searchTags.length >0) {
		var tags = "";
		for (var  i = 0;i<searchTags.length;i++) {
			tags = tags+"tag="+searchTags[i]+"&";
		}

		axios2.get("maps/searchmap?"+tags) 
			.then(function (response) {						
				if (response.status == 200) {
					localStorage.setItem('search_results', JSON.stringify(response.data));
					console.log("search results : ", response.data);
				}
			})
			.catch(function (err) {
				  console.log(err);
			});	
	}
    document.location.href = "results.html";
	
});

var ano = document.querySelectorAll(".anonymous");
var auth = document.querySelectorAll(".auth");
var passwordUpdate = document.querySelector("#updatePassword");
if(localStorage.getItem('access_token') != null){

    for (var i = 0;i<ano.length;i++){
        ano[i].style.display = "none";
    }
    for (var j = 0;j<auth.length;j++){
        auth[j].style.display = "block";
    }

    var html = templateP({pseudo: localStorage.getItem('pseudo')});
    $("#pseudo").append(html);
    console.log(html);

}else {
    for (var i = 0;i<ano.length;i++){
        ano[i].style.display = "block";
    }
    for (var j = 0;j<auth.length;j++){
        auth[j].style.display = "none";
    }


}


if (updatePassword!=null) { updatePassword.addEventListener("submit", function(e) {
    e.preventDefault();
    var actualPwd = document.querySelector("#actualPwd").value;
    var newPwd = document.querySelector("#newPwd").value;
    var confirmNewPwd = document.querySelector("#confirmNewPwd").value;
    var error = document.querySelector("#updatePassword .error");

    error.style.display = "none";
   // document.querySelector("#login-area").style.height = heightFormLogin+ "px";

    if (actualPwd  === "" || confirmNewPwd  === "" || newPwd === "") {
        error.innerHTML = "Tous les champs sont obligatoires!";
        error.style.display = "block";
    }
    else if ( confirmNewPwd  !== newPwd ) {
        error.innerHTML = "les nouveaux mot de passe doivent etre identique!";
        error.style.display = "block";
    }
    else {
        document.querySelector("#updatePwdBtn").disabled = true;
        document.querySelector(".loadBtnText").style.display = "none";
        document.querySelector("#load").style.display = "block";

        var axiosPwd = axios.create({
            baseURL: path,
            timeout: 10000,
            headers: {'Authorization': localStorage.getItem('access_token')}
        });

        axiosPwd.put(path+"auth/"+localStorage.getItem('pseudo')+"/password", {
            actual_password: actualPwd,
            new_password: newPwd,
            confirm: confirmNewPwd
        })
            .then(function (response) {
                if (response.status == 200) {
                    alert("Update success");
                    window.location.reload();
                }
                console.log(response);
            })
            .catch(function (err) {
                document.querySelector("#updatePwdBtn").disabled = false;
                document.querySelector(".loadBtnText").style.display = "block";
                document.querySelector("#load").style.display = "none";
                error.innerHTML =err.response.data.message[0];
                error.style.display = "block";
                //console.log(err.response.data.message[0]);
            });
    }
});
}