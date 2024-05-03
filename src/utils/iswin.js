import { gameState } from './types.js'

export const isWin = model => {
	const isAllElementsEquel = (arr, type, i) => {
		if(arr.every(item => item !== '#' && item === arr[0]) && model.state === gameState.play) {
			console.log(`${type} ${i + 1} wins`);
			model.state = gameState.finish;
		}
	}

	// rows
	model.matrix.forEach((row, i) => {
		isAllElementsEquel(row, 'row', i)
	})

	// cols
	for (let j = 0; j < model.matrix.length; j++) {
		let col = [];
		for (let i = 0; i < model.matrix.length; i++) {
			col.push(model.matrix[i][j])
		}
		isAllElementsEquel(col, 'col', j)
	}

	//diagonals
	let diagonal1 = []
	let diagonal2 = []
	model.matrix.forEach((row, i) => {
		diagonal1.push(row[i])
		diagonal2.push(row[row.length - i - 1])
	})
	isAllElementsEquel(diagonal1, 'diagonal', 0)
	isAllElementsEquel(diagonal2, 'diagonal', 1)
}
