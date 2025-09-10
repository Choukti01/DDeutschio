// greetingsQuizEngine.js

function createQuizEngine(containerId, nextBtnId, questions) {
  let current = 0;
  let score = 0;

  const container = document.getElementById(containerId);
  const nextBtn = document.getElementById(nextBtnId);

  function renderQuestion() {
    const q = questions[current];
    container.innerHTML = `
      <div class="q-card animate">
        <div class="q-text">${q.question}</div>
        <div class="q-options">
          ${q.answers.map(ans => `<button class="q-btn">${ans}</button>`).join("")}
        </div>
      </div>
    `;

    const buttons = container.querySelectorAll(".q-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => selectAnswer(btn, q.correct));
    });

    nextBtn.style.display = "none";
  }

  function selectAnswer(btn, correctAnswer) {
    const selected = btn.textContent;
    const buttons = container.querySelectorAll(".q-btn");

    buttons.forEach(b => {
      b.disabled = true;
      if (b.textContent === correctAnswer) {
        b.classList.add("correct");
      } else if (b.textContent === selected) {
        b.classList.add("wrong");
      }
    });

    if (selected === correctAnswer) score++;
    nextBtn.style.display = "inline-block";
  }

  nextBtn.addEventListener("click", () => {
    current++;
    if (current < questions.length) {
      renderQuestion();
    } else {
      showResult();
    }
  });

  function showResult() {
    container.innerHTML = `
      <div class="q-card animate">
        <div class="q-text">🎉 Du hast ${score} von ${questions.length} richtig!</div>
      </div>
    `;
    nextBtn.style.display = "none";
  }

  return {
    start: function () {
      current = 0;
      score = 0;
      renderQuestion();
    }
  };
}
