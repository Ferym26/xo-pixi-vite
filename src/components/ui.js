import { Container, Graphics } from 'pixi.js';

export class UI {
	constructor(opt) {
		this.scene = opt.scene;
		this.ui = new Graphics();
		this.size = opt.size;

		this.draw();
	}

	draw() {
		this.ui.fill('0x00ff00');
		this.ui.rect(0, 0, this.size, this.size);
		this.ui.fill();
		this.ui.x = 0;
		this.ui.y = 0
		this.scene.addChild(this.ui);
	}
}