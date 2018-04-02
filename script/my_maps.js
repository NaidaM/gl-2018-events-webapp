var host = "http://localhost";
var port = "8080";
var path = host+":"+port+"/api/v1/"
var maps;
var mapsData;

var formNewMap = document.querySelector("#form-newMap");

if(localStorage.getItem('access_token') == null){
    document.location.href = "login.html";
}

var template = _.template($("#tmpl-message").html());
					
var axios = axios.create({
  baseURL: path,
  timeout: 5000,
  headers: {'Authorization': localStorage.getItem('access_token')}
});

axios.get ("users/"+localStorage.getItem('pseudo')+"/maps") 
		.then(function (response) {		
			console.log(localStorage.getItem('pseudo'));	
			
			if (response.status == 200) {
				
				if(response.data.maps.length == 0){
					//document.querySelector("#containerMaps").style.display = "none";
					document.querySelector("#containerWelcome").style.display = "block";
				}
				else {
					document.querySelector("#containerMaps").style.visibility = "visible";
                    document.querySelector("#containerMaps").style.display = "block";
					document.querySelector("#containerWelcome").style.display = "none";
					mapsData = response.data.maps;
                    var html = template({maps: response.data.maps});
                    $("#mapsSlider").append(html);
                    $('.slidemaps').slick({
						dots: true,
						infinite: false,
                        slidesToShow: 2,
                        slidesToScroll:2 ,
                        variableWidth:true,
                        centerMode:false,
                        centerPadding: '100px',
                        prevArrow: '<button type="button" id="arrow-left" class="btn slick-prev"> <i class="fa fa-arrow-circle-left"></i></button>',
                        nextArrow: '<button type="button" id="arrow-right" class="btn slick-next"> <i class="fa fa-arrow-circle-right"></i></button>'
                    });

                    maps = document.querySelectorAll(".map-link");

                    if(typeof  maps  !== "undefined"){

                        for (var i = 0; i < maps.length; i++) {
                            maps[i].addEventListener('click', clickMaps, true);
                        }

                    }
				}
				console.log(response.data);	
			}			
		})
		.catch(function (err) {
            console.log(err);
			if (err.response.status == 404) {
                document.querySelector("#containerMaps").style.display = "none";
                document.querySelector("#containerWelcome").style.display = "block";
			}
		});
		
		
formNewMap.addEventListener("submit", function(e) {	//add a new map
	e.preventDefault();
	var nameMap = document.querySelector("#idNameMap").value;
	var descMap = document.querySelector("#idDescMap").value;	
	var tags = $("#tagsMap").tagsinput('items');

	console.log(tags);
	var tagsMap = [];
	if (tags!=null) {
        for (var  i = 0;i<tags.length;i++) {
            tagsMap.push({"name": tags[i] });
        }
    }

	var sharedMap = $('#visibilityBtns input:radio:checked').val();
	
	//alert("["+tagsMap+"]");
	
	var error = document.querySelector(".error");	
	
	if (nameMap == "") {
		error.innerHTML = "Ce champ est obligatoire!";
		error.style.display = "block";
	}
	
	else {
		axios.post ("users/"+localStorage.getItem('pseudo')+"/maps", {
			name: nameMap,
			description: descMap,
			isPrivate: "true",
			tags: tagsMap,
			friends: []		
		})
		.then(function (response) {		
			if (response.status == 201) {
				console.log(response.data);
                window.location.reload();
				//document.location.href = "my_maps.html";
			}
		})
		.catch(function (err) {
			
		});		
	}
});


function clickMaps(e) {
	e.preventDefault();
	console.log(e.target.childNodes[1].firstChild.textContent);
}	
