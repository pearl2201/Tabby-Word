/* eslint-disable require-jsdoc */

import Phaser from 'phaser';
import WordButton from './components/wordButton';


const Vector2 = Phaser.Math.Vector2;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
/* const WIDTH = 1920;
const HEIGHT = 1080; */
const WORDBUTTON_SIZE = 135;
const WORDBUTTON_DISTANCE = 10;
const WORDBUTTON_CENTER_MARGIN_BOTTOM = 160;
const COLORLIST = [0xf67878, 0x6edcb6, 0x76cffe, 0x6d92fe, 0xf69cc4, 0xf4adc6, 0xfdfd95, 0xafc3d2, 0x7799cc, 0xb7c68b, 0xf4f0cb, 0xded29e, 0xb3a580, 0xa29524, 0xbed7d1, 0xf7ebc3, 0xfbd6c6, 0xf8e1e7, 0xf8d1e0, 0xd99294, 0xf5b7b7, 0xf6cacb, 0xd2d9ea, 0xafdac1];

const iterativeFunction= function(arr, x) {
  let start=0; let end=arr.length-1;

  // Iterate while start not meets end
  while (start<=end) {
    // Find the mid index
    const mid=Math.floor((start + end)/2);

    // If element is present at mid, return True
    if (arr[mid]===x) return true;

    // Else look in left or right half accordingly
    else if (arr[mid] < x) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }

  return false;
};

/**
 * Callback of notification: open new chrome tab.
 */
class GameShare extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameShare',
      active: false,
    });
  }

  preload() {
    /* this.load.setBaseURL('http://labs.phaser.io');

        this.load.image('sky', 'assets/skies/space3.png');
        this.load.image('logo', 'assets/sprites/phaser3-logo.png');
        this.load.image('red', 'assets/particles/red.png'); */

    this.load.image('replayBtn', 'assets/replayBtn.png');
    this.load.image('ideaBtn', 'assets/ideaBtn.png');
    this.load.image('resultbox', 'assets/resultbox.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('wordbutton', 'assets/wordbutton.png');
    this.load.bitmapFont('poplar', 'assets/fonts/poplar-std-black_0.png', 'assets/fonts/poplar-std-black.fnt');
    this.load.text('wordlist', 'assets/english1.txt');
  }


  create() {
    this.wordlist = this.cache.text.get('wordlist').split('\n');

    const replayBtn = new Phaser.GameObjects.Image(this, 200, HEIGHT - WORDBUTTON_CENTER_MARGIN_BOTTOM - WORDBUTTON_SIZE - WORDBUTTON_DISTANCE - 280 + 5 + 105, 'replayBtn' );
    this.add.existing(replayBtn);

    replayBtn.setInteractive({useHandCursor: true}).on('pointerdown', () => this.createQuestion() );

    const ideaBtn = new Phaser.GameObjects.Image(this, 200, HEIGHT - WORDBUTTON_CENTER_MARGIN_BOTTOM - WORDBUTTON_SIZE - WORDBUTTON_DISTANCE - 280 + 5 + 185, 'ideaBtn' );
    this.add.existing(ideaBtn);

    ideaBtn.setInteractive({useHandCursor: true}).on('pointerdown', () => this.onClickIdea() );


    this.add.image(200, HEIGHT - WORDBUTTON_CENTER_MARGIN_BOTTOM - WORDBUTTON_SIZE - WORDBUTTON_DISTANCE - 280 + 5 -10, 'star');
    this.scoreText = new Phaser.GameObjects.BitmapText(this, 200 + 50, HEIGHT - WORDBUTTON_CENTER_MARGIN_BOTTOM - WORDBUTTON_SIZE - WORDBUTTON_DISTANCE - 280 - 30, 'poplar', '0');
    this.scoreText.setOrigin(0, 0);
    this.scoreText.setLetterSpacing(10);
    this.scoreText.setFontSize(64);
    this.scoreText.tint = 0xf9e934;
    this.add.existing(this.scoreText);

    this.lines = [];
    for (let i = 0; i<4; i++) {
      const line = new Phaser.GameObjects.Line(this, 0, 0);
      line.setStrokeStyle(100, 0xffffff, 1);
      line.setLineWidth(10, 10);
      line.setDisplayOrigin(0, 0);
      this.add.existing(line);
      this.lines.push(line);
    }


    const wordbutton1 = new WordButton(this, 0, WIDTH / 2 - WORDBUTTON_DISTANCE - WORDBUTTON_SIZE/2, HEIGHT - WORDBUTTON_CENTER_MARGIN_BOTTOM - WORDBUTTON_SIZE - WORDBUTTON_DISTANCE, WORDBUTTON_SIZE, 'wordbutton', this.randomColor(), 'poplar', 'W');
    this.add.existing(wordbutton1);
    const wordbutton2 = new WordButton(this, 1, WIDTH / 2 + WORDBUTTON_DISTANCE + WORDBUTTON_SIZE/2, HEIGHT - WORDBUTTON_CENTER_MARGIN_BOTTOM - WORDBUTTON_SIZE - WORDBUTTON_DISTANCE, WORDBUTTON_SIZE, 'wordbutton', this.randomColor(), 'poplar', 'O');
    this.add.existing(wordbutton2);
    const wordbutton3 = new WordButton(this, 2, WIDTH / 2 + WORDBUTTON_DISTANCE + WORDBUTTON_SIZE/2, HEIGHT - WORDBUTTON_CENTER_MARGIN_BOTTOM + WORDBUTTON_DISTANCE, WORDBUTTON_SIZE, 'wordbutton', this.randomColor(), 'poplar', 'D');
    this.add.existing(wordbutton3);
    const wordbutton4 = new WordButton(this, 3, WIDTH / 2 - WORDBUTTON_DISTANCE - WORDBUTTON_SIZE/2, HEIGHT - WORDBUTTON_CENTER_MARGIN_BOTTOM + WORDBUTTON_DISTANCE, WORDBUTTON_SIZE, 'wordbutton', this.randomColor(), 'poplar', 'R');
    this.add.existing(wordbutton4);

    this.wordButtons = [wordbutton1, wordbutton2, wordbutton3, wordbutton4];

    const resultBox = new Phaser.GameObjects.Image(this, WIDTH/2, HEIGHT - WORDBUTTON_CENTER_MARGIN_BOTTOM - WORDBUTTON_SIZE - WORDBUTTON_DISTANCE - 150, 'resultbox');
    resultBox.setDisplaySize(800, 120);
    this.add.existing(resultBox);

    this.currentAnswerText = new Phaser.GameObjects.BitmapText(this, WIDTH/2, HEIGHT - WORDBUTTON_CENTER_MARGIN_BOTTOM - WORDBUTTON_SIZE - WORDBUTTON_DISTANCE - 150 + 5, 'poplar', 'aabbccddeegghh');
    this.currentAnswerText.setOrigin(0.5, 0.5);
    this.currentAnswerText.setLetterSpacing(10);
    this.add.existing(this.currentAnswerText);

    this.resultAnswerText = new Phaser.GameObjects.BitmapText(this, WIDTH/2, HEIGHT - WORDBUTTON_CENTER_MARGIN_BOTTOM - WORDBUTTON_SIZE - WORDBUTTON_DISTANCE - 280 + 5, 'poplar', '');
    this.resultAnswerText.setOrigin(0.5, 0.5);
    this.resultAnswerText.setLetterSpacing(10);
    this.add.existing(this.resultAnswerText);


    this.words = [];
    this.score = 0;
    this.countPlay = 0;

    chrome.storage.sync.get(['score', 'countplay'], (result) => {
      this.score = result.score? result.score : 0;
      this.scoreText.setText('' + this.score);
      this.countPlay = result.countPlay? result.countPlay : 0;
    });
    this.scoreText.setText('' + this.score);
    this.wordpushed = [];

    this.question = '';
    this.lastpoint = null;
    this.isPlaying = false;
    this.createQuestion();
  }

  createQuestion() {
    let question = this.wordlist[Math.floor(Math.random(this.wordlist.length)*this.wordlist.length)];

    while (question.length >=6 && (this.score < 10 || this.countPlay%3 !=0)) {
      question = this.wordlist[Math.floor(Math.random(this.wordlist.length)*this.wordlist.length)];
    }

    const n = question.length;
    const idxs = [];
    while (idxs.length < 4) {
      const rd = Math.floor(Math.random()*n);
      if (!idxs.includes(rd)) {
        idxs.push(rd);
      }
    }
    this.words = [];
    this.wordpushed = [];
    for (let i = 0; i< n; i++) {
      this.words.push(question[i]);
    }
    for (let i = 0; i< 4; i++) {
      this.wordButtons[i].setChar(this.words[idxs[i]]);
      this.words[idxs[i]] = '_';
    }
    this.resultAnswerText.setText('');
    for (let i = 0; i< this.lines.length; i++) {
      this.lines[i].setTo(0, 0, 0, 0);
    }
    this.question = question;
    this.buildResultText();
    this.countPlay += 1;
    this.isPlaying = true;
    chrome.storage.sync.set({countPlay: this.countPlay}, function() {

    });
  }
  randomColor() {
    return COLORLIST[Math.floor(Math.random(COLORLIST.length)*COLORLIST.length)];
  }


  onClickWordButton(id, x, y) {
    if (this.isPlaying) {
      if (this.wordpushed.includes(id)) {
        if (id == this.wordpushed[this.wordpushed.length-1]) {
          if (this.wordpushed.length>1) {
            const line = this.lines[this.wordpushed.length-2];
            line.setTo(0, 0, 0, 0);
          }

          this.wordpushed.pop();
        }
      } else {
        this.wordpushed.push(id);
        if (this.wordpushed.length >1) {
          const prev = this.wordButtons[this.wordpushed[this.wordpushed.length-2]];
          const next = this.wordButtons[this.wordpushed[this.wordpushed.length-1]];
          const line = this.lines[this.wordpushed.length-2];
          line.setTo(prev.x, prev.y, next.x, next.y);
        }
      }
      if (this.wordpushed.length == 4) {
        this.isPlaying = false;
        const resultString = this.getResultText();
        const corrected = iterativeFunction(this.wordlist, resultString );
        if (corrected) {
          this.resultAnswerText.setText('Correct!!!');
          this.resultAnswerText.setTint(0xc11540);
          this.resultAnswerText.setFontSize(108);
          this.resultAnswerText.setOrigin(0.5, 0.5);
          this.score += 1;
          this.updateScoreText();
          chrome.storage.sync.set({score: this.score}, function() {

          });
          const tween = this.tweens.add({
            targets: this.resultAnswerText,
            alpha: 0.3,
            ease: 'Linear', // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 250,
            repeat: 2, // -1: infinity
            yoyo: true,
          });
          tween.play();

          this.time.addEvent({
            delay: 1000,
            loop: false,
            callback: () => {
              this.createQuestion();
            },
          });
        } else {
          this.resultAnswerText.setText('The answer is ' + this.question);
          this.resultAnswerText.setTint(0x210e13);
          this.resultAnswerText.setAlpha(0);
          this.resultAnswerText.setFontSize(72);
          this.resultAnswerText.setOrigin(0.5, 0.5);
          const tween = this.tweens.add({
            targets: this.resultAnswerText,
            alpha: 1,
            ease: 'Linear', // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 500,
            repeat: 0, // -1: infinity

          });
          tween.play();

          this.time.addEvent({
            delay: 1500,
            loop: false,
            callback: () => {
              this.createQuestion();
            },
          });
        }
      }

      this.buildResultText();
    }
  }

  onClickIdea() {
    this.isPlaying = false;
    this.resultAnswerText.setText('The answer is ' + this.question);
    this.resultAnswerText.setTint(0x210e13);
    this.resultAnswerText.setAlpha(0);
    this.resultAnswerText.setFontSize(72);
    this.resultAnswerText.setOrigin(0.5, 0.5);
    const tween = this.tweens.add({
      targets: this.resultAnswerText,
      alpha: 1,
      ease: 'Linear', // 'Cubic', 'Elastic', 'Bounce', 'Back'
      duration: 500,
      repeat: 0, // -1: infinity

    });
    tween.play();

    this.time.addEvent({
      delay: 1500,
      loop: false,
      callback: () => {
        this.createQuestion();
      },
    });
  }
  buildResultText() {
    const s = this.getResultText();

    this.currentAnswerText.setText(s);
  }

  updateScoreText() {
    this.scoreText.setText('' + this.score);
  }

  getResultText() {
    let s = '';
    let j = 0;
    for (let i = 0; i< this.words.length; i++) {
      if (this.words[i] == '_') {
        if (this.wordpushed.length>j) {
          s = s + this.wordButtons[this.wordpushed[j]].text;
          j = j+1;
        } else {
          s = s + this.words[i];
        }
      } else {
        s = s + this.words[i];
      }
    }
    return s;
  }
}

class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    this.startGame();
  }

  startGame() {
    this.scene.start('GameShare');
  }
}


const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  parent: 'content-game',
  scale: {
    scaleMode: Phaser.Scale.ScaleModes.FIT,
  },
  backgroundColor: '#f1cd93',

  scene: [Preloader, GameShare],
};

new Phaser.Game(config);
