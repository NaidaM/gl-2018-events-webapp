
$('#photosModal').on("shown.bs.modal", function (evt) {					
	var crt_place;
	//console.log(evt.relatedTarget.nextSibling.nextSibling.nextSibling.innerHTML);
	if (evt.relatedTarget.nextSibling.tagName == "LABEL") crt_place = evt.relatedTarget.nextSibling.innerHTML;
	else crt_place = evt.relatedTarget.nextSibling.nextSibling.innerHTML;
	axios.get("maps/place/"+crt_place+"/pictures") 
		.then(function (response) {						
			if (response.status == 200) {	
                console.log(response.data);
				var photoNames = response.data;
				for (var i = 0 ;i<photoNames.length;i++) {
					var image = document.createElement("img");
					image.src = "http://127.0.0.1:8080/api/v1/image/download/"+photoNames[i];
					image.style.maxWidth = '300px'
					image.style.maxHeight = '300px'
					image.className = "userImg";
					
					image.addEventListener("click",function (e) {
						if (location.pathname.substring(location.pathname.lastIndexOf("/") + 1)== "my_maps.html") {
							var viewDiv = document.querySelector('#modalBodyViewPic');
							var name = e.target.src.substring(e.target.src.lastIndexOf("/") + 1);
							for (var i = 0; i < viewDiv.childNodes.length; i++) {
								if (viewDiv.childNodes[i].src == e.target.src) {
									viewDiv.removeChild(viewDiv.childNodes[i]);
								}
							}
						
							axios.delete("image/delete/"+name) 
								.then(function (response) {	
									if(response.status == 200){
										for (var i = 0; i < viewDiv.childNodes.length; i++) {
											if (viewDiv.childNodes[i].src == e.target.src) 
												viewDiv.removeChild(viewDiv.childNodes[i]);
										}
									}	
								})
								.catch(function (err){
									console.log(err);
								});												
						}
					});		

					document.querySelector('#modalBodyViewPic').appendChild(image);	
					
				}
			}			
		})
		.catch(function (err) {
				console.log(err);
		});	
});

$('#photosModal').on("hidden.bs.modal", function (evt) {
    //empty the div
	var divView = document.querySelector('#modalBodyViewPic');
	while (divView.hasChildNodes()) {
		divView.removeChild(divView.lastChild);
	}
});
