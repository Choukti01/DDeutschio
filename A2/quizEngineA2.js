// js/quizEngineA2.js
// Advanced Quiz Engine for A2 level (separate from A1)
console.log('quizEngineA2 loaded');

(function (global) {
  function loadQuizA2(questions, containerId, options = {}) {
    const cfg = Object.assign({
      shuffleOptions: true,
      autoAdvance: true,
      autoAdvanceDelay: 800,
      showProgress: true,
      showScoreBar: true
    }, options);

    const root = document.getElementById(containerId);
    if (!root) {
      console.warn(`loadQuizA2: container "${containerId}" not found.`);
      return;
    }

    let index = 0;
    let score = 0;

    function shuffle(arr) {
      return arr.slice().sort(() => Math.random() - 0.5);
    }

    function renderQuestion() {
      if (!questions || !questions.length) {
        root.innerHTML = '<div class="quiz-error">No questions available.</div>';
        return;
      }
      const q = questions[index];
      if (!q || !q.options || !q.answer) {
        root.innerHTML = '<div class="quiz-error">Invalid question format.</div>';
        return;
      }
      const opts = cfg.shuffleOptions ? shuffle(q.options) : q.options.slice();

      root.innerHTML = '';

      // quiz card
      const card = document.createElement('div');
      card.className = 'q-card';

      // progress
      if (cfg.showProgress) {
        const prog = document.createElement('div');
        prog.className = 'q-progress';
        prog.textContent = `Frage ${index + 1} von ${questions.length}`;
        card.appendChild(prog);
      }

      // question text
      const qtext = document.createElement('div');
      qtext.className = 'q-text';
      qtext.textContent = q.question;
      card.appendChild(qtext);

      // options
      const optsWrap = document.createElement('div');
      optsWrap.className = 'q-options';

      opts.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'q-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => handlePick(btn, opt, q.answer));
        optsWrap.appendChild(btn);
      });

      card.appendChild(optsWrap);
      root.appendChild(card);

      // score bar (extra feature in A2)
      if (cfg.showScoreBar) {
        const bar = document.createElement('div');
        bar.className = 'q-scorebar';
        bar.innerHTML = `<div class="fill" style="width:${(score / questions.length) * 100}%"></div>`;
        root.appendChild(bar);
      }
    }

    function handlePick(btn, picked, correct) {
      const optionParent = btn.closest('.q-options');
      if (!optionParent) return;
      optionParent.querySelectorAll('button').forEach(b => b.disabled = true);

      if (picked.trim() === correct.trim()) {
        btn.classList.add('correct');
        score++;
      } else {
        btn.classList.add('wrong', 'shake');
        optionParent.querySelectorAll('button').forEach(b => {
          if (b.textContent.trim() === correct.trim()) b.classList.add('correct');
        });
      }

      if (cfg.autoAdvance) {
        setTimeout(() => nextQuestion(), cfg.autoAdvanceDelay);
      } else {
        showNextButton();
      }
    }

    function showNextButton() {
      let next = root.querySelector('.q-next');
      if (!next) {
        next = document.createElement('button');
        next.className = 'q-next';
        next.textContent = 'Nächste Frage';
        next.addEventListener('click', () => {
          next.style.display = 'none';
          nextQuestion();
        });
        root.appendChild(next);
      }
      next.style.display = 'inline-block';
    }

    function nextQuestion() {
      index++;
      if (index < questions.length) {
        renderQuestion();
      } else {
        showResult();
      }
    }

    function showResult() {
      root.innerHTML = '';
      const res = document.createElement('div');
      res.className = 'quiz-result';
      res.innerHTML = `
        <h3>🎉 Super gemacht!</h3>
        <p>Dein Ergebnis: <strong>${score}</strong> von ${questions.length}</p>
      `;
      root.appendChild(res);

      // call optional endQuizA2 if defined
      if (typeof global.endQuizA2 === 'function') {
        global.endQuizA2(score, questions.length);
      }
    }

    // start
    renderQuestion();
  }

  global.loadQuizA2 = loadQuizA2;
})(window);
