import {hitRate} from '../models/gamingModel.js'

document.addEventListener("DOMContentLoaded", async function () {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!user) {
        window.location.href = "login.html";
    } else {
        document.getElementById("userEmail").innerText = `Bem-vindo, ${user.nome}`;
        document.getElementById('userRate').innerText = `A tua taxa de acerto é ${ await hitRate()}`;
    }

    document.getElementById("logoutButton").addEventListener("click", function () {
    localStorage.removeItem("loggedInUser");
    window.location.href = "home.html";
    });
});