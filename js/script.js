// Caminhos de Santiago - General Client Script
document.addEventListener("DOMContentLoaded", () => {
    // Smooth navbar scroll state
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 40) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });
    }
});
