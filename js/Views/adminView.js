document.getElementById("logoutButton").addEventListener("click", function() {
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
});

document.getElementById("backButton").addEventListener("click", function() {
        window.location.href = "home.html";
});

document.addEventListener("DOMContentLoaded", function () {
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
});