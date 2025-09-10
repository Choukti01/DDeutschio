const foodQuizA2 = [
  { question: "What is 'das Essen'?", options: ["Food", "Bread", "Milk", "Sugar"], answer: "Food" },
  { question: "Translate: Bread", options: ["das Brot", "der Apfel", "der Zucker", "das Salz"], answer: "das Brot" },
  { question: "What is 'die Milch'?", options: ["Milk", "Meat", "Vegetables", "Apple"], answer: "Milk" },
  { question: "Translate: Water", options: ["das Wasser", "das Essen", "der Fisch", "das Salz"], answer: "das Wasser" },
  { question: "What is 'der Apfel'?", options: ["Apple", "Bread", "Meat", "Milk"], answer: "Apple" },
  { question: "Translate: Vegetables", options: ["das Gemüse", "das Fleisch", "das Brot", "die Milch"], answer: "das Gemüse" },
  { question: "What is 'der Fisch'?", options: ["Fish", "Meat", "Vegetables", "Apple"], answer: "Fish" },
  { question: "Translate: Meat", options: ["das Fleisch", "der Fisch", "das Wasser", "das Salz"], answer: "das Fleisch" },
  { question: "What is 'der Zucker'?", options: ["Sugar", "Salt", "Milk", "Bread"], answer: "Sugar" },
  { question: "Translate: Salt", options: ["das Salz", "der Zucker", "das Fleisch", "das Gemüse"], answer: "das Salz" }
];

function endQuiz() {
  markCompleted();
}