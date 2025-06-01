        const myCheckbox = document.getElementById('TermosECondiçoes');

        myCheckbox.addEventListener('click', () => {
            if (myCheckbox.checked){
                document.getElementById('myRegisterBtn').disabled = false;
            } else {
                document.getElementById('myRegisterBtn').disabled = true;
            }
        })

        document.addEventListener("DOMContentLoaded", function () {
        let users = JSON.parse(localStorage.getItem('users')) || [];

        const adminExists = users.some(user => user.email === "admin@email.com");

        if (!adminExists) {
            
            users.push({
                nome: "admin",
                email: "admin@email.com",
                password: "admin123",
                tipo: "admin"
            });

            localStorage.setItem('users', JSON.stringify(users));
        }
    });

    document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const errorMessageDiv = document.getElementById('error-message');
        const percurso = 'Ainda por escolher';
        const pontos = 0;
        const total = 0;

        errorMessageDiv.innerHTML = '';


        if (password !== confirmPassword) {
            errorMessageDiv.innerHTML = 'As senhas não coincidem. Por favor, tente novamente.';
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.email === email);

        if (userExists) {
            errorMessageDiv.innerHTML = 'Esse email já está registrado.';
            return;
        }

        // Definir role 
        const tipo = email === "admin@gmail.com" ? "admin" : "user";

      
        users.push({ nome, email, password, tipo, percurso, pontos, total });
        localStorage.setItem('users', JSON.stringify(users));

        
        window.location.href = 'login.html';
    });