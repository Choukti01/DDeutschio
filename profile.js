document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) return window.location.href = 'login.html';

  // DOM elements
  const profileName = document.getElementById('profileName');
  const avatarImg = document.getElementById('avatarImg');
  const avatarInput = document.getElementById('avatarInput');
  const changeAvatarBtn = document.getElementById('changeAvatarBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const deleteAccountBtn = document.getElementById('deleteAccountBtn');
  const noteInput = document.getElementById('noteInput');
  const saveNoteBtn = document.getElementById('saveNoteBtn');
  const clearNoteBtn = document.getElementById('clearNoteBtn');
  const notesList = document.getElementById('notesList');

  let user;

  // ------------------ FETCH USER DATA ------------------
  try {
    const res = await fetch('https://deutschio.up.railway.app/profile', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!res.ok) throw new Error('Unauthorized');
    user = await res.json();
  } catch {
    localStorage.removeItem('token');
    return window.location.href = 'login.html';
  }

  // ------------------ PROFILE RENDER ------------------
  profileName.textContent = user.name || 'Click to set your name';
  profileName.style.cursor = 'pointer';
  profileName.addEventListener('click', async () => {
    const newName = prompt('Enter your display name:', user.name || '');
    if (!newName) return;

    user.name = newName.trim();
    profileName.textContent = user.name;

    await fetch('https://deutschio.up.railway.app/name', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ name: user.name })
    });
  });

  avatarImg.src = user.avatar || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><rect width="100%" height="100%" fill="%23ddd"/><text x="50%" y="50%" font-size="36" text-anchor="middle" fill="%23999" dy=".3em">🙂</text></svg>';

  // ------------------ NOTES ------------------
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[m]));
  }

  async function updateNotesBackend() {
    await fetch('https://deutschio.up.railway.app', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + token 
      },
      body: JSON.stringify({ notes: user.notes })
    });
  }

  function renderNotes() {
    notesList.innerHTML = '';
    const arr = user.notes || [];
    if (arr.length === 0) {
      notesList.innerHTML = '<div class="empty">No notes yet - write your first note above.</div>';
      return;
    }

    arr.slice().reverse().forEach((n, idx) => {
      const card = document.createElement('div');
      card.className = 'note-card fade-in';
      const ts = n.createdAt ? new Date(n.createdAt).toLocaleString() : '';
      const noteText = typeof n === 'string' ? n : (n.text || '');
      card.innerHTML = `
        <div class="note-text">${escapeHtml(noteText)}</div>
        <div class="note-meta">${ts}</div>
        <div class="note-controls">
          <button class="btn small ghost" data-index="${arr.length - 1 - idx}">Delete</button>
        </div>
      `;
      notesList.appendChild(card);
    });

    notesList.querySelectorAll('.note-controls button').forEach(btn => {
      btn.addEventListener('click', async () => {
        const i = Number(btn.getAttribute('data-index'));
        if (!Number.isInteger(i)) return;
        if (!confirm('Delete this note?')) return;
        user.notes.splice(i, 1);
        await updateNotesBackend();
        renderNotes();
      });
    });
  }

  saveNoteBtn.addEventListener('click', async () => {
    const text = (noteInput.value || '').trim();
    if (!text) { alert('Write something first.'); return; }
    user.notes = user.notes || [];
    user.notes.push({ text, createdAt: new Date().toISOString() });
    await updateNotesBackend();
    noteInput.value = '';
    renderNotes();
  });

  clearNoteBtn.addEventListener('click', () => { noteInput.value = ''; });

  // ------------------ AVATAR ------------------
  changeAvatarBtn.addEventListener('click', () => avatarInput.click());
  avatarInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please choose an image file'); return; }

    const reader = new FileReader();
    reader.onload = async function(ev) {
      const dataUrl = ev.target.result;
      avatarImg.src = dataUrl;
      user.avatar = dataUrl;
      await fetch('https://deutschio.up.railway.app', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': 'Bearer ' + token 
        },
        body: JSON.stringify({ avatar: dataUrl })
      });
      avatarInput.value = '';
    };
    reader.readAsDataURL(file);
  });

  // ------------------ LOGOUT & DELETE ------------------
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  });

  deleteAccountBtn.addEventListener('click', async () => {
    if (!confirm('Delete this account and all notes? This cannot be undone.')) return;
    await fetch('https://deutschio.up.railway.app/profile', {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  });

  renderNotes();

  // =================== TYPING GAME ===================
  const typingWords = [
    { de: "Hallo", en: "hello" },
    { de: "Tschüss", en: "bye" },
    { de: "Danke", en: "thanks" },
    { de: "Bitte", en: "please" },
    { de: "Ja", en: "yes" },
    { de: "Nein", en: "no" }
  ];
  let typingIndex = 0, typingScore = 0, typingTimer = null;

  function startTypingGame() {
    typingIndex = 0;
    typingScore = 0;
    document.getElementById("typing-score").innerText = "";
    showTypingWord();
  }

  function showTypingWord() {
    if (typingIndex >= typingWords.length) {
      document.getElementById("typing-word").innerText = "🎉 Done!";
      document.getElementById("typing-score").innerText = `Your Score: ${typingScore}/${typingWords.length}`;
      return;
    }
    const word = typingWords[typingIndex];
    const input = document.getElementById("typing-input");
    input.value = "";
    input.focus();
    document.getElementById("typing-word").innerText = word.de;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      typingIndex++;
      showTypingWord();
    }, 5000);
  }

  document.getElementById("typing-input").addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      const input = e.target.value.trim().toLowerCase();
      if (input === typingWords[typingIndex].en.toLowerCase()) typingScore++;
      typingIndex++;
      showTypingWord();
    }
  });

  window.startTypingGame = startTypingGame;

  // =================== HANGMAN ===================
  const hangmanWords = ["hallo","danke","bitte","tschüss","schule","freund"];
  let chosenWord, displayWord, attempts;

  function startHangman() {
    chosenWord = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
    displayWord = Array(chosenWord.length).fill("_");
    attempts = 6;
    document.getElementById("hangman-word").innerText = displayWord.join(" ");
    document.getElementById("hangman-status").innerText = `Attempts left: ${attempts}`;
    renderLetters();
  }

  function renderLetters() {
    const container = document.getElementById("hangman-letters");
    container.innerHTML = "";
    for (let i=97; i<=122; i++) {
      const letter = String.fromCharCode(i);
      const btn = document.createElement("button");
      btn.innerText = letter;
      btn.onclick = () => guessLetter(letter, btn);
      container.appendChild(btn);
    }
  }

  function guessLetter(letter, btn) {
    btn.disabled = true;
    if (chosenWord.includes(letter)) {
      for (let i=0; i<chosenWord.length; i++) {
        if (chosenWord[i]===letter) displayWord[i]=letter;
      }
      document.getElementById("hangman-word").innerText = displayWord.join(" ");
      if (!displayWord.includes("_")) {
        document.getElementById("hangman-status").innerText = "🎉 You Won!";
        document.getElementById("hangman-letters").innerHTML = "";
      }
    } else {
      attempts--;
      document.getElementById("hangman-status").innerText = `Attempts left: ${attempts}`;
      if (attempts<=0) {
        document.getElementById("hangman-status").innerText = `💀 You lost! Word was: ${chosenWord}`;
        document.getElementById("hangman-letters").innerHTML = "";
      }
    }
  }

  window.startHangman = startHangman;

  // =================== WORD OF THE DAY ===================
  const words = [
    {german:"Apfel",english:"Apple",example:"Der Apfel ist rot."},
    {german:"Haus",english:"House",example:"Das Haus ist groß."},
    {german:"Buch",english:"Book",example:"Ich lese ein Buch."},
    {german:"Katze",english:"Cat",example:"Die Katze schläft."},
    {german:"Freund",english:"Friend",example:"Mein Freund ist nett."},
    {german:"Hund",english:"Dog",example:"Der Hund läuft schnell."},
    {german:"Sonne",english:"Sun",example:"Die Sonne scheint hell."},
    {german:"Mond",english:"Moon",example:"Der Mond ist schön."},
    {german:"Brot",english:"Bread",example:"Das Brot ist frisch."},
    {german:"Wasser",english:"Water",example:"Das Wasser ist klar."}
  ];

  const wordBox = document.getElementById("wordBox");
  function setWordOfDay() {
    const today = new Date().toDateString();
    const saved = JSON.parse(localStorage.getItem("wordOfDay"));
    if (saved && saved.date===today) {
      wordBox.innerHTML = `<h3>${saved.word.german} = ${saved.word.english}</h3><p>${saved.word.example}</p>`;
    } else {
      const randomWord = words[Math.floor(Math.random()*words.length)];
      wordBox.innerHTML = `<h3>${randomWord.german} = ${randomWord.english}</h3><p>${randomWord.example}</p>`;
      localStorage.setItem("wordOfDay", JSON.stringify({date: today, word: randomWord}));
    }
  }
  setWordOfDay();

  // =================== DRAG & DROP GAME ===================
  const draggables = document.querySelectorAll(".draggable");
  const dropzones = document.querySelectorAll(".dropzone");
  const gameMessage = document.getElementById("gameMessage");

  draggables.forEach(el => {
    el.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", el.dataset.translate);
      el.classList.add("dragging");
    });
    el.addEventListener("dragend", () => { el.classList.remove("dragging"); });
  });

  dropzones.forEach(zone => {
    zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("over"); });
    zone.addEventListener("dragleave", () => { zone.classList.remove("over"); });
    zone.addEventListener("drop", e => {
      e.preventDefault();
      const draggedWord = e.dataTransfer.getData("text/plain");
      if (zone.dataset.word === draggedWord) {
        zone.classList.add("correct");
        zone.textContent += " ✅";
        gameMessage.textContent = "✅ Correct Match!";
      } else {
        gameMessage.textContent = "❌ Wrong! Try again.";
      }
      zone.classList.remove("over");
    });
  });

});




window.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) return window.location.href = 'login.html';

  try {
    const res = await fetch('http://deutschio.up.railway.app', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    if (res.ok) {
      // Set user info
      document.getElementById('profileName').textContent = data.name || data.email;
      if(data.avatar) document.getElementById('avatarImg').src = data.avatar;
      if(data.notes && data.notes.length){
        const notesList = document.getElementById('notesList');
        notesList.innerHTML = '';
        data.notes.forEach(note => {
          const div = document.createElement('div');
          div.className = 'note-card';
          div.innerHTML = `<div class="note-text">${note}</div>`;
          notesList.appendChild(div);
        });
      }
    } else {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    }
  } catch (err) {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
});

// Logout button
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
});
