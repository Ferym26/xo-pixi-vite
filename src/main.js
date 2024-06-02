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
		this.tileArr = [];

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
		console.log('tiles', this.tileArr);
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

	// создание прокси для отслеживания изменений в матрице
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
		let highIndex = null;

		if(this.playerSteps[player].length === 3) {
			const coordFirstStep = this.playerSteps[player][0];
			const index = coordFirstStep[1] * 3 + coordFirstStep[0];
			highIndex = index;
			this.playerSteps[player].shift();
			this.playerSteps[player].push(coordsArr);
			this.matrix[coordFirstStep[1]][coordFirstStep[0]] = tileType.empty;
			if (highIndex === index) {
				this.tileArr[index].setDefaultView();
			}
		} else {
			this.playerSteps[player].push(coordsArr);
		}

		if(this.playerSteps[player].length === 3) {
			const coordFirstStep = this.playerSteps[player][0];
			const index = coordFirstStep[1] * 3 + coordFirstStep[0];
			if (highIndex != index) {
				this.highlightLast(index);
			}
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
		console.log(this.activePlayer);
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
				this.tileArr.push(
					new Tile({
						model: this,
						scene: this.field,
						type: item,
						x: j * 120,
						y: i * 120,
						coordinates: [j, i],
					})
				);
			})
		});
	}

	updateField() {
		this.matrix.forEach((row, i) => {
			row.forEach((item, j) => {
				const index = i * 3 + j;
				if(this.tileArr.length) {
					this.tileArr[index].setType(item);
				}
			})
		});
	}

	highlightLast(index) {
		this.tileArr[index].setPreHiddenView();
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

	init() {
		this.initView();

		assetsLoader.load()
			.then(() => {
				// this.model.bd.getData();
				this.drowBg();
				this.drowTiles();
				this.drawUI();

				this.events();
			})
			.catch((error) => {
				console.error(error);
			});
	}
}

const model = new XOGameModel();
model.init()
