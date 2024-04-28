import { Application, Container, Assets, Sprite, Texture, Graphics } from "pixi.js";

export class resourceManager {
	constructor() {
		
	}

	async load() {
		await Assets.load([
			'/images/field.png',
			'/images/cross.png',
			'/images/circle.png',
			'/images/empty.png',
		]);
	}
}