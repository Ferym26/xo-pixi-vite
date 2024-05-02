import { Container, Graphics, Sprite, Texture } from 'pixi.js';

import { playerType } from '../utils/types.js';

export class UI {
	constructor(opt) {
		this.instance = opt.instance;
		this.scene = opt.scene;
		this.size = opt.size;
		
		this.ui = new Container();
		this.button = new Sprite(Texture.from('/images/btn-restart.png'));

		this.scene.addChild(this.ui);
		this.drawBackdrop();
		this.drowRestartBtn();
		this.drowWinnerTitle(playerType.P1);

		this.events();
	}

	showUI() {
		this.ui.visible = true;
	}

	hideUI() {
		this.ui.visible = false;
	}

	drawBackdrop() {
		this.bg = new Graphics();
		this.bg.fill('#000');
		this.bg.rect(0, 0, this.size, this.size);
		this.bg.fill();
		this.bg.alpha = 0.8;
		this.bg.x = 0;
		this.bg.y = 0;
		this.ui.addChild(this.bg);
	}

	drowRestartBtn() {
		this.button.interactive = true;
		this.button.x = this.scene.width / 2;
		this.button.y = this.scene.height / 2 + 50;
		this.button.anchor.set(0.5);
		this.ui.addChild(this.button);
	}

	drowWinnerTitle(player) {
		this.winner = new Sprite(Texture.from(`/images/winner-${player === playerType.P1 ? 'x' : 'o'}.png`));
		this.winner.x = this.scene.width / 2;
		this.winner.y = this.scene.height / 2 - 100;
		this.winner.anchor.set(0.5);
		this.ui.addChild(this.winner);
	}

	events() {
		this.button.on('pointerdown', (data) => {
			this.instance.restartGame();
			this.hideUI();
		});
	}
}