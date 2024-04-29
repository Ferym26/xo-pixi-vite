import { Assets } from "pixi.js";

export class assetsLoader {
	static async load() {
		await Assets.load([
			'/images/field.png',
			'/images/cross.png',
			'/images/circle.png',
			'/images/empty.png',
		]);
	}
}
