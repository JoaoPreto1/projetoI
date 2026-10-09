document.addEventListener("DOMContentLoaded", function () {
    const myCheckbox = document.getElementById('TermosECondiçoes');
    const myRegisterBtn = document.getElementById('myRegisterBtn');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const matchHint = document.getElementById('passwordMatchHint');
    const btnOpenTerms = document.getElementById('btnOpenTerms');
    const btnAceitarTermosModal = document.getElementById('btnAceitarTermosModal');

    // Checkbox toggle state
    if (myCheckbox && myRegisterBtn) {
        myCheckbox.addEventListener('change', () => {
            myRegisterBtn.disabled = !myCheckbox.checked;
        });
    }

    // Modal Termos e Condições
    if (btnOpenTerms) {
        btnOpenTerms.addEventListener('click', (e) => {
            e.preventDefault();
            const modalEl = document.getElementById('termosModal');
            if (modalEl && window.bootstrap) {
                const modal = new window.bootstrap.Modal(modalEl);
                modal.show();
            }
        });
    }

    if (btnAceitarTermosModal && myCheckbox && myRegisterBtn) {
        btnAceitarTermosModal.addEventListener('click', () => {
            myCheckbox.checked = true;
            myRegisterBtn.disabled = false;
            const modalEl = document.getElementById('termosModal');
            if (modalEl && window.bootstrap) {
                const modal = window.bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            }
        });
    }

    // Toggle Password Visibility
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

    // Real-time password match feedback
    function checkPasswordsMatch() {
        if (!passwordInput || !confirmPasswordInput || !matchHint) return;
        const p1 = passwordInput.value;
        const p2 = confirmPasswordInput.value;

        if (!p2) {
            matchHint.style.display = 'none';
            return;
        }

        matchHint.style.display = 'block';
        if (p1 === p2) {
            matchHint.className = 'small mt-1 fw-semibold text-success';
            matchHint.innerHTML = '<i class="fas fa-check-circle me-1"></i> As senhas coincidem';
        } else {
            matchHint.className = 'small mt-1 fw-semibold text-danger';
            matchHint.innerHTML = '<i class="fas fa-times-circle me-1"></i> As senhas não coincidem';
        }
    }

    if (passwordInput && confirmPasswordInput) {
        passwordInput.addEventListener('input', checkPasswordsMatch);
        confirmPasswordInput.addEventListener('input', checkPasswordsMatch);
    }

    // Ensure default admin user exists
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const adminExists = users.find(user => user.id == 1);

    if (!adminExists) {
        users.push({
            id: 1,
            nome: "admin",
            email: "admin@gmail.com",
            password: "admin123",
            tipo: "admin",
            percurso: "Ainda por escolher",
            pontos: 0,
            total: 0,
            historico: []
        });
        localStorage.setItem('users', JSON.stringify(users));
    }

    const regForm = document.getElementById('registerForm');
    if (regForm) {
        regForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const errorMessageDiv = document.getElementById('error-message');

            errorMessageDiv.innerHTML = '';

            if (!nome || !email || !password) {
                errorMessageDiv.innerHTML = '<i class="fas fa-exclamation-circle me-1"></i> Preencha todos os campos obrigatórios.';
                return;
            }

            if (password.length < 6) {
                errorMessageDiv.innerHTML = '<i class="fas fa-exclamation-circle me-1"></i> A senha deve ter pelo menos 6 caracteres.';
                return;
            }

            if (password !== confirmPassword) {
                errorMessageDiv.innerHTML = '<i class="fas fa-exclamation-circle me-1"></i> As senhas não coincidem. Por favor, tente novamente.';
                return;
            }

            let users = JSON.parse(localStorage.getItem('users')) || [];
            const userExists = users.some(user => user.email.toLowerCase() === email.toLowerCase());

            if (userExists) {
                errorMessageDiv.innerHTML = '<i class="fas fa-exclamation-circle me-1"></i> Esse email já está registado. Tente fazer login.';
                return;
            }

            const novoId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
            const tipo = email.toLowerCase() === "admin@gmail.com" ? "admin" : "user";

            const novoUser = {
                id: novoId,
                nome: nome,
                email: email,
                password: password,
                tipo: tipo,
                percurso: "Ainda por escolher",
                pontos: 0,
                total: 0,
                historico: []
            };

            users.push(novoUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Feedback visual e redirecionamento suave
            errorMessageDiv.className = 'text-success text-center small mt-3 fw-semibold';
            errorMessageDiv.innerHTML = '<i class="fas fa-check-circle me-1"></i> Conta criada com sucesso! A redirecionar...';
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 900);
        });
    }
});