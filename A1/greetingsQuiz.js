// greetingsQuiz.js

const greetingsQuizData = [
  {
    question: "Was bedeutet 'Hallo'?",
    answers: ["Goodbye", "Thanks", "Good night","Hello"],
    correct: "Hello"
  },
  {
    question: "Wie sagt man 'Good morning' auf Deutsch?",
    answers: ["Gute Nacht", "Guten Abend", "Hallo", "Guten Morgen"],
    correct: "Guten Morgen"
  },
  {
    question: "Was heißt 'Guten Abend' auf Englisch?",
    answers: ["Good day", "Goodbye", "Hello", "Good evening"],
    correct: "Guten Abend"
  },
  {
    question: "'Wie geht’s?' bedeutet ...",
    answers: [ "See you", "Excuse me", "How are you?", "Thank you"],
    correct: "How are you?"
  },
  {
    question: "Was sagt man abends zum Abschied?",
    answers: [ "Guten Tag", "Gute Nacht", "Hallo", "Danke"],
    correct: "Gute Nacht"
  },
  {
    question: "Wie begrüßt man jemanden formell?",
    answers: ["Guten Tag", "Tschüss", "Servus", "Na?"],
    correct: "Guten Tag"
  },
  {
    question: "Was heißt 'Auf Wiedersehen'?",
    answers: [ "See you later", "Good day", "Goodbye", "Good night"],
    correct: "Goodbye"
  },
  {
    question: "Wie sagt man 'Thank you very much'?",
    answers: ["Dankeschön", "Bitte schön", "Entschuldigung", "Guten Abend"],
    correct: "Dankeschön"
  },
  {
    question: "'Entschuldigung' bedeutet ...",
    answers: ["Excuse me / Sorry", "Hello", "Please", "You're welcome"],
    correct: "Excuse me / Sorry"
  },
  {
    question: "'Tschüss' sagt man, wenn ...",
    answers: ["you say goodbye", "you say hello", "you thank someone", "you ask something"],
    correct: "you say goodbye"
  }
];

let greetingsQuizInstance = null;

function initGreetingsQuiz() {
  if (!greetingsQuizInstance) {
    greetingsQuizInstance = createQuizEngine("quiz-greetings", "next-greetings", greetingsQuizData);
  }
  greetingsQuizInstance.start();
}
