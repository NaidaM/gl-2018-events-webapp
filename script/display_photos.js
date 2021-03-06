$('#photosModal').on("shown.bs.modal", function (evt) {					
	var crt_place;
	//console.log(evt.relatedTarget.nextSibling.nextSibling.nextSibling.innerHTML);
	if (evt.relatedTarget.nextSibling.tagName === "LABEL") crt_place = evt.relatedTarget.nextSibling.innerHTML;
	else crt_place = evt.relatedTarget.nextSibling.nextSibling.innerHTML;

	axios.get("maps/place/"+crt_place+"/pictures")
		.then(function (response) {						
			if (response.status === 200) {

				var photoNames = response.data;
				for (var i = 0 ;i<photoNames.length;i++) {
					var div = document.createElement("div");
					div.className = "div-photo";
					div.style.display= "inline";
					var image = document.createElement("img");
					var btnDel = document.createElement("button");
					var iconDel = document.createElement("i");
					iconDel.className = "fa fa-trash-alt";
                	btnDel.appendChild(iconDel);
					btnDel.className = "btn btn-danger";
				//	btnDel.textContent = "delete";
					image.src = "http://127.0.0.1:8080/api/v1/image/download/"+photoNames[i];

					div.style.width = image.width+"px";
					div.style.height = image.height+"px";
					image.style.maxWidth = '300px';
					image.style.maxHeight = '300px';
					image.className = "userImg";
					image.style.zIndex = "10";	
					image.style.position = "relative";

					div.appendChild(image);
					div.appendChild(btnDel);
                    btnDel.addEventListener("click",function (e) {
						if (location.pathname.substring(location.pathname.lastIndexOf("/") + 1)=== "my_maps.html") {

                            var viewDiv = document.querySelector('#modalBodyViewPic');
                            var img = this.previousSibling;
                            var divToremove = this.parentNode;
                            var name = img.src.substring(img.src.lastIndexOf("/") + 1);
                            //console.log(name);
                            //viewDiv.removeChild(this.parentNode);
                            if (confirm("are you sure to delete")) {
                                axios.delete("image/delete/" + name)
                                    .then(function (res) {
                                        if (res.status === 200) {
                                            viewDiv.removeChild(divToremove);
                                        }
                                    })
                                    .catch(function (err) {
                                        console.log(err);
                                    });
                            }
                        }
					});		

					document.querySelector('#modalBodyViewPic').appendChild(div);
					/*if (location.pathname.substring(location.pathname.lastIndexOf("/") + 1)== "my_maps.html") {										
						var delLabel = document.createElement("img");
						delLabel.style.left = "-"+ image.naturalWidth +"px";		
						delLabel.style.position = "relative";
						delLabel.style.zIndex = "5";
						delLabel.src ="https://d30y9cdsu7xlg0.cloudfront.net/png/620343-200.png";
						delLabel.style.width = "50px";
						delLabel.className = "delImgLabel";
						document.querySelector('#modalBodyViewPic').appendChild(delLabel);		
					}
				
					image.onload = function () {
						var viewDiv = document.querySelector('#modalBodyViewPic');				
						for (var i = 2; i < viewDiv.childNodes.length; i+=2) {
							var margin = viewDiv.childNodes[i-1].width/1.5 - 15;
							
							viewDiv.childNodes[i].style.left = "-"+ margin +"px";		
							console.log(viewDiv.childNodes);						
						}
					}*/
				}
				
			}			
		})
		.catch(function (err) {
				console.log(err);
		});	
});

$('#photosModal').on("hidden.bs.modal", function (evt) {

	var divView = document.querySelector('#modalBodyViewPic');
	while (divView.hasChildNodes()) {
		divView.removeChild(divView.lastChild);
	}
});
