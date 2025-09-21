const quizData = [
  {
    question: "What does 'Guten Morgen' mean?",
    options: ["Good night", "Good morning", "Good evening", "Good day"],
    answer: "Good morning"
  },
  {
    question: "How do you say 'Goodbye' in German?",
    options: ["Hallo", "Tschüss", "Guten Tag", "Danke"],
    answer: "Tschüss"
  },
  {
    question: "What is 'Wie geht’s?' in English?",
    options: ["How are you?", "Where are you?", "Good night", "See you later"],
    answer: "How are you?"
  },
  {
    question: "Which one means 'Nice to see you!'?",
    options: ["Schön, dich zu sehen!", "Gute Nacht", "Auf Wiedersehen", "Hallo"],
    answer: "Schön, dich zu sehen!"
  },
  {
    question: "What does 'Mir geht’s gut' mean?",
    options: ["I’m fine", "I’m busy", "See you tomorrow", "Thank you"],
    answer: "I’m fine"
  }
];

let currentQ = 0;
let score = 0;

const questionEl = document.getElementById("quiz-question");
const optionsEl = document.getElementById("quiz-options");
const nextBtn = document.getElementById("next-btn");
const resultEl = document.getElementById("quiz-result");

function loadQuestion() {
  const q = quizData[currentQ];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.classList.add("quiz-option");
    btn.onclick = () => checkAnswer(opt);
    optionsEl.appendChild(btn);
  });
}

function checkAnswer(answer) {
  if (answer === quizData[currentQ].answer) {
    score++;
  }
  currentQ++;
  if (currentQ < quizData.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  questionEl.textContent = "";
  optionsEl.innerHTML = "";
  nextBtn.style.display = "none";
  resultEl.textContent = `You scored ${score} / ${quizData.length}`;
}

nextBtn.onclick = () => {
  if (currentQ < quizData.length) loadQuestion();
};

loadQuestion();