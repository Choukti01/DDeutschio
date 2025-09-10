// daysTimeQuiz.js

const daysTimeQuizData = [
  {
    question: "Was bedeutet 'Montag'?",
    answers: shuffle(["Monday", "Tuesday", "Friday", "Sunday"]),
    correct: "Monday"
  },
  {
    question: "'Donnerstag' ist ...",
    answers: shuffle(["Thursday", "Wednesday", "Saturday", "Sunday"]),
    correct: "Thursday"
  },
  {
    question: "Was heißt 'Gestern'?",
    answers: shuffle(["Yesterday", "Tomorrow", "Today", "Morning"]),
    correct: "Yesterday"
  },
  {
    question: "Was ist 'Wie spät ist es?' auf Englisch?",
    answers: shuffle(["What time is it?", "How are you?", "What's the date?", "Where is it?"]),
    correct: "What time is it?"
  },
  {
    question: "'Viertel nach zwei' bedeutet ...",
    answers: shuffle(["2:15", "1:45", "3:15", "2:45"]),
    correct: "2:15"
  },
  {
    question: "Was bedeutet 'halb neun'?",
    answers: shuffle(["8:30", "9:30", "7:30", "9:00"]),
    correct: "8:30"
  },
  {
    question: "Was heißt 'Samstag' auf Englisch?",
    answers: shuffle(["Saturday", "Sunday", "Friday", "Tuesday"]),
    correct: "Saturday"
  },
  {
    question: "'Es ist zehn Uhr' bedeutet ...",
    answers: shuffle(["It's 10 o'clock", "It's 2 o'clock", "It's 9 o'clock", "It's 12 o'clock"]),
    correct: "It's 10 o'clock"
  },
  {
    question: "Was heißt 'morgen' (context: day)?",
    answers: shuffle(["tomorrow", "morning", "yesterday", "night"]),
    correct: "tomorrow"
  },
  {
    question: "Was ist 'Freitag'?",
    answers: shuffle(["Friday", "Wednesday", "Monday", "Saturday"]),
    correct: "Friday"
  }
];

let daysQuizInstance = null;

function initDaysQuiz() {
  if (!daysQuizInstance) {
    daysQuizInstance = createQuizEngine("quiz-days", "next-days", daysTimeQuizData);
  }
  daysQuizInstance.start();
}

// Utility to randomize answers
function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}
