import { login } from './auth.js';

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  console.log('Email:', email);
  console.log('Password:',password)

  const success = await login(email, password);

  if (success) {
    // Redirect to the admin interface
    window.location.href = 'admin.html';
  } else {
    alert('Login failed. Please try again.');
  }
});