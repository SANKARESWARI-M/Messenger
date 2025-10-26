const loginForm = document.getElementById('loginForm');
const guestBtn = document.getElementById('guestBtn');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const status = document.getElementById('statusMessage').value.trim();

  if (!name) {
    alert('Please enter a display name.');
    return;
  }

  if (!passwordRegex.test(password)) {
    alert('Password invalid. It must be at least 8 characters and include uppercase, lowercase, a number and a special character (e.g. @ $ ! % * ? &).');
    return;
  }

  localStorage.setItem('ml_username', name);
  localStorage.setItem('ml_status', status || 'Available');
  localStorage.setItem('ml_authenticated', 'true');

  window.location.href = 'chat.html';
});

guestBtn.addEventListener('click', () => {
  const guestName = 'Guest_' + Math.floor(Math.random() * 9000 + 1000);
  localStorage.setItem('ml_username', guestName);
  localStorage.setItem('ml_status', 'Guest');
  localStorage.setItem('ml_authenticated', 'guest');
  window.location.href = 'chat.html';
});
