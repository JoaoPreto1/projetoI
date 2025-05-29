
import { renderHomePage } from "../views/homeView.html";

export function initHomePage() {
  document.getElementById("app").innerHTML = renderHomePage();

  window.addEventListener("load", () => {
    const loader = document.querySelector(".loader-wrapper");
    loader.style.transition = "opacity 0.5s ease";
    loader.style.opacity = 0;
    setTimeout(() => loader.style.display = "none", 500);
  });

  document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("loginButton");
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (user) {
      loginButton.outerHTML = `
        <a id="profileIcon" class="nav-link" href="perfil.html">
          <img src="user-icon.png" alt="Perfil" style="width: 35px; height: 35px; border-radius: 50%;" loading="lazy" />
        </a>`;
    }
  });
}
