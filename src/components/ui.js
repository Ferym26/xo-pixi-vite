import { Container, Graphics, Sprite, Texture } from 'pixi.js';

import { playerType } from '../utils/types.js';

export class UI {
	constructor(opt) {
		this.model = opt.model;
		this.scene = opt.scene;
		this.size = opt.size;
		
		this.ui = new Container();
		this.ui.visible = false;
		this.button = new Sprite(Texture.from('/images/btn-restart.png'));

		this.scene.addChild(this.ui);
		this.drawBackdrop();
		this.drawRestartBtn();
		

		this.events();
	}

	showUI(data) {
		this.drawTitle(data.title);
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

	drawRestartBtn() {
		this.button.interactive = true;
		this.button.x = this.scene.width / 2;
		this.button.y = this.scene.height / 2 + 50;
		this.button.anchor.set(0.5);
		this.ui.addChild(this.button);
	}

	drawTitle(result) {
		const titleImage = () => {
			switch (result) {
				case playerType.P1:
					return 'winner-x.png';
				case playerType.P2:
					return 'winner-o.png';
				case 'draw':
					return 'draw.png';
				default:
					return 'draw.png';
			}
		}
		this.title = new Sprite(Texture.from(`/images/${titleImage()}`));
		this.title.x = this.scene.width / 2;
		this.title.y = this.scene.height / 2 - 100;
		this.title.anchor.set(0.5);
		this.ui.addChild(this.title);
	}

	events() {
		this.button.on('pointerdown', (data) => {
			this.model.restartGame();
			this.hideUI();
		});
	}
}