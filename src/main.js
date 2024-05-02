import { Application, Container, Assets, Sprite, Texture, Graphics } from "pixi.js";

import { Tile } from './components/tile.js';
import { Bg } from './components/bg.js';
import { UI } from './components/ui.js';

import { isWin } from './utils/iswin.js';
import { tileType, gameState, playerType } from './utils/types.js'
import { assetsLoader } from './utils/assetsLoader.js';

import './styles/style.css';


class XOGameModel {
	constructor() {
		this.fieldSize = 360;
		this.fieldBGColor = '#ccc';
	}
}

class XOGameView {
	constructor(opt) {
		this.model = opt.model;
		this.app = new Application();
	}

	async initView() {
		await this.app.init({
			width: this.model.fieldSize,
			height: this.model.fieldSize,
			backgroundColor: this.model.fieldBGColor,
			antialias: true,
		})
		document.body.appendChild(this.app.canvas);
	}
}

class XOGameController {
	constructor(opt) {
		this.model = opt.model;
		this.view = opt.view;
	}

	events() {

	}

	init() {
		this.view.initView();
	}
}

const model = new XOGameModel()
const view = new XOGameView({model})
const controller = new XOGameController({model, view});

controller.init();











class XOGame {
	constructor() {
		this.app = new Application();
		this.scene = new Container();
		this.field = new Container();
		this.fieldSize = 360;
		this.fieldBGColor = 0xCCCCCC;
		this.activePlayer = playerType.P1; // playerType.P2
		this.state = gameState.play; // play finish
		this.model = [
			['#', '#', '#'],
			['#', '#', '#'],
			['#', '#', '#'],
		];
		this.fieldData = []; // массив всех плиток

		this.init();
	}

	resetModel() {
		this.model.forEach((row, i) => {
			row.forEach((_, j) => {
				this.model[j][i] = tileType.empty;
			})
		});
	}

	changePlayer() {
		this.activePlayer === playerType.P1 ? this.activePlayer = playerType.P2 : this.activePlayer = playerType.P1
	}

	async init() {
		await this.app.init({
			width: this.fieldSize,
			height: this.fieldSize,
			backgroundColor: this.fieldBGColor,
			antialias: true,
		})
		document.body.appendChild(this.app.canvas);

		this.scene.addChild(this.field)
		this.app.stage.addChild(this.scene);

		assetsLoader.load()
			.then(() => {
				this.draw();
				this.events();
			})
			.catch((error) => {
				console.error(error)
			});
	}
	
	draw() {
		new Bg({scene: this.scene});
		// new UI({
		// 	instance: this,
		// 	scene: this.scene,
		// 	size: this.fieldSize,
		// });

		this.model.forEach((row, i) => {
			row.forEach((item, j) => {
				this.fieldData.push(
					new Tile({
						scene: this.field,
						type: item,
						x: j * 120,
						y: i * 120,
						coordinates: [j, i],
					})
				)
			})
		})
	}

	setTileType(data) {
		const x = data.target.coordinates[0];
		const y = data.target.coordinates[1];
		const index = y * 3 + x;

		// меняем поле только если оно пустое и игра не закончилась
		if(this.model[x][y] !== tileType.empty || this.state !== gameState.play) {
			return;
		}

		if(this.activePlayer === playerType.P1) {
			this.fieldData[index].setType('x');
			this.model[x][y] = 'x';
		}

		if(this.activePlayer === playerType.P2) {
			this.fieldData[index].setType('o');
			this.model[x][y] = 'o';
		}

		this.changePlayer();
	}

	restartGame() {
		this.resetModel();
		this.state = gameState.play;
	}

	events() {
		this.field.children.forEach((item, i) => {
			item.interactive = true;
			item.on('pointerdown', (data) => {
				this.setTileType(data);
				isWin(this, this.model);
			});
		})
	}
}

// const xoGame = new XOGame({});
