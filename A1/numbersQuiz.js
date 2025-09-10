// numbersQuiz.js

const numbersQuizData = [
  {
    question: "Was bedeutet 'eins'?",
    answers: shuffle(["one", "two", "eleven", "ten"]),
    correct: "one"
  },
  {
    question: "'drei' ist ...",
    answers: shuffle(["four", "thirty", "three", "thirteen"]),
    correct: "three"
  },
  {
    question: "Was heißt 'zwölf'?",
    answers: shuffle(["twelve", "twenty", "eleven", "two"]),
    correct: "twelve"
  },
  {
    question: "'achtzehn' ist ...",
    answers: shuffle(["18", "13", "80", "8"]),
    correct: "18"
  },
  {
    question: "Was bedeutet 'fünfzehn'?",
    answers: shuffle(["15", "5", "50", "25"]),
    correct: "15"
  },
  {
    question: "Was ist 'siebzehn' auf Englisch?",
    answers: shuffle(["seventeen", "seven", "seventy", "seventeen hundred"]),
    correct: "seventeen"
  },
  {
    question: "'neunzig' ist ...",
    answers: shuffle(["90", "900", "19", "9"]),
    correct: "90"
  },
  {
    question: "Was heißt 'hundert'?",
    answers: shuffle(["100", "10", "1,000", "1"]),
    correct: "100"
  },
  {
    question: "'einundzwanzig' bedeutet ...",
    answers: shuffle(["21", "22", "31", "12"]),
    correct: "21"
  },
  {
    question: "Was ist 'fünfzig' auf Englisch?",
    answers: shuffle(["fifty", "fifteen", "five", "fifty-five"]),
    correct: "fifty"
  }
];

let numbersQuizInstance = null;

function initNumbersQuiz() {
  if (!numbersQuizInstance) {
    numbersQuizInstance = createQuizEngine("quiz-numbers", "next-numbers", numbersQuizData);
  }
  numbersQuizInstance.start();
}

// Utility function to shuffle answers randomly
function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}
