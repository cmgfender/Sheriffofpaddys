document.addEventListener('DOMContentLoaded', () => {
  const hour = new Date().getHours();
  const body = document.body;

  if (hour >= 6 && hour < 12) {
    body.classList.add('morning');
  } else if (hour >= 12 && hour < 18) {
    body.classList.add('afternoon');
  } else {
    body.classList.add('evening');
  }

  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    if (password === 'Glassmire') {
      window.location.href = '/tools';
    } else {
      alert('Incorrect password. Please try again.');
    }
  });
});