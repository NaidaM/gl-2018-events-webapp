var host = "http://localhost";
var port = "8080";
var path = host+":"+port+"/api/v1/"
var maps;
var mapsData;
var currentMarker;

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
            document.querySelector("#containerMaps").style.display = "none";
            document.querySelector("#containerWelcome").style.display = "block";
			/*if (err.response.status == 404) {
                document.querySelector("#containerMaps").style.display = "none";
                document.querySelector("#containerWelcome").style.display = "block";
			}*/
		});
		
		
formNewMap.addEventListener("submit", function(e) {	//add a new map
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
	//(JSON.parse(localStorage.getItem('current_map')).id);
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

function deletePlace(idplace) {
    axios.delete("maps/"+JSON.parse(localStorage.getItem('current_map')).id+"/places/"+idplace)

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

var map = L.map('mapid').setView([48.85, 2.35], 13);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
	
	if (localStorage.getItem('current_map') !== null) {		
		axios.get ("maps/"+JSON.parse(localStorage.getItem('current_map')).id+"/places") //get places
			.then(function (response) {		
			
				if (response.status == 200) {
					console.log(response.data);					
					for(var i = 0; i<response.data.length; i++){						
						var newMarker = L.DomUtil.create('div');
						var n = L.DomUtil.create('div');
						n.style.textAlign = "center";
						var titlePop = L.DomUtil.create('label', '', n);
						titlePop.innerHTML = "<b>"+ response.data[i].name +"</b>";
						newMarker.appendChild(n);
						
						if (response.data[i].description!="") {
							var m = L.DomUtil.create('div');
							var msgPop = L.DomUtil.create('label', '', m);
							msgPop.innerHTML = response.data[i].description +"<br />";
							newMarker.appendChild(m);
						}
						
						var seePicsBtn = L.DomUtil.create('button','btn btn-primary popupBtn',newMarker);
						seePicsBtn.innerHTML = "Photos";
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
            var reader  = new FileReader();
            reader.onload = function(e)  {
                var image = document.createElement("img");
                image.src = e.target.result;
                image.style.maxWidth = '300px'
                image.style.maxHeight = '300px'

                container.appendChild(image);
            }
            reader.readAsDataURL(file);
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
	
	$('#savePhotos').click(function(){
        
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

            var contPict = document.createElement("div");
            label = document.createElement("label");
            label.innerHTML = "Pictures";
            contPict.appendChild(label);
            var pic = document.createElement("input");
            pic.type = "file";
            contPict.appendChild(pic);

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

                    var p = L.popup()
                        .setContent(newPopup)
                        .setLatLng(e.latlng);
						
					console.log(inputName.value, inputMsg.value,e.latlng.lat,e.latlng.lng);
											
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
}

