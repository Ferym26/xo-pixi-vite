import { Application, Container, Assets, Sprite, Texture, Graphics } from "pixi.js";

import { Tile } from './components/tile.js';
import { Bg } from './components/bg.js';
import { UI } from './components/ui.js';

import { tileType, gameState, playerType } from './utils/types.js'
import { assetsLoader } from './utils/assetsLoader.js';

import { WsService } from './services/ws.service.js';

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

		this.matrix = this.createMatrixProxy([
			['#', '#', '#'],
			['#', '#', '#'],
			['#', '#', '#'],
		]);
		this.playerSteps = {
			P1: [],
			P2: [],
		}
		this.step = 0;

		this.wsService = new WsService();
		this.wsService.on('dataReceived', this.updateMatrix.bind(this));
	}

	updateMatrix(data) {
		console.log('data', data);
		this.matrix[0][0] = data[0][0];
		this.matrix[0][1] = data[0][1];
		this.matrix[0][2] = data[0][1];
		this.matrix[1][0] = data[1][0];
		this.matrix[1][1] = data[1][1];
		this.matrix[1][2] = data[1][2];
		this.matrix[2][0] = data[2][0];
		this.matrix[2][1] = data[2][1];
		this.matrix[2][2] = data[2][2];
	}

	createMatrixProxy(matrix) {
		const self = this;
		function createHandler() {
			return {
				set(target, property, value) {
					target[property] = value;
					self.onMatrixChange(); // Вызов метода уведомления
					return true;
				}
			};
		}
		for (let i = 0; i < matrix.length; i++) {
			matrix[i] = new Proxy(matrix[i], createHandler());
		}
		return new Proxy(matrix, createHandler());
	}

	onMatrixChange() {
		this.updateField();
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

	setTileType(coords) {
		const x = coords[1];
		const y = coords[0];
		this.step++;

		// меняем поле только если оно пустое и игра не закончилась
		if(this.matrix[x][y] !== tileType.empty || this.state !== gameState.play) {
			return;
		}

		if(this.activePlayer === playerType.P1) {
			this.matrix[x][y] = 'x';
		}

		if(this.activePlayer === playerType.P2) {
			this.matrix[x][y] = 'o';
		}

		this.stepper(this.activePlayer, coords);
		this.isWin();
		this.changePlayer();
	}

	stepper(player, coordsArr) {
		const coordFirstStep = this.playerSteps[player][0];
		this.playerSteps[player].push(coordsArr);
		if(this.playerSteps[player].length > 3) {
			this.playerSteps[player].push(coordsArr);
			this.matrix[coordFirstStep[1]][coordFirstStep[0]] = '#';
			this.playerSteps[player].shift();
		}

		// подсвечивать клетку которая должна будет исчезнуть после сл хода
		if(this.playerSteps[player].length === 3) {
			// this.highlightLast(coordFirstStep);
		}
	}

	resetModel() {
		this.matrix.forEach((row, i) => {
			row.forEach((_, j) => {
				this.matrix[j][i] = tileType.empty;
			})
		});
	}

	restartGame() {
		this.step = 0;
		this.state = gameState.play;
		this.activePlayer = playerType.P1;
		this.resetModel();
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
		this.matrix.forEach((row, i) => {
			row.forEach((item, j) => {
				new Tile({
					model: this,
					scene: this.field,
					type: item,
					x: j * 120,
					y: i * 120,
					coordinates: [j, i],
				})
			})
		});
	}

	updateField() {
		this.matrix.forEach((row, i) => {
			row.forEach((item, j) => {
				const index = i * 3 + j;
				if(item === '#') {
					this.field.children[index].children[0].texture = Texture.from('/images/empty.png');
				}
				if(item === 'x') {
					this.field.children[index].children[0].texture = Texture.from('/images/cross.png');
				}
				if(item === 'o') {
					this.field.children[index].children[0].texture = Texture.from('/images/circle.png');
				}
			})
		});
	}

	highlightLast(coords) {
		const index = coords[1] * 3 + coords[0];
		this.field.children[index].children[0].scale.set(0.8);
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

	events() {
		this.field.children.forEach(field => {
			field.interactive = true;
			field.on('pointerdown', event => {
				this.setTileType(event.currentTarget.coordinates);
				this.wsService.sendData(this.matrix);
			});
		})
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
				// this.model.bd.getData();
				this.model.drowBg();
				this.model.drowTiles();
				this.model.drawUI();

				this.model.events();
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
const controller = new XOGameController({model});

controller.init();
