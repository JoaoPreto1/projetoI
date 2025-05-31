
const ADMIN_USER = {
  id: 1,
  nome: "admin",
  email: "admin@gmail.com",
  password: "admin123", 
  tipo: "admin"
};


export function initAdminUser() {
  let users = JSON.parse(localStorage.getItem('users')) || [];

  const adminExists = users.some(user => user.id === ADMIN_USER.id);

  if (!adminExists) {
    users.push(ADMIN_USER);
    localStorage.setItem('users', JSON.stringify(users));
  }
}

export function getUsers() {
  return JSON.parse(localStorage.getItem('users')) || [];
}

export function findUser(email, password) {
  return getUsers().find(user => user.email === email && user.password === password);
}
