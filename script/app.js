var logout = function () {

    if (confirm("Are tou sure to logout ?")) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("pseudo");
        document.location.href = "index.html";
    }

}

document.querySelector("#logoutBtn").addEventListener("click",function () {
   logout();
});