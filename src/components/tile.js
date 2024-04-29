import { Container, Sprite, Texture, Graphics } from "pixi.js";

export class Tile {
	constructor(opt) {
		this.scene = opt.scene;
		this.size = 120;
		this.x = opt.x;
		this.y = opt.y;
		this.type = opt.type;
		this.tile = new Container();
		this.rect = new Graphics()
		this.icon = new Sprite(Texture.from('/images/empty.png'));
		this.tile.coordinates = opt.coordinates;

		this.setType(this.type)
		this.drow();
	}

	drow() {
		this.rect.fill('transparent');
		this.rect.rect(0, 0, this.size, this.size);
		this.rect.fill();
		this.rect.x = this.x;
		this.rect.y = this.y;
		this.rect.width = this.size;
		this.rect.height = this.size;

		this.icon.width = 80;
		this.icon.height = 80;
		this.icon.x = this.x + 20;
		this.icon.y = this.y + 20;

		this.tile.addChild(this.icon);
		this.tile.addChild(this.rect);

		this.scene.addChild(this.tile);
	}

	setType(type) {
		if(type === '#') {
			this.icon.texture = Texture.from('/images/empty.png');
		}
		if(type === 'x') {
			this.icon.texture = Texture.from('/images/cross.png');
		}
		if(type === 'o') {
			this.icon.texture = Texture.from('/images/circle.png');
		}
	}
}