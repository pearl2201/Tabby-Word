import Phaser from 'phaser';

class WordButton extends Phaser.GameObjects.Group {
  constructor(scene, id, x, y, size, image, color, font, text, ) {
    super(scene);
    this.scene = scene;
    this.id = id;
    this.x = x;
    this.y = y;
    this.text = text;
    const imageBtn = new Phaser.GameObjects.Image(scene, x, y, image);
    imageBtn.setDisplaySize(size, size);
    imageBtn.tint = color;
    imageBtn.setOrigin(0.5, 0.5);
    this.add(imageBtn, scene);

    this.textBtn = new Phaser.GameObjects.BitmapText(scene, x, y, font, text, 108);
    this.textBtn.setOrigin(0.5, 0.5);
    
    this.add(this.textBtn, scene);
    imageBtn.setInteractive({useHandCursor: true}).on('pointerover', () => this.enterButtonHoverState() )
        .on('pointerout', () => this.enterButtonRestState() )
        .on('pointerdown', () => this.enterButtonActiveState() )
        .on('pointerup', () => {
          this.enterButtonHoverState();
        });
    console.log('create word button success: ', x, y, size);
  }

  enterButtonHoverState() {
    // this.scene.updateClickCountText();
  }

  enterButtonRestState() {
    // this.scene.updateClickCountText();
  }

  enterButtonActiveState() {
    this.scene.onClickWordButton(this.id, this.x, this.y);
  }

  setChar(c) {
    this.textBtn.setText(c);
    this.text = c;
  }
}

export default WordButton;
