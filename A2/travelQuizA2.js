const travelQuizA2 = [
  { question: "What is 'der Flughafen'?", options: ["Airport", "Hotel", "Bus", "Car"], answer: "Airport" },
  { question: "What is 'der Zug'?", options: ["Bus", "Train", "Taxi", "Airport"], answer: "Train" },
  { question: "Translate: Passport", options: ["der Pass", "die Reise", "das Auto", "das Ticket"], answer: "der Pass" },
  { question: "What is 'die Reise'?", options: ["Journey", "Suitcase", "Flight", "Car"], answer: "Journey" },
  { question: "Translate: Suitcase", options: ["der Koffer", "der Flughafen", "die Tasche", "der Zug"], answer: "der Koffer" },
  { question: "What is 'das Hotel'?", options: ["Hotel", "Ticket", "Airport", "Flight"], answer: "Hotel" },
  { question: "Translate: Car", options: ["das Auto", "der Zug", "das Boot", "die Reise"], answer: "das Auto" },
  { question: "What is 'die Fahrkarte'?", options: ["Ticket", "Bus", "Passport", "Car"], answer: "Ticket" },
  { question: "Translate: Flight", options: ["der Flug", "der Koffer", "der Pass", "das Hotel"], answer: "der Flug" },
  { question: "Translate: Bus", options: ["der Bus", "das Auto", "der Flughafen", "das Zimmer"], answer: "der Bus" }
];

function endQuizA2(score, total) {
 console.log(`Quiz completed. Score: ${score}/${total}` );
 
}