import { Application, Container, Assets, Sprite, Texture, Graphics } from "pixi.js";

import { Tile } from './conponents/tile.js';
import { Bg } from './conponents/bg.js';
import { isWin } from './utils/iswin.js';

import './styles/style.css';

class XOGame {
	constructor() {
		this.activePlayer = 'P1'; // 'P2'
	}

	start() {
		// const bg = new Bg();
	}

	action() {

	}
}

const xoGame = new XOGame({});
xoGame.start();

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

await Assets.load([
	'/images/field.png',
	'/images/cross.png',
	'/images/circle.png',
	'/images/empty.png',
]);

const bg = new Bg({scene});


// # o x
const model = [
	['#', '#', '#'],
	['#', '#', '#'],
	['#', '#', '#'],
]
const fieldData = []













let activePlayer = 'P1';
const changePlayer = () => activePlayer === 'P1' ? activePlayer = 'P2' : activePlayer = 'P1';


model.forEach((row, i) => {
	row.forEach((item, j) => {
		fieldData.push(
			new Tile({
				scene,
				type: item,
				x: j * 120,
				y: i * 120,
				coordinates: [j, i],
			})
		)
	})
})

scene.children.forEach((item, i) => {
	item.interactive = true;
	item.on('pointerdown', (data) => {
		const x = data.target.coordinates[0];
		const y = data.target.coordinates[1];
		const index = y * 3 + x;

		if (activePlayer === 'P1') {
			fieldData[index].setType('x');
			model[x][y] = 'x';
		}

		if (activePlayer === 'P2') {
			fieldData[index].setType('o');
			model[x][y] = 'o';
		}

		changePlayer();
		isWin(model);
	});
})

