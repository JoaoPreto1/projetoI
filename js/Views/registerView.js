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

        const adminExists = users.find(user => user.id == 1);

        if (!adminExists) {
            
            users.push({
                id : 1,
                nome: "admin",
                email: "admin@gmail.com",
                password: "admin123",
                tipo: "admin",
                percurso : "Ainda por escolher",
                pontos : 0,
                total: 0
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
        const novoId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
        
        const userExists = users.some(user => user.email === email);
        
        if (userExists) {
            errorMessageDiv.innerHTML = 'Esse email já está registrado.';
            return;
        }
        
        // Definir role 
        const tipo = email === "admin@gmail.com" ? "admin" : "user";
        
        
        const novoUser = {
            id : novoId,
            nome: nome,
            email: email,
            password: password,
            tipo : tipo,
            percurso : percurso,
            pontos : pontos,
            total : total
        }
        users.push(novoUser);
        localStorage.setItem('users', JSON.stringify(users));

        
        // window.location.href = 'login.html';
    });