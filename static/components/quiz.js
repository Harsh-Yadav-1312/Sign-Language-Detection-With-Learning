
function playMultipleBursts() {
    const burstCircles = new mojs.Burst({
      parent: '#mojs-container',
      radius: { 0: 300 },
      count: 40,
      angle: { 0: 360 },
      children: {
        shape: 'circle',
        radius: { 8: 25 },
        fill: ['#ff4d6d', '#4cc9f0', '#f9c74f', '#43aa8b', '#6a00f4', '#ff9f1c'],
        strokeWidth: 2,
        duration: 2000,
        easing: 'cubic.out'
      }
    });
  
    const burstPolygons = new mojs.Burst({
      parent: '#mojs-container',
      radius: { 0: 250 },
      count: 20,
      angle: { 0: 360 },
      children: {
        shape: 'polygon',
        points: 5,
        radius: { 10: 20 },
        fill: ['#3a0ca3', '#4361ee'],
        stroke: '#ffffff',
        strokeWidth: 1,
        duration: 1800,
        easing: 'cubic.out'
      }
    });
  
    burstCircles.play();
    burstPolygons.play();
  
    const message = document.getElementById('congratsMessage');
    message.textContent = "🎉 You're on fire!";
    message.style.display = 'block';
  
    setTimeout(() => {
      message.style.display = 'none';
    }, 1950);
  }
  
  
  
          class SignLanguageQuiz {
              constructor() {
                  this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
                  this.score = 0;
                  this.scoreElement = document.getElementById('score');
                  this.imageElement = document.getElementById('symbolImage');
                  this.optionsContainer = document.getElementById('optionsContainer');
                  this.skipButton = document.getElementById('skipButton');
                  this.setupSkipButton();
                  this.history = []; 
                  this.historyButton = document.getElementById('historyButton');
                  this.historyButton.addEventListener('click', () => {
                    const correctCount = this.history.filter(entry => entry.correct).length;
                    const incorrectCount = this.history.length - correctCount;
                    showHistory(this.history, correctCount, incorrectCount);
                });
              }
  
              setupSkipButton() {
                  this.skipButton.addEventListener('click', () => {
                      this.loadNewQuestion();
                  });
              }
  
              generateOptions(correctLetter) {
                  const wrongOptions = this.alphabet
                      .filter(letter => letter !== correctLetter)
                      .sort(() => Math.random() - 0.5)
                      .slice(0, 3);
                  
                  const allOptions = [...wrongOptions, correctLetter]
                      .sort(() => Math.random() - 0.5);
  
                  return allOptions;
              }
  
              loadNewQuestion() {
                  const randomLetter = this.alphabet[Math.floor(Math.random() * this.alphabet.length)];
                  this.imageElement.src = `static/symbols/${randomLetter}.jpg`;
                  
                  const options = this.generateOptions(randomLetter);
                  this.renderOptions(options, randomLetter);
              }
  
              renderOptions(options, correctLetter) {
                  this.correctLetter = correctLetter; // store correct answer
                  this.optionsContainer.innerHTML = '';
                  
                  options.forEach(letter => {
                      const button = document.createElement('button');
                      button.textContent = letter;
                      button.classList.add('option-btn');
                      
                      button.addEventListener('click', () => this.handleAnswer(button, letter === correctLetter));
                      this.optionsContainer.appendChild(button);
                  });
              }
  
              handleAnswer(selectedButton, isCorrect) {
               
                
      this.skipButton.disabled = true;
  
      const buttons = this.optionsContainer.querySelectorAll('.option-btn');
  
      buttons.forEach(button => {
          if (button.textContent === this.correctLetter) {
              button.classList.add('correct');
          } else {
              button.classList.add('incorrect');
          }
          button.disabled = true;
      });
      this.history.push({
        image: this.imageElement.src,
        letter: this.correctLetter,
        selected: selectedButton.textContent,
        correct: isCorrect
    });
      if (isCorrect) {
          this.score++;
          this.scoreElement.textContent = `Score: ${this.score}`;
          showToast('✅ Correct! Great Job.', 'correct');
  
          // Play celebration after 6 correct answers (6, 12, 18...)
          if (this.score % 5 === 0) {
              showToast(`🎉 Woohoo! ${this.score} Correct!`, 'correct');
              playMultipleBursts();
          }
      } else {
          showToast('❌ Incorrect! Try again.', 'incorrect');
      }
  
      setTimeout(() => {
          this.skipButton.disabled = false;
          this.loadNewQuestion();
      }, 2000);
  }
  
  
              init() {
                  this.loadNewQuestion();
              }
          }
  
          document.addEventListener('DOMContentLoaded', () => {
              const quiz = new SignLanguageQuiz();
              quiz.init();
          });
  
  
          function showToast(message, type = 'info') {
      const toast = document.getElementById('toast');
      toast.textContent = message;
  
      // Color by type
      if (type === 'correct') {
          toast.style.borderLeftColor = '#4CAF50';
      } else if (type === 'incorrect') {
          toast.style.borderLeftColor = '#f44336';
      } else {
          toast.style.borderLeftColor = '#8a4fff'; // default
      }
  
      toast.style.display = 'block';
      toast.style.opacity = '1';
  
      setTimeout(() => {
          toast.style.opacity = '0';
          setTimeout(() => toast.style.display = 'none', 300);
      }, 2000);
  }

  function showHistory(history, correctCount, incorrectCount) {
    const modal = document.getElementById('historyModal');
    const content = document.getElementById('historyContent');

    let html = `<p><strong>Total Correct:</strong> ${correctCount}</p>
                <p><strong>Total Incorrect:</strong> ${incorrectCount}</p><hr/>`;

    history.forEach((entry, index) => {
        html += `
            <div style="display:flex; align-items:center; margin-bottom:15px;">
                <img src="${entry.image}" style="width:60px; height:60px; border-radius:8px; margin-right:15px;">
                <div>
                    <p><strong>Q${index + 1}:</strong> Expected: ${entry.letter}, Selected: ${entry.selected}</p>
                    <p style="color: ${entry.correct ? '#4CAF50' : '#f44336'};">
                        ${entry.correct ? 'Correct ✅' : 'Incorrect ❌'}
                    </p>
                </div>
            </div>
        `;
    });

    content.innerHTML = html;
    modal.style.display = 'flex';
}

function closeHistory() {
    document.getElementById('historyModal').style.display = 'none';
}  