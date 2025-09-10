// familyQuiz.js

const familyQuizData = [
  {
    question: "Was bedeutet 'Mutter'?",
    answers: shuffle(["Mother", "Daughter", "Sister", "Aunt"]),
    correct: "Mother"
  },
  {
    question: "Was ist 'Bruder' auf Englisch?",
    answers: shuffle(["Brother", "Father", "Son", "Uncle"]),
    correct: "Brother"
  },
  {
    question: "'Eltern' bedeutet ...",
    answers: shuffle(["Parents", "Children", "Siblings", "Grandparents"]),
    correct: "Parents"
  },
  {
    question: "Was heißt 'Opa'?",
    answers: shuffle(["Grandpa", "Uncle", "Father", "Brother"]),
    correct: "Grandpa"
  },
  {
    question: "Was bedeutet 'Tochter'?",
    answers: shuffle(["Daughter", "Sister", "Wife", "Aunt"]),
    correct: "Daughter"
  },
  {
    question: "'Cousine' ist ...",
    answers: shuffle(["Female cousin", "Sister", "Niece", "Aunt"]),
    correct: "Female cousin"
  },
  {
    question: "Was heißt 'Onkel'?",
    answers: shuffle(["Uncle", "Nephew", "Father", "Brother"]),
    correct: "Uncle"
  },
  {
    question: "Was bedeutet 'Schwester'?",
    answers: shuffle(["Sister", "Mother", "Cousin", "Wife"]),
    correct: "Sister"
  },
  {
    question: "'Sohn' ist ...",
    answers: shuffle(["Son", "Brother", "Father", "Uncle"]),
    correct: "Son"
  },
  {
    question: "Was ist 'Oma' auf Englisch?",
    answers: shuffle(["Grandma", "Mom", "Aunt", "Sister"]),
    correct: "Grandma"
  }
];

let familyQuizInstance = null;

function initFamilyQuiz() {
  if (!familyQuizInstance) {
    familyQuizInstance = createQuizEngine("quiz-family", "next-family", familyQuizData);
  }
  familyQuizInstance.start();
}

// Shuffle function for answer randomization
function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}
