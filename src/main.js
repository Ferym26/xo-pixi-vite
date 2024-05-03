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

		this.activePlayer = playerType.P1; // playerType.P2
		this.state = gameState.play; // play finish
		this.matrix = [
			['#', '#', '#'],
			['#', '#', '#'],
			['#', '#', '#'],
		];
		this.fieldData = []; // массив всех плиток
		this.step = 0;
	}

	setTileType(data) {
		const x = data.target.coordinates[0];
		const y = data.target.coordinates[1];
		const index = y * 3 + x;
		this.step++;

		// меняем поле только если оно пустое и игра не закончилась
		if(this.matrix[x][y] !== tileType.empty || this.state !== gameState.play) {
			return;
		}

		if(this.step === 9) {
			//
		}

		if(this.activePlayer === playerType.P1) {
			this.fieldData[index].setType('x');
			this.matrix[x][y] = 'x';
		}

		if(this.activePlayer === playerType.P2) {
			this.fieldData[index].setType('o');
			this.matrix[x][y] = 'o';
		}

		this.changePlayer();
		isWin(this);
	}

	resetModel() {
		this.matrix.forEach((row, i) => {
			row.forEach((_, j) => {
				this.matrix[j][i] = tileType.empty;
			})
		});
	}

	restartGame() {
		this.resetModel();
		this.state = gameState.play;
	}

	changePlayer() {
		this.activePlayer === playerType.P1 ? this.activePlayer = playerType.P2 : this.activePlayer = playerType.P1
	}
}

class XOGameView {
	constructor(opt) {
		this.model = opt.model;
		this.app = new Application();
		this.scene = new Container();
		this.field = new Container();
		this.ui = null;
	}

	async initView() {
		await this.app.init({
			width: this.model.fieldSize,
			height: this.model.fieldSize,
			backgroundColor: this.model.fieldBGColor,
			antialias: true,
		})
		document.body.appendChild(this.app.canvas);

		this.scene.addChild(this.field)
		this.app.stage.addChild(this.scene);

		assetsLoader.load()
			.then(() => {
				this.drowBg();
				this.drowTiles();
				this.drawUI();
			})
			.catch((error) => {
				console.error(error);
			});
	}

	drowBg() {
		new Bg({scene: this.scene});
	}

	drowTiles() {
		this.model.matrix.forEach((row, i) => {
			row.forEach((item, j) => {
				this.model.fieldData.push(
					new Tile({
						model,
						scene: this.field,
						type: item,
						x: j * 120,
						y: i * 120,
						coordinates: [j, i],
					})
				)
			})
		});
	}

	drawUI() {
		this.ui = new UI({
			model,
			scene: this.scene,
			size: this.model.fieldSize,
		});

		// this.ui.showUI({title: 'P2'});
	}
}

class XOGameController {
	constructor(opt) {
		this.model = opt.model;
		this.view = opt.view;
	}

	init() {
		this.view.initView();
	}
}

const model = new XOGameModel();
const view = new XOGameView({model});
const controller = new XOGameController({model, view});

controller.init();
