const btnGreen = document.getElementById('green');
const btnRed = document.getElementById('red');
const btnYellow = document.getElementById('yellow');
const btnBlue = document.getElementById('blue');
const lblScore = document.getElementById('score');

const lblStart = document.getElementById('start-lbl');
const btnStart = document.getElementById('start');

class Game {
  constructor() {
    this.secuence = [];
    this.delay = 1200;
    this.buttons = [
      btnGreen,
      btnRed,
      btnYellow,
      btnBlue,
    ];
    this.score = 0;
    this.startButton = btnStart;
    this.playerSecuencePosition = 0;
    this.startButton.addEventListener('click', () => {
      lblStart.innerText = 'reset';
      this.init();
    });

    this.click = this.click.bind(this);
  }

  init() {
    this.score = 0;
    lblScore.innerText = '000';
    this.delay = 1200;
    this.secuence = [];
    this.levelUp();
  }

  levelUp() {
    const interval = 300;
    if (this.delay > interval) {
      this.delay -= this.secuence.length * 3;
    }
    let end = 0;
    let start = 0;
    this.playerSecuencePosition = 0;
    const next = this.random(0, 3);
    this.secuence.push(next);
    this.removeControls();
    this.mainButtonDisabled();
    setTimeout(() => {
      this.secuence.forEach((i, idx) => {
        const intervalFlag = idx === 0 ? 0 : interval;
        end = this.delay * (idx + 1);
        start = idx === 0 ? 0 : end - this.delay;
        // On
        setTimeout(() => {
          this.turnOnColor(i);
        }, start + intervalFlag);
        // Off
        setTimeout(() => {
          this.turnOffColor(i);
        }, end);
      });
      setTimeout(() => {
        this.addControls();
        this.mainButtonDisabled(false);
      }, end + (interval / 2));
    }, interval);
  }

  mainButtonDisabled(state = true) {
    const action = state ? 'add' : 'remove';
    btnStart.classList[action]('disabled');
  }

  increaseScore() {
    this.score += 1;
    const scoreStr = this.score.toString();
    const scoreFormat = scoreStr.length < 3 ? '0'.repeat(3 - scoreStr.length) + scoreStr : scoreStr;
    lblScore.innerText = scoreFormat.length >= 7 ? `${scoreFormat.substr(0, 6)}+` : scoreFormat;
  }

  turnOnColor(index) {
    this.buttons[index].classList.add('active');
  }

  turnOffColor(index) {
    this.buttons[index].classList.remove('active');
  }

  addControls() {
    this.buttons.forEach((item) => {
      item.classList.remove('disabled');
      item.addEventListener('click', this.click);
    });
  }

  removeControls() {
    this.buttons.forEach((item) => {
      item.classList.add('disabled');
      item.removeEventListener('click', this.click);
    });
  }

  click({ target }) {
    const { item } = target.dataset;
    const pPos = this.playerSecuencePosition;

    if (this.secuence[pPos] === parseInt(item, 10)) {
      this.increaseScore();
      if (pPos >= this.secuence.length - 1) {
        this.levelUp();
      } else {
        this.playerSecuencePosition += 1;
      }
    } else {
      this.lost();
    }
  }

  lost() {
    // eslint-disable-next-line no-alert
    alert('Game over');
    lblStart.innerText = 'start';
    this.removeControls();
  }

  // eslint-disable-next-line class-methods-use-this
  random(start, end) {
    return Math.floor(Math.random() * (end - start + 1)) + start;
  }
}

window.onload = () => {
  new Game();
};
