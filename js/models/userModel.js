
const ADMIN_USER = {
  id: 1,
  name: "Administrador",
  email: "admin@gmail.com",
  password: "admin123", 
  role: "admin"
};


export function initAdminUser() {
  let users = JSON.parse(localStorage.getItem('users')) || [];

  const adminExists = users.some(user => user.email === ADMIN_USER.email);

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
