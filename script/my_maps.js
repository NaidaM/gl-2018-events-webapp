var host = "http://localhost";
var port = "8080";
var path = host+":"+port+"/api/v1/"
var maps;
var mapsData;
var currentMarker;
var current_place;
var formData = new FormData();
var photoAdded = null;
var curent_place_longitude = 0;
var curent_place_latitude = 0;

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

//get maps 

axios.get ("users/"+localStorage.getItem('pseudo')+"/maps") 
		.then(function (response) {		
			
			if (response.status == 200) {				
				if(response.data.maps.length == 0){
					document.querySelector("#containerMaps").style.display = "none";
					document.querySelector("#containerWelcome").style.display = "block";
				}
				else {
					document.querySelector("#containerMaps").style.visibility = "visible";
                    document.querySelector("#containerMaps").style.display = "block";
					document.querySelector("#containerWelcome").style.display = "none";					
					mapsData = response.data.maps;	
					
					if (JSON.parse(localStorage.getItem('current_map')) === null) {
						localStorage.setItem('current_map', JSON.stringify(mapsData[0]));
					}
					
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
			}			
		})
		.catch(function (err) {
            console.log(err);
            document.querySelector("#containerMaps").style.display = "none";
            document.querySelector("#containerWelcome").style.display = "block";
			/*if (err.response.status == 404) {
                document.querySelector("#containerMaps").style.display = "none";
                document.querySelector("#containerWelcome").style.display = "block";
			}*/
		});
		
//add a new map

formNewMap.addEventListener("submit", function(e) {	
	e.preventDefault();
	var nameMap = document.querySelector("#idNameMap").value;
	var descMap = document.querySelector("#idDescMap").value;
	var friendsList = [];	
	var tags = $("#tagsMap").tagsinput('items');
	var tagsMap = [];
	if (tags!=null) {
        for (var  i = 0;i<tags.length;i++) {
            tagsMap.push({"name": tags[i] });
        }
    }

	var sharedMap = !$("#idPublic").is(":checked");
	
	if($("#idFriend").is(":checked")){
		var friends = $("#friendsList").tagsinput('items');
		if (friends!=null) {
			for (var i = 0;i<friends.length;i++) {
				friendsList.push({"pseudo": friends[i] });
			}
		}
	}
	
	var error = document.querySelector(".error");	
	
	if (nameMap == "") {
		error.innerHTML = "Ce champ est obligatoire!";
		error.style.display = "block";
	}else {
		axios.post ("users/"+localStorage.getItem('pseudo')+"/maps", {
			name: nameMap,
			description: descMap,
			isPrivate: sharedMap,
			tags: tagsMap,
			friends: friendsList	
		})
		.then(function (response) {		
			if (response.status == 201) {
                localStorage.removeItem('current_map');
				localStorage.setItem('current_map', JSON.stringify(response.data));
				console.log(response.data);
                location.reload(true);
			}
		})
		.catch(function (err) {
			console.log(err);
		});		
	}
});

$('#changeFriendsBtn').click(function(){
	var friends = $("#shareList").tagsinput('items');
	if (friends!=null) {
		for (var i = 0;i<friends.length;i++) {
			friendsList.push({"pseudo": friends[i]});
		}
	}
});

$('#visibilityBtns').change(function(){
    if($("#idFriend").is(":checked")){
		document.querySelector("#friendsListDiv").style.display = "inline";
	}
    else{
		document.querySelector("#friendsListDiv").style.display = "none";
	}
});

$('#visibilityBtnsEdit').change(function(){
    if($("#idFriendEdit").is(":checked")){
		document.querySelector("#friendsListDivEdit").style.display = "inline";		
	}
    else{
		document.querySelector("#friendsListDivEdit").style.display = "none";
	}
});

function clickMaps(e) {
	e.preventDefault();
	var idCurrMap = e.target.childNodes[1].firstChild.textContent;
		
	axios.get ("maps/"+idCurrMap) 
		.then(function (response) {						
			if (response.status == 200) {	
                localStorage.removeItem('current_map');
				localStorage.setItem('current_map', JSON.stringify(response.data));	
                location.reload(true);
			}			
		})
		.catch(function (err) {
				console.log(err);
		});	
}

$('#addPhotosModal').on("shown.bs.modal", function (evt) {
    //get the element that opened the modal
	console.log(evt.relatedTarget.nextSibling.nextSibling.nextSibling.innerHTML);
	current_place = evt.relatedTarget.nextSibling.nextSibling.nextSibling.innerHTML;
});


$('#addPhotosModal').on("hidden.bs.modal", function (evt) {
    //empty div
	var divPic = document.querySelector('#modalBodyPic');
	while (divPic.childNodes.length>2) {
		divPic.removeChild(divPic.lastChild);
	};
});
//filling edit modal

if (JSON.parse(localStorage.getItem('current_map')) !== null) { 
	document.querySelector('#idNameMapEdit').defaultValue = JSON.parse(localStorage.getItem('current_map')).name;
	document.querySelector('#idDescMapEdit').defaultValue = JSON.parse(localStorage.getItem('current_map')).description;
	
	if (JSON.parse(localStorage.getItem('current_map')).isPrivate == "false") {	
		document.querySelector('#idPublicEdit').checked = true;
		document.querySelector('#btnPublicEdit').className += " active";
	}
	else if (JSON.parse(localStorage.getItem('current_map')).friends.length >0) {
		document.querySelector('#idFriendEdit').checked = true;
		document.querySelector('#btnFriendEdit').className += " active";
		document.querySelector("#friendsListDivEdit").style.display = "inline";

		var editFriends = JSON.parse(localStorage.getItem('current_map')).friends;
		
		$('#friendsListEdit').tagsinput('add', "");
		for (var  i = 0;i<editFriends.length;i++) {		
			$('#friendsListEdit').tagsinput('add', editFriends[i].pseudo);
		}
	}

	else {
		document.querySelector('#idPrivEdit').checked = true;
		document.querySelector('#btnPrivEdit').className += " active";
	}

	if (JSON.parse(localStorage.getItem('current_map')).tags != []) {
		var editTags = JSON.parse(localStorage.getItem('current_map')).tags;
		
		$('#tagsMapEdit').tagsinput('add', "");	
		for (var  i = 0;i<editTags.length;i++) {		
			$('#tagsMapEdit').tagsinput('add', editTags[i].name);
		}
	}
}
//filling edit place modal

/*
$('#editPlaceModal').on("shown.bs.modal", function (evt) {		
	if (JSON.parse(localStorage.getItem('current_map')) !== null) { 
		var places = JSON.parse(localStorage.getItem('current_map')).places;
		var place = null;
		for (var i=0; i<places.length; i++) {
			if (places[i].id == current_place) place = places[i];
		}
		
		if (place != null) {
			document.querySelector('#idNamePlaceEdit').defaultValue = place.name;
			document.querySelector('#idDescPlaceEdit').defaultValue = place.description;
		}
	}
});*/
//edit a map 

document.querySelector('#form-editMap').addEventListener("submit", function(e){
	e.preventDefault();
	var nameMapEd = document.querySelector("#idNameMapEdit").value;
	var descMapEd = document.querySelector("#idDescMapEdit").value;
	var friendsListEd = [];	
	var tagsEd = $("#tagsMapEdit").tagsinput('items');
	var tagsMapEd = [];
	if (tagsEd!=null) {
        for (var  i = 0;i<tagsEd.length;i++) {
            tagsMapEd.push({"name": tagsEd[i] });
        }
    }

	var sharedMapEd = !$("#idPublicEdit").is(":checked");
	
	if($("#idFriendEdit").is(":checked")){
		var friends = $("#friendsListEdit").tagsinput('items');
		if (friends!=null) {
			for (var i = 0;i<friends.length;i++) {
				friendsListEd.push({"pseudo": friends[i] });
			}
		}
	}
	
	if (nameMapEd == "") {
		alert("Name required");
	}
	
	else {
		axios.put ("users/"+localStorage.getItem('pseudo')+"/maps/"+ JSON.parse(localStorage.getItem('current_map')).id, {
			name: nameMapEd,
			description: descMapEd,
			isPrivate: sharedMapEd,
			tags: tagsMapEd,
			friends: friendsListEd	
		})
		.then(function (response) {		
			if (response.status == 200) {
                localStorage.removeItem('current_map');
				localStorage.setItem('current_map', JSON.stringify(response.data));
				console.log(response.data);			
				location.reload(true);
			}
		})
		.catch(function (err) {
			alert(err);
		});		
	}
});

//edit a place

document.querySelector('#form-editPlace').addEventListener("submit", function(e){
	e.preventDefault();
	var namePlaceEd = document.querySelector("#idNamePlaceEdit").value;
	var descPlaceEd = document.querySelector("#idDescPlaceEdit").value;
	
	if (namePlaceEd == "") {
		alert("Name required");
	}
	
	else {
		axios.put ("maps/"+JSON.parse(localStorage.getItem('current_map')).id+"/places/"+current_place, { 
			name: namePlaceEd,
			description: descPlaceEd
		})
		.then(function (response) {		
			if (response.status == 200) {
                console.log(response.data);			
				location.reload(true);
			}
		})
		.catch(function (err) {
			alert(err);
		});		
	}
});

//delete a map

$('#delMapBtn').click(function(){
	deleteMap(JSON.parse(localStorage.getItem('current_map')).id);
});

function deleteMap(idmap) {
    axios.delete("users/"+localStorage.getItem('pseudo')+"/maps/"+idmap)

		.then(function (response) {
            if (response.status == 200) {
				localStorage.removeItem('current_map');						
				if (mapsData.length > 1) {
					if (mapsData[0].id == idmap){
						localStorage.setItem('current_map', JSON.stringify(mapsData[1]));							
					}
					else {
						localStorage.setItem('current_map', JSON.stringify(mapsData[0]));							
					}
				}
				location.reload(true);
			}
        })
		.catch(function (err) {
			console.log(err);
    });
}

//delete a place

function deletePlace(idplace) {

    if (confirm("Are tou sure to delete this plcae ?")) {
        axios.delete("maps/" + JSON.parse(localStorage.getItem('current_map')).id + "/places/" + idplace)

            .then(function (response) {
                if (response.status == 200) {
                    map.closePopup();
                    map.removeLayer(currentMarker);
                }
            })
            .catch(function (err) {
                console.log(err);
            });
    }
}

var map = L.map('mapid').setView([48.85, 2.35], 13);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
	
	if (localStorage.getItem('current_map') !== null) {		
		axios.get ("maps/"+JSON.parse(localStorage.getItem('current_map')).id+"/places") //get places
			.then(function (response) {		
			
				if (response.status == 200) {

					for(var i = 0; i<response.data.length; i++){						
						var newMarker = L.DomUtil.create('div');
						var n = L.DomUtil.create('div');
						n.style.textAlign = "center";
						var titlePop = L.DomUtil.create('label', 'place_name', n);

						titlePop.innerHTML = "<b>"+ response.data[i].name +"</b>";
                        newMarker.appendChild(n);

						if (response.data[i].description!="") {
							var m = L.DomUtil.create('div');
							var msgPop = L.DomUtil.create('label', 'place-description', m);
							msgPop.innerHTML = response.data[i].description +"<br />";
							newMarker.appendChild(m);
						}
						
						var addPicsBtn = L.DomUtil.create('button','btn btn-primary popupBtn',newMarker);
						addPicsBtn.innerHTML = "Add pics";
						addPicsBtn.setAttribute("data-toggle", "modal");
						addPicsBtn.setAttribute("data-target", "#addPhotosModal");
						
						var seePicsBtn = L.DomUtil.create('button','btn btn-primary popupBtn',newMarker);
						seePicsBtn.innerHTML = "Pics";
						seePicsBtn.setAttribute("data-toggle", "modal");
						seePicsBtn.setAttribute("data-target", "#photosModal");
						
						var delPlaceBtn = L.DomUtil.create('button',' btn btn-danger popupBtn',newMarker);
						delPlaceBtn.innerHTML = "Delete";

						delPlaceBtn.addEventListener("click",function (e) {
                            deletePlace(e.target.nextSibling.innerHTML);
                        });
					
						var inputPlaceID = L.DomUtil.create('label','',newMarker);
						inputPlaceID.innerHTML = response.data[i].id;
						inputPlaceID.style.display = "none";						

						var editPlaceBtn = L.DomUtil.create('button','btn btn-primary popupBtn',newMarker);
						editPlaceBtn.innerHTML = "Edit";//'<i class="fas fa-pencil-alt"></i>';
						editPlaceBtn.addEventListener("click",function (e) {								
							current_place = (e.target.previousSibling.innerHTML);
                        });

						editPlaceBtn.setAttribute("data-toggle", "modal");
						editPlaceBtn.setAttribute("data-target", "#editPlaceModal");

                        var itineraire = L.DomUtil.create('button','btn btn-primary popupBtn',newMarker);
                        itineraire.innerHTML = "Find Itinerary";//'<i class="fas fa-pencil-alt"></i>';
                        itineraire.addEventListener("click",function (e) {
                            var coordPlace =( e.target.nextSibling.innerHTML).split(",");
                            routing(coordPlace[0],coordPlace[1]);

                        });
                        var coords = L.DomUtil.create('span', 'coords', newMarker);
                        coords.innerHTML =  response.data[i].latitude +","+ response.data[i].longitude ;

                        coords.style.display = "none";
						var newPopup = L.popup()
							.setContent(newMarker)
							.setLatLng(L.latLng(response.data[i].latitude,response.data[i].longitude));
						
						var createMarker = L.marker(L.latLng(response.data[i].latitude,response.data[i].longitude));
						createMarker.on('click', function(e){currentMarker = this;});						
						createMarker.addTo(map)
							.bindPopup(newPopup);			
					}
				}			
			})
			.catch(function (err) {
				console.log(err);
			});
	}


    function createButton(label, container) {
        var btn = L.DomUtil.create('button', 'btn btn-primary popupBtn', container);
        btn.setAttribute('type', 'button');
        btn.innerHTML = label;
        return btn;
    }

    function addImage(fileInput, container) {
        if (fileInput.files.length >0) {
            var file = fileInput.files[0];
			photoAdded = file;
            var reader  = new FileReader();
            reader.onload = function(e)  {
                var image = document.createElement("img");
                image.src = e.target.result;
                image.style.maxWidth = '300px'
                image.style.maxHeight = '300px'

                container.appendChild(image);
            }
            reader.readAsDataURL(file);
			
            formData.append('file', file);                        
        }

    }

	$('#addPhotoBtn').click(function(){
        var fileInput = document.createElement("input");
        fileInput.type = "file";

        $(fileInput).trigger('click');
        $(fileInput).change(function(){
            addImage(fileInput, document.querySelector("#modalBodyPic"));
        })
    });


document.querySelector('#formPhotos').addEventListener("submit", function(e){
	e.preventDefault();

	if (photoAdded != null) {
        //console.log("form length");
		$.ajax({
			url : 'http://127.0.0.1:8080/api/v1/image/upload/' + current_place,
			type : 'POST',
			data : formData,
			cache : false,
			contentType : false,
			processData : false,
			success : function(data, textStatus, jqXHR) {
				var message = jqXHR.responseText;
				$("#messages").append("<li>" + message + "</li>");
				formData = new  FormData();
			},
			error : function(jqXHR, textStatus, errorThrown) {
				$("#messages").append("<li style='color: red;'>" + textStatus + "</li>");
                formData = new  FormData();
			}
		});
	}
	
	$('#addPhotosModal').modal('hide');
});

map.on('locationfound', function (e) {
    L.Routing.control({
        waypoints: [
            L.latLng(curent_place_latitude,curent_place_longitude),
            L.latLng(e.latlng.lat,e.latlng.lng)

        ]
    }).addTo(map);
});
map.on('locationerror', function (e) {
	console.log("error"+ e.message);
});

    map.on('click', function(e) {
        var container = L.DomUtil.create('div'),
            contMark = L.DomUtil.create('div'),
            markBtn = createButton('Mark place', contMark);
        contMark.className = "centeredContainer";
        container.appendChild(contMark);
		
		L.popup()
				.setContent(container)
				.setLatLng(e.latlng)
				.openOn(map);
       /* var contLoc = L.DomUtil.create('div'),
            startBtn = createButton('Start from this location', contLoc),
            destBtn = createButton('Go to this location', contLoc);
        container.appendChild(contLoc);

        /* L.DomEvent.on(startBtn, 'click', function() { -->
        <!-- control.spliceWaypoints(0, 1, e.latlng); -->
        <!-- map.closePopup(); -->
        <!-- }); -->

        <!-- L.DomEvent.on(destBtn, 'click', function() { -->
        <!-- control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng); -->
        <!-- map.closePopup(); -->
        <!-- }); -->*/

        L.DomEvent.on(markBtn, 'click', function() {
			map.closePopup();
            var contName = document.createElement("div");
            var labelName = L.DomUtil.create("label",'labelTitle',contName);
            labelName.innerHTML = "Place name";
            var inputName = document.createElement("input");
            inputName.type = "text";
            inputName.maxLength = "30";
            contName.appendChild(inputName);
            container.appendChild(contName);

            var contMsg = document.createElement("div");
            var label = L.DomUtil.create("label",'labelTitle',contMsg);
            label.innerHTML = "Message";
            var inputMsg = document.createElement("textarea");
            inputMsg.rows = "4";
            inputMsg.maxLength = "160";
            inputMsg.cols = "28";
            contMsg.appendChild(inputMsg);
            container.appendChild(contMsg);

            var contValid = L.DomUtil.create('div'),
                okBtn = createButton('Validate', contValid);
            contValid.className = "markContainer";
            container.appendChild(contValid);
			
			L.popup({maxWidth : 200})
            .setContent(container)
            .setLatLng(e.latlng)
            .openOn(map);

            L.DomEvent.on(okBtn, 'click', function() {
                if (inputName.value != "") {
                    var newPopup = L.DomUtil.create('div');
						
                    var n = L.DomUtil.create('div');
                    n.style.textAlign = "center";
                    var titlePop = L.DomUtil.create('label', '', n);
                    titlePop.innerHTML = "<b>"+inputName.value+"</b>";
                    newPopup.appendChild(n);
                    if (inputMsg.value != ""){
                        var m = L.DomUtil.create('div');
                        var msgPop = L.DomUtil.create('label', '', m);
                        msgPop.innerHTML = inputMsg.value+"<br />";
                        newPopup.appendChild(m);
                    }	
										
					var addPicsBtn = L.DomUtil.create('button','btn btn-primary popupBtn',newPopup);
                    addPicsBtn.innerHTML = "Add photos";
                    addPicsBtn.setAttribute("data-toggle", "modal");
                    addPicsBtn.setAttribute("data-target", "#addPhotosModal");
					
                    var seePicsBtn = L.DomUtil.create('button','btn btn-primary popupBtn',newPopup);
                    seePicsBtn.innerHTML = "Photos";
                    seePicsBtn.setAttribute("data-toggle", "modal");
                    seePicsBtn.setAttribute("data-target", "#photosModal");
					
					var delPlaceBtn = L.DomUtil.create('button','btn btn-danger popupBtn',newPopup);
                    delPlaceBtn.innerHTML = "Delete";
					
					delPlaceBtn.addEventListener("click",function (e) {
						deletePlace(e.target.nextSibling.innerHTML);
					});
					
					var inputPlaceID2 = L.DomUtil.create('label','',newPopup);
					
					var editPlaceBtn = L.DomUtil.create('button','btn btn-primary edPlaceBtn popupBtn',newPopup);
					editPlaceBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
					editPlaceBtn.addEventListener("click",function (e) {
						current_place = (e.target.previousSibling.innerHTML);
                    });
                    editPlaceBtn.setAttribute("data-toggle", "modal");
                    editPlaceBtn.setAttribute("data-target", "#editPlaceModal");


                    var itineraire = L.DomUtil.create('button','btn btn-primary popupBtn',newPopup);
                    itineraire.innerHTML = "Find Itinerary";//'<i class="fas fa-pencil-alt"></i>';
                    itineraire.addEventListener("click",function (e) {
                        var coordPlace =( e.target.nextSibling.innerHTML).split(",");
                        routing(coordPlace[0],coordPlace[1]);
                    });
                    var coords = L.DomUtil.create('span', 'coords', newPopup);
                    coords.innerHTML =  e.latlng.lat +","+ e.latlng.lng ;

                    coords.style.display = "none";


                    var p = L.popup()
                        .setContent(newPopup)
                        .setLatLng(e.latlng);

											
					axios.post ("maps/"+JSON.parse(localStorage.getItem('current_map')).id+"/places", {
						name: inputName.value,
						description: inputMsg.value,
						latitude: e.latlng.lat,
						longitude: e.latlng.lng	
					})
					
					.then(function (response) {		
						if (response.status == 201) {					
							inputPlaceID2.innerHTML = response.data.id;
							inputPlaceID2.style.display = "none";
							

							var createMarker2 = L.marker(e.latlng);
							createMarker2.on('click', function(e){currentMarker = this;});
							createMarker2.addTo(map)
								.bindPopup(p)
								.openPopup();
							currentMarker = createMarker2;						
						}
					})
					.catch(function (err) {
						console.log(err);
					});	
                }
                else {
                    labelName.style.color = "red";
                    labelName.innerHTML = "Place name (essential)"
                }
            });

            markBtn.style.display = 'none';
        });

        L.popup()
            .setContent(container)
            .setLatLng(e.latlng)
            .openOn(map);

    });
    /*<!-- L.Routing.control({ -->
    <!-- waypoints: [ -->
    <!-- L.latLng(48.74, 2.40), -->
    <!-- L.latLng(48.1, 2.36) -->
    <!-- ] -->
    <!-- }).addTo(map); -->*/
	
	
function createPlace() {
    var btn = L.DomUtil.create('button', 'addedbtn', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    formData.delete("file");
}

function routing(latitude , longitude) {
    curent_place_longitude = longitude;
    curent_place_latitude = latitude;
   map.locate();


}

