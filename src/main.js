import { Application, Container, Assets, Sprite, Texture, Graphics } from "pixi.js";

import { Tile } from './components/tile.js';
import { Bg } from './components/bg.js';
import { UI } from './components/ui.js';

import { tileType, gameState, playerType } from './utils/types.js'
import { assetsLoader } from './utils/assetsLoader.js';

import './styles/style.css';


class XOGameModel {
	constructor() {
		this.app = new Application();
		this.scene = new Container();
		this.field = new Container();
		this.ui = null;

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

	async initView() {
		await this.app.init({
			width: this.fieldSize,
			height: this.fieldSize,
			backgroundColor: this.fieldBGColor,
			antialias: true,
		})
		document.body.appendChild(this.app.canvas);

		this.scene.addChild(this.field)
		this.app.stage.addChild(this.scene);
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
			this.showUI({title: 'draw'});
		}

		if(this.activePlayer === playerType.P1) {
			this.fieldData[index].setType('x');
			this.matrix[x][y] = 'x';
		}

		if(this.activePlayer === playerType.P2) {
			this.fieldData[index].setType('o');
			this.matrix[x][y] = 'o';
		}

		this.isWin();
		this.changePlayer();
	}

	resetModel() {
		this.matrix.forEach((row, i) => {
			row.forEach((_, j) => {
				this.matrix[j][i] = tileType.empty;
				this.fieldData[j * 3 + i].setType('#');
			})
		});
	}

	restartGame() {
		this.step = 0;
		this.resetModel();
		this.state = gameState.play;
		
	}

	changePlayer() {
		this.activePlayer === playerType.P1 ? this.activePlayer = playerType.P2 : this.activePlayer = playerType.P1
	}

	isWin() {
		const isAllElementsEquel = (arr, type, i) => {
			if(arr.every(item => item !== '#' && item === arr[0]) && this.state === gameState.play) {
				console.log(`${type} ${i + 1} wins`);
				this.state = gameState.finish;
				this.showUI({title: this.activePlayer});
			}
		}
	
		// rows
		this.matrix.forEach((row, i) => {
			isAllElementsEquel(row, 'row', i)
		})
	
		// cols
		for (let j = 0; j < this.matrix.length; j++) {
			let col = [];
			for (let i = 0; i < this.matrix.length; i++) {
				col.push(this.matrix[i][j])
			}
			isAllElementsEquel(col, 'col', j)
		}
	
		//diagonals
		let diagonal1 = []
		let diagonal2 = []
		this.matrix.forEach((row, i) => {
			diagonal1.push(row[i])
			diagonal2.push(row[row.length - i - 1])
		})
		isAllElementsEquel(diagonal1, 'diagonal', 0)
		isAllElementsEquel(diagonal2, 'diagonal', 1)
	}

	drowBg() {
		new Bg({scene: this.scene});
	}

	drowTiles() {
		this.fieldData = [];
		this.matrix.forEach((row, i) => {
			row.forEach((item, j) => {
				this.fieldData.push(
					new Tile({
						model: this,
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
			model: this,
			scene: this.scene,
			size: this.fieldSize,
		});
	}

	showUI(data) {
		this.ui.showUI({title: data.title});
	}
}

class XOGameView {
	constructor(opt) {

	}
}

class XOGameController {
	constructor(opt) {
		this.model = opt.model;
		this.view = opt.view;
	}

	draw() {
		assetsLoader.load()
			.then(() => {
				this.model.drowBg();
				this.model.drowTiles();
				this.model.drawUI();
			})
			.catch((error) => {
				console.error(error);
			});
	}

	init() {
		this.model.initView();
		this.draw();
	}
}

const model = new XOGameModel();
const view = new XOGameView({model});
const controller = new XOGameController({model, view});

controller.init();
