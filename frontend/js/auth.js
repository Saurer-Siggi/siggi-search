const BASE_URL = 'https://saurer-siggi.de';

async function login(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/?rest_route=/simple-jwt-login/v1/auth&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
      method: 'POST',
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.data.jwt;
      localStorage.setItem('token', token);
      console.log('JWT Token:', token);
      console.log('Login Response:', data);
      return true;
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}

function logout() {
  localStorage.removeItem('token');
}

function isAuthenticated() {
  return localStorage.getItem('token') !== null;
}

export { login, logout, isAuthenticated };