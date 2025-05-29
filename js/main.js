import { setupLoginForm } from './controllers/loginController.js';
import { initAdminUser } from './models/userModel.js';
import { initHomePage } from "./controllers/homeController.js";


document.addEventListener('DOMContentLoaded', () => {
  initAdminUser();   
  setupLoginForm();
});


document.addEventListener("DOMContentLoaded", () => {
  initHomePage();
});

