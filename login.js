const loginForm = document.getElementById('loginForm');
const errorDiv = document.getElementById('loginError');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch('https://deutschio.up.railway.app/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token); // save JWT
      window.location.href = 'profile.html';
    } else {
      errorDiv.style.display = 'block';
      errorDiv.textContent = data.message || 'Login failed';
    }
  } catch (err) {
    errorDiv.style.display = 'block';
    errorDiv.textContent = 'Server error';
  }
});