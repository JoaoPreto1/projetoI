document.addEventListener("DOMContentLoaded", function () {
    const myCheckbox = document.getElementById('TermosECondiçoes');
    const myRegisterBtn = document.getElementById('myRegisterBtn');

    if (myCheckbox && myRegisterBtn) {
        myCheckbox.addEventListener('change', () => {
            myRegisterBtn.disabled = !myCheckbox.checked;
        });
    }

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
            total: 0,
            historico : []
        });
        localStorage.setItem('users', JSON.stringify(users));
    }

    const regForm = document.getElementById('registerForm');
    if (regForm) {
        regForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const errorMessageDiv = document.getElementById('error-message');
        const percurso = 'Ainda por escolher';
        const pontos = 0;
        const total = 0;
        const historico = [];

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

        class User {
            constructor(id, nome, email, password, tipo, percurso, pontos, total, historico){
                this.id = id;
                this.nome = nome;
                this.email = email;
                this.password = password;
                this.tipo = tipo;
                this.percurso = percurso;
                this.pontos = pontos;
                this.total = total;
                this.historico = historico;
            }
        }

        const novoUser = new User(novoId, nome, email, password, tipo, percurso, pontos, total, historico)
        console.log(novoUser)

        users.push(novoUser);
        localStorage.setItem('users', JSON.stringify(users));

        
        window.location.href = 'login.html';
        });
    }
});