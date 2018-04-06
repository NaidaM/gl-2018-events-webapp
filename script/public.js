var host = "http://localhost";
var port = "8080";
var path = host+":"+port+"/api/v1/";
					
var axios = axios.create({
  baseURL: path,
  timeout: 5000
});

axios.get ("/maps") 
	.then(function (response) {		
		
		if (response.status == 200) {				
			for (var i=0; i<response.data.length; i++){				
                var mainDiv = document.createElement("div");
				mainDiv.className = "col-lg-3 col-md-4 col-sm-6 card event-map";
				
				var bodyDiv = document.createElement("div");
				bodyDiv.className = "card-body";
				
				var mapTitle = document.createElement("h5");
				mapTitle.className = "card-title";
				mapTitle.innerHTML = response.data[i].name;
				bodyDiv.appendChild(mapTitle);

				var mapDescr = document.createElement("p");
				mapDescr.className = "card-text";
				mapDescr.innerHTML = response.data[i].description;
				bodyDiv.appendChild(mapDescr);
				
				if(response.data[i].tags.length>0){
					var mapTags = document.createElement("p");
					for (var j=0; j<response.data[i].tags.length; j++){
						var tag = document.createElement("a");
						tag.className = "badge badge-tag";
						tag.innerHTML = response.data[i].tags[j];
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
				document.querySelector("#containerPublicMaps").appendChild(mainDiv);
			}
		}
	})
	.catch(function (err) {
          console.log(err);
	});