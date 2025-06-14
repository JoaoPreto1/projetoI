
function initHomePage() {
  fetch("../frontend/home.html")
    .then(response => response.text())
    .then(html => {
      document.getElementById("app").innerHTML = html;

      const loader = document.querySelector(".loader-wrapper");
      loader.style.transition = "opacity 0.5s ease";
      loader.style.opacity = 0;
      setTimeout(() => loader.style.display = "none", 500);

      const loginButton = document.getElementById("loginButton");
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
  
      if (user && loginButton) {
        loginButton.outerHTML = `
          <a id="profileIcon" class="nav-link" href="perfil.html">
            <i style="width: 60px; height: 35px; border-radius: 50%;" loading="lazy" class="fab">&#xf368 Perfil</i>
          </a>`;
      }
    })
    .catch(error => {
      console.error("Erro ao carregar a home page:", error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initHomePage()
})
