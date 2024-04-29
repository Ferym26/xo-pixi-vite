import { Sprite, Texture } from "pixi.js";

export class Bg {
	constructor(opt) {
		this.scene = opt.scene;
		this.bg = new Sprite(Texture.from('/images/field.png'));

		this.draw();
	}

	async draw() {
		this.bg.x = 0;
		this.bg.y = 0
		this.scene.addChild(this.bg);
	}
}