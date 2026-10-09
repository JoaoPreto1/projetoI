import { findUser } from '../models/userModel.js';
import { initAdminUser } from '../models/userModel.js';

document.addEventListener('DOMContentLoaded', () =>{
    initAdminUser();
    setupLoginForm();
    setupPasswordToggle();
});

function setupPasswordToggle() {
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            const icon = this.querySelector('i');

            if (targetInput) {
                if (targetInput.type === 'password') {
                    targetInput.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    targetInput.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        });
    });
}

function setupLoginForm() {
    const form = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        errorMessage.innerHTML = '';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const user = findUser(email, password);

        if (!user) {
            errorMessage.innerHTML = 'Email ou senha incorretos.';
            return;
        }

        localStorage.setItem("loggedInUser", JSON.stringify(user));
        window.location.href = user.tipo == 'admin' ? 'admin.html' : 'home.html';

      
    });
}