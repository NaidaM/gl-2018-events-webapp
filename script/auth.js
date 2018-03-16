var formRegister = document.querySelector("#form-register");
var formLogin = document.querySelector("#form-login");
if (formRegister!=null) var heightFormRegister = document.querySelector("#register-area").clientHeight;
if (formLogin!=null) var heightFormLogin = document.querySelector("#login-area").clientHeight;
var host = "http://localhost";
var port = "8080";
var path = host+":"+port+"/api/v1/";

if (formRegister!=null) { formRegister.addEventListener("submit", function(e) {		
	e.preventDefault();
	var pseudo = document.querySelector("#idpseudo").value;
	var mail = document.querySelector("#idmail").value;
	var pwd = document.querySelector("#idpwd").value;
	var confpwd = document.querySelector("#idconf").value;
	var error = document.querySelector(".error");
	
	var regexMail = /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/;
	
	error.style.display = "none";
	document.querySelector("#register-area").style.height = heightFormRegister+ "px";
	
	if (pseudo  == ''|| mail  == ''|| pwd  == ''|| confpwd == '') {
		error.innerHTML = "Tous les champs sont obligatoires!";
		error.style.display = "block";
		document.querySelector("#register-area").style.height = document.querySelector("#register-area").clientHeight + error.clientHeight + "px" ;
	}
	
	else if (!regexMail.test(mail)){
		error.innerHTML = "L'adresse mail est incorrecte.";
		error.style.display = "block";
		document.querySelector("#register-area").style.height = document.querySelector("#register-area").clientHeight + error.clientHeight + "px" ;
	}
	
	else if (pseudo.length < 6) {
		error.innerHTML = "Le pseudo doit disposer d'au moins 6 caractères.";
		error.style.display = "block";
		document.querySelector("#register-area").style.height = document.querySelector("#register-area").clientHeight + error.clientHeight + "px" ;
	}
	
	else if (pwd.length < 6) {
		error.innerHTML = "Le mot de passe doit disposer d'au moins 6 caractères.";
		error.style.display = "block";
		document.querySelector("#register-area").style.height = document.querySelector("#register-area").clientHeight + error.clientHeight + "px" ;
	}
	
	else if (pwd != confpwd) {
		error.innerHTML = "Les mots de passe ne correspondent pas.";
		error.style.display = "block";
		document.querySelector("#register-area").style.height = document.querySelector("#register-area").clientHeight + error.clientHeight + "px" ;
	}
	
	else {
		document.querySelector("#idValBtn").prop( "disabled", true );
		axios.post(path+"auth/register", {
		pseudo: pseudo,
		email: mail,
		password: pwd,
		confirm: confpwd
	  })
	.then(function (response) {
		console.log(response);
	  })
	.catch(function (err) {		
		document.querySelector("#idValBtn").disabled = false;
		document.querySelector(".loadBtnText").style.display = "block";
		document.querySelector("#load").style.display = "none";
		console.log(err.response.data.message[0]);
	  });
	}
	
});
}

if (formLogin!=null) { formLogin.addEventListener("submit", function(e) {		
	e.preventDefault();
	var pseudo = document.querySelector("#idpseudo").value;
	var pwd = document.querySelector("#idpwd").value;
	var error = document.querySelector(".error");
	
	error.style.display = "none";
	document.querySelector("#login-area").style.height = heightFormLogin+ "px";
	
	if (pseudo  == '' || pwd  == '') {
		error.innerHTML = "Tous les champs sont obligatoires!";
		error.style.display = "block";
		document.querySelector("#login-area").style.height = heightFormLogin + error.clientHeight + "px" ;
	}
	
	else {
		document.querySelector("#idValBtn").disabled = true;
		document.querySelector(".loadBtnText").style.display = "none";
		document.querySelector("#load").style.display = "block";		
		
		axios.post(path+"auth/login", {
			pseudo: pseudo,
			password: pwd
		})
		.then(function (response) {			
			if (response.status == 200) {
			
				localStorage.setItem('access_token', response.data.access_token);
				localStorage.setItem('pseudo', pseudo);
				document.location.href = "my_maps.html";
			}
			console.log(response);
		})
		.catch(function (err) {
			document.querySelector("#idValBtn").disabled = false;
			document.querySelector(".loadBtnText").style.display = "block";
			document.querySelector("#load").style.display = "none";
			error.innerHTML = "Combinaison login/mot de passe incorrecte.";
			error.style.display = "block";
			document.querySelector("#login-area").style.height = heightFormLogin + error.clientHeight + "px" ;
			console.log(err.response.data.message[0]);
		});
	}
});
}