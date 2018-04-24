var host = "http://localhost";
var port = "8080";
var path = host+":"+port+"/api/v1/";
var map;
					
var axios = axios.create({
  baseURL: path,
  timeout: 5000,
  headers: {'Authorization': localStorage.getItem('access_token')}
});

function loadMap() {
	map = L.map('mapid').setView([48.85, 2.35], 13);
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
}

loadMap();
	
$("#mapPopup").on("shown.bs.modal", function () { 
    map.invalidateSize(true);
});

axios.get ("users/"+localStorage.getItem('pseudo')+"/maps/friends") 
	.then(function (response) {		
		
		if (response.status == 200) {				
			for (var i=0; i<response.data.length; i++){				
                var mainDiv = document.createElement("div");
				mainDiv.className = "col-lg-3 col-md-4 col-sm-6 card event-map";
				
				var bodyDiv = document.createElement("div");
				bodyDiv.className = "card-body";
				
				var mapTitle = document.createElement("a");
				mapTitle.href="#mapPopup";
				mapTitle.setAttribute("data-toggle", "modal");
				mapTitle.className = "card-title";
				mapTitle.innerHTML = response.data[i].name;
				mapTitle.id = response.data[i].id;
				mapTitle.addEventListener("click",function (e) {
					$("#maptitle").text(e.target.innerHTML);
					map.remove();
					loadMap();
					getMap(e.target.id);
				});		
				bodyDiv.appendChild(mapTitle);

				var mapDescr = document.createElement("p");
				mapDescr.className = "card-text";
				mapDescr.innerHTML = response.data[i].description;
				bodyDiv.appendChild(mapDescr);
				console.log(response.data[i]);
				if(response.data[i].tags.length>0){
					var mapTags = document.createElement("p");
					for (var j=0; j<response.data[i].tags.length; j++){
						var tag = document.createElement("a");
						tag.className = "badge badge-tag";
						tag.innerHTML = response.data[i].tags[j].name;
						tag.href="#";
						mapTags.appendChild(tag);						
					}
					bodyDiv.appendChild(mapTags);
				}				
				
				var mapAuthor = document.createElement("p");
				mapAuthor.className = "map-author";
				mapAuthor.innerHTML = "Author: "+response.data[i].user.pseudo;
				bodyDiv.appendChild(mapAuthor);
				
				mainDiv.appendChild(bodyDiv);				
				document.querySelector("#containerFriendsMaps").appendChild(mainDiv);
			}
		}
	})
	.catch(function (err) {
          console.log(err);
	});
	

function getMap (idmap) {	
	axios.get ("/maps/"+idmap+"/places") //get places
			.then(function (response) {		
			
				if (response.status == 200) {
					console.log(response.data);					
					for(var i = 0; i<response.data.length; i++){						
						var newMarker = L.DomUtil.create('div');
						newMarker.className = "centeredContainer";
						
						var n = L.DomUtil.create('div');
						var titlePop = L.DomUtil.create('label', '', n);
						titlePop.innerHTML = "<b>"+ response.data[i].name +"</b>";
						newMarker.appendChild(n);
						
						if (response.data[i].description!="") {
							var m = L.DomUtil.create('div');
							var msgPop = L.DomUtil.create('label', '', m);
							m.style.textAlign = "left";						
							msgPop.innerHTML = response.data[i].description +"<br />";
							newMarker.appendChild(m);
						}
						
						var seePicsBtn = L.DomUtil.create('button','btn btn-primary popupBtn',newMarker);
						seePicsBtn.innerHTML = "Photos";
						seePicsBtn.setAttribute("data-toggle", "modal");
						seePicsBtn.setAttribute("data-target", "#photosModal");
											
						var inputPlaceID = L.DomUtil.create('label','',newMarker);
						inputPlaceID.innerHTML = response.data[i].id;
						console.log(inputPlaceID.innerHTML);
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
