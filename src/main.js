import { Application, Container, Assets, Sprite, Texture, Graphics } from "pixi.js";
import './styles/style.css';


const app = new Application();
await app.init({
	width: 360,
	height: 360,
	backgroundColor: 0xCCCCCC,
	antialias: true,
	// resizeTo: window,
})
document.body.appendChild(app.canvas);

const scene = new Container();
app.stage.addChild(scene);

// # o x
const field = [
	['o', '#', '#'],
	['#', '#', '#'],
	['#', '#', '#'],
]




await Assets.load([
	'/images/field.png',
	'/images/cross.png',
	'/images/circle.png',
	'/images/empty.png',
]);

let bg = new Sprite(Texture.from('/images/field.png'));
bg.x = 0;
bg.y = 0
scene.addChild(bg);

class Tile {
	constructor(opt) {
		this.size = 120;
		this.x = opt.x;
		this.y = opt.y;
		this.type = opt.type;
		this.rect = new Sprite(Texture.from('/images/empty.png'));
		this.coordinates = opt.coordinates;

		this.setType(this.type)
		this.drow();
		this.action();
	}

	drow() {
		this.rect.x = this.x;
		this.rect.y = this.y;
		this.rect.width = this.size;
		this.rect.height = this.size;
		scene.addChild(this.rect);
	}

	setType(type) {
		if(type === '#') {
			this.rect.texture = Texture.from('/images/empty.png');
		}
		if(type === 'x') {
			this.rect.texture = Texture.from('/images/cross.png');
		}
		if(type === 'o') {
			this.rect.texture = Texture.from('/images/circle.png');
		}
	}

	action() {
		this.rect.interactive = true;
		this.rect.on('pointerdown', () => {
			this.setType('x')
		});
	}
}


field.forEach((row, i) => {
	row.forEach((item, j) => {
		new Tile({
			type: item,
			x: j * 120,
			y: i * 120,
			coordinates: [j, i],
		})
	})
})