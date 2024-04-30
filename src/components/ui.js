import { Container, Graphics, Sprite, Texture } from 'pixi.js';

export class UI {
	constructor(opt) {
		this.scene = opt.scene;
		this.size = opt.size;
		
		this.ui = new Container();
		this.icon = new Sprite(Texture.from('/images/btn-restart.png'));
		
		this.scene.addChild(this.ui);
		this.drawBackdrop();
		this.drowRestartBtn();
	}

	drawBackdrop() {
		this.bg = new Graphics();
		this.bg.fill('#000');
		this.bg.rect(0, 0, this.size, this.size);
		this.bg.fill();
		this.bg.alpha = 0.7;
		this.bg.x = 0;
		this.bg.y = 0
		this.ui.addChild(this.bg);
	}

	drowRestartBtn() {
		console.log(this.scene.width);
		this.icon.x = this.scene.width / 2;
		this.icon.y = this.scene.height / 2 + 50;
		this.icon.anchor.set(0.5);
		this.ui.addChild(this.icon);
	}
}