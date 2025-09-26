// profile.js
document.addEventListener('DOMContentLoaded', () => {
  const getUsers = () => JSON.parse(localStorage.getItem('ddeutschio_users') || '{}');
  const saveUsers = (u) => localStorage.setItem('ddeutschio_users', JSON.stringify(u));
  const getSession = () => localStorage.getItem('ddeutschio_session');

  const session = getSession();
  if (!session) {
    // not logged-in -> go to login
    window.location.href = 'login.html';
    return;
  }

  // DOM
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

  // load user
  const users = getUsers();
  const user = users[session];
  if (!user) {
    // corrupted session
    localStorage.removeItem('ddeutschio_session');
    window.location.href = 'login.html';
    return;
  }

  // render profile
  profileName.textContent = user.name || 'User';
  if (user.avatar) avatarImg.src = user.avatar;
  else avatarImg.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><rect width="100%" height="100%" fill="%23ddd"/><text x="50%" y="50%" font-size="36" text-anchor="middle" fill="%23999" dy=".3em">🙂</text></svg>';

  function renderNotes() {
    notesList.innerHTML = '';
    const arr = user.notes || [];
    if (arr.length === 0) {
      notesList.innerHTML = '<div class="empty">No notes yet — write your first note above.</div>';
      return;
    }
    // newest first
    arr.slice().reverse().forEach((n, idx) => {
      const card = document.createElement('div');
      card.className = 'note-card fade-in';
      const ts = new Date(n.createdAt).toLocaleString();
      card.innerHTML = `
        <div class="note-text">${escapeHtml(n.text)}</div>
        <div class="note-meta">${ts}</div>
        <div class="note-controls">
          <button class="btn small ghost" data-index="${arr.length - 1 - idx}">Delete</button>
        </div>
      `;
      notesList.appendChild(card);
    });
    // attach delete handlers
    notesList.querySelectorAll('.note-controls button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const i = Number(btn.getAttribute('data-index'));
        if (!Number.isInteger(i)) return;
        if (!confirm('Delete this note?')) return;
        user.notes.splice(i, 1);
        users[session] = user;
        saveUsers(users);
        renderNotes();
      });
    });
  }

  // escape
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  // avatar upload
  changeAvatarBtn.addEventListener('click', () => avatarInput.click());
  avatarInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please choose an image file'); return; }
    const reader = new FileReader();
    reader.onload = function(ev) {
      const dataUrl = ev.target.result;
      avatarImg.src = dataUrl;
      user.avatar = dataUrl;
      users[session] = user;
      saveUsers(users);
    };
    reader.readAsDataURL(file);
  });

  // save note
  saveNoteBtn.addEventListener('click', () => {
    const text = (noteInput.value || '').trim();
    if (!text) {
      alert('Write something first.');
      return;
    }
    user.notes = user.notes || [];
    user.notes.push({ text, createdAt: new Date().toISOString() });
    users[session] = user;
    saveUsers(users);
    noteInput.value = '';
    renderNotes();
  });

  clearNoteBtn.addEventListener('click', () => { noteInput.value = ''; });

  // logout
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('ddeutschio_session');
    window.location.href = 'index.html';
  });

  // delete account
  deleteAccountBtn.addEventListener('click', () => {
    if (!confirm('Delete this account and all notes? This cannot be undone.')) return;
    delete users[session];
    saveUsers(users);
    localStorage.removeItem('ddeutschio_session');
    window.location.href = 'index.html';
  });

  // initial render
  renderNotes();
});



// =================== Typing Challenge ===================
const typingWords = [
  { de: "Hallo", en: "hello" },
  { de: "Tschüss", en: "bye" },
  { de: "Danke", en: "thanks" },
  { de: "Bitte", en: "please" },
  { de: "Ja", en: "yes" },
  { de: "Nein", en: "no" }
];

let typingIndex = 0;
let typingScore = 0;
let typingTimer = null;
function startTypingGame() {
  typingIndex = 0;
  typingScore = 0;
  document.getElementById("typing-score").innerText = "";
  showTypingWord();
}
function showTypingWord() {
  if (typingIndex >= typingWords.length) {
    document.getElementById("typing-word").innerText = "🎉 Done!";
    document.getElementById("typing-score").innerText = `
      Your Score: ${typingScore}/${typingWords.length}`;
    return;
  }
  const word = typingWords[typingIndex];
  document.getElementById("typing-word").innerText = word.de;
  const input = document.getElementById("typing-input");
  input.value = "";
  input.focus();
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    typingIndex++;
    showTypingWord();
  }, 5000);
}
document.getElementById("typing-input").addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const input = e.target.value.trim().toLowerCase();
    const correct = typingWords[typingIndex].en.toLowerCase();
    if (input === correct) typingScore++;
    typingIndex++;
    showTypingWord();
  }
});

// =================== Hangman ===================
const hangmanWords = ["hallo", "danke", "bitte", "tschüss", "schule", "freund"];
let chosenWord, displayWord, attempts;

function startHangman() {
  chosenWord = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
  displayWord = Array(chosenWord.length).fill("_");
  attempts = 6;
  document.getElementById("hangman-word").innerText = displayWord.join(" ");
  document.getElementById("hangman-status").innerText =` Attempts left: ${attempts}`;
  renderLetters();
}

function renderLetters() {
  const container = document.getElementById("hangman-letters");
  container.innerHTML = "";
  for (let i = 97; i <= 122; i++) {
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
    for (let i = 0; i < chosenWord.length; i++) {
      if (chosenWord[i] === letter) displayWord[i] = letter;
    }
    document.getElementById("hangman-word").innerText = displayWord.join(" ");
    if (!displayWord.includes("_")) {
      document.getElementById("hangman-status").innerText = "🎉 You Won!";
      document.getElementById("hangman-letters").innerHTML = "";
    }
  } else {
    attempts--;
    document.getElementById("hangman-status").innerText = `Attempts left: ${attempts}`;
    if (attempts <= 0) {
      document.getElementById("hangman-status").innerText = `💀 You lost! Word was: ${chosenWord};`
      document.getElementById("hangman-letters").innerHTML = "";
    }
  }
}





document.addEventListener("DOMContentLoaded", () => {
  // --- Word of the Day ---
 const words = [
  { german: "Apfel", english: "Apple", example: "Der Apfel ist rot." },
  { german: "Haus", english: "House", example: "Das Haus ist groß." },
  { german: "Buch", english: "Book", example: "Ich lese ein Buch." },
  { german: "Katze", english: "Cat", example: "Die Katze schläft." },
  { german: "Freund", english: "Friend", example: "Mein Freund ist nett." },
  { german: "Hund", english: "Dog", example: "Der Hund läuft schnell." },
  { german: "Stuhl", english: "Chair", example: "Der Stuhl ist bequem." },
  { german: "Tisch", english: "Table", example: "Der Tisch ist rund." },
  { german: "Auto", english: "Car", example: "Das Auto ist schnell." },
  { german: "Schule", english: "School", example: "Die Schule ist weit weg." },
  { german: "Lehrer", english: "Teacher", example: "Der Lehrer erklärt gut." },
  { german: "Kind", english: "Child", example: "Das Kind spielt im Garten." },
  { german: "Stadt", english: "City", example: "Die Stadt ist schön." },
  { german: "Brot", english: "Bread", example: "Das Brot ist frisch." },
  { german: "Milch", english: "Milk", example: "Die Milch ist kalt." },
  { german: "Fisch", english: "Fish", example: "Der Fisch schwimmt." },
  { german: "Blume", english: "Flower", example: "Die Blume ist bunt." },
  { german: "Baum", english: "Tree", example: "Der Baum ist hoch." },
  { german: "Sonne", english: "Sun", example: "Die Sonne scheint hell." },
  { german: "Mond", english: "Moon", example: "Der Mond ist schön." },
  { german: "Wasser", english: "Water", example: "Das Wasser ist klar." },
  { german: "Feuer", english: "Fire", example: "Das Feuer ist heiß." },
  { german: "Freude", english: "Joy", example: "Die Freude ist groß." },
  { german: "Liebe", english: "Love", example: "Liebe ist wichtig." },
  { german: "Zeit", english: "Time", example: "Die Zeit vergeht schnell." },
  { german: "Tag", english: "Day", example: "Der Tag ist schön." },
  { german: "Nacht", english: "Night", example: "Die Nacht ist dunkel." },
  { german: "Arbeit", english: "Work", example: "Die Arbeit ist schwer." },
  { german: "Spiel", english: "Game", example: "Das Spiel macht Spaß." },
  { german: "Musik", english: "Music", example: "Die Musik ist laut." }
];

  const wordBox = document.getElementById("wordBox");

  function setWordOfDay() {
    let today = new Date().toDateString();
    let saved = JSON.parse(localStorage.getItem("wordOfDay"));

    if (saved && saved.date === today) {
      wordBox.innerHTML =` <h3>${saved.word.german} = ${saved.word.english}</h3><p>${saved.word.example}</p>`;
    } else {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      wordBox.innerHTML = `<h3>${randomWord.german} = ${randomWord.english}</h3><p>${randomWord.example}</p>`;
      localStorage.setItem("wordOfDay", JSON.stringify({ date: today, word: randomWord }));
    }
  }
  setWordOfDay();

  // --- Drag & Drop Game ---
  const draggables = document.querySelectorAll(".draggable");
  const dropzones = document.querySelectorAll(".dropzone");
  const gameMessage = document.getElementById("gameMessage");

  draggables.forEach(el => {
    el.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", el.dataset.translate);
      el.classList.add("dragging");
    });

    el.addEventListener("dragend", () => {
      el.classList.remove("dragging");
    });
  });

  dropzones.forEach(zone => {
    zone.addEventListener("dragover", e => {
      e.preventDefault();
      zone.classList.add("over");
    });

    zone.addEventListener("dragleave", () => {
      zone.classList.remove("over");
    });

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