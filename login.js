// login.js
// Frontend-only username + 4-digit PIN flow (localStorage).
// Keys: 'ddeutschio_users' (map), 'ddeutschio_session' (username)

document.addEventListener('DOMContentLoaded', () => {
  // Helpers
  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem('ddeutschio_users') || '{}');
    } catch {
      return {};
    }
  };
  const saveUsers = (u) => localStorage.setItem('ddeutschio_users', JSON.stringify(u));
  const setSession = (username) => localStorage.setItem('ddeutschio_session', username);
  const clearSession = () => localStorage.removeItem('ddeutschio_session');

  // Elements
  const stepName = document.getElementById('step-name');
  const stepPinEnter = document.getElementById('step-pin-enter');
  const stepPinSet = document.getElementById('step-pin-set');

  const nameInput = document.getElementById('nameInput');
  const nameContinue = document.getElementById('nameContinue');
  const nameError = document.getElementById('nameError');

  const userDisplayName = document.getElementById('userDisplayName');
  const pinInput = document.getElementById('pinInput');
  const pinEnterBtn = document.getElementById('pinEnterBtn');
  const pinForgotBtn = document.getElementById('pinForgotBtn');
  const pinError = document.getElementById('pinError');

  const pinSetInput = document.getElementById('pinSetInput');
  const pinSetConfirm = document.getElementById('pinSetConfirm');
  const pinSetBtn = document.getElementById('pinSetBtn');
  const pinSetError = document.getElementById('pinSetError');

  // Validation
  const nameValid = (v) => /^[A-Za-zÀ-ÿ\s]{2,}$/.test(v);
  const pinValid = (p) => /^\d{4}$/.test(p);

  // UI helpers
  const show = (el) => el.classList.remove('hidden');
  const hide = (el) => el.classList.add('hidden');

  // Start: ensure logged out (we will set session only on success)
  clearSession();

  nameContinue.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!nameValid(name)) {
      nameError.textContent = 'Please enter a valid name (letters & spaces, min 2).';
      return;
    }
    nameError.textContent = '';
    const users = getUsers();
    const key = name.toLowerCase();

    if (users[key]) {
      // user exists -> ask to enter PIN
      userDisplayName.textContent = users[key].name;
      show(stepPinEnter);
      hide(stepName);
      // focus PIN
      setTimeout(() => pinInput.focus(), 200);
    } else {
      // new user -> set PIN
      show(stepPinSet);
      hide(stepName);
      setTimeout(() => pinSetInput.focus(), 200);
    }
  });

  // Enter existing PIN
  pinEnterBtn.addEventListener('click', () => {
    const pin = (pinInput.value || '').trim();
    if (!pinValid(pin)) {
      pinError.textContent = 'Enter a valid 4-digit PIN.';
      return;
    }
    pinError.textContent = '';
    const name = userDisplayName.textContent;
    const key = name.toLowerCase();
    const users = getUsers();
    if (!users[key]) {
      pinError.textContent = 'User data not found. Please go back and enter your name again.';
      return;
    }
    if (users[key].pin === pin) {
      // success
      setSession(key);
      // redirect to profile
      window.location.href = 'profile.html';
    } else {
      pinError.textContent = 'Wrong PIN. Try again or reset.';
    }
  });

  // Reset / Forgot PIN — deletes stored PIN so user can set new one (but keeps notes/avatar)
  pinForgotBtn.addEventListener('click', () => {
    const name = userDisplayName.textContent;
    if (!confirm('This will let you set a new PIN for this account. Proceed?')) return;
    const users = getUsers();
    const key = name.toLowerCase();
    if (users[key]) {
      delete users[key].pin;
      saveUsers(users);
      alert('PIN removed. Please set a new PIN.');
      hide(stepPinEnter);
      show(stepPinSet);
    }
  });

  // Set PIN for new user
  pinSetBtn.addEventListener('click', () => {
    const pin = (pinSetInput.value || '').trim();
    const pin2 = (pinSetConfirm.value || '').trim();
    const name = nameInput.value.trim();
    if (!pinValid(pin)) {
      pinSetError.textContent = 'PIN must be 4 digits.';
      return;
    }
    if (pin !== pin2) {
      pinSetError.textContent = 'PINs do not match.';
      return;
    }
    pinSetError.textContent = '';

    const users = getUsers();
    const key = name.toLowerCase();
    users[key] = users[key] || { name: name, notes: [], avatar: null };
    users[key].pin = pin;
    saveUsers(users);
    setSession(key);
    // redirect
    window.location.href = 'profile.html';
  });

  // allow pressing Enter to trigger actions
  nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') nameContinue.click(); });
  pinInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') pinEnterBtn.click(); });
  pinSetConfirm.addEventListener('keydown', (e) => { if (e.key === 'Enter') pinSetBtn.click(); });
});