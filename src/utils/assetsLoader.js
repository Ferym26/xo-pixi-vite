import { Assets } from "pixi.js";

const assets = [
	'/images/field.png',
	'/images/cross.png',
	'/images/circle.png',
	'/images/empty.png',
	'/images/btn-restart.png',
	'/images/winner-o.png',
	'/images/winner-x.png',
];

export class assetsLoader {
	static async load() {
		await Assets.load(assets);
	}
}
