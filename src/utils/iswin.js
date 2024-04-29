import { gameState } from './types.js'

export const isWin = (instance, field) => {
	const isAllElementsEquel = (arr, type, i) => {
		if(arr.every(item => item !== '#' && item === arr[0]) && instance.state === gameState.play) {
			console.log(`${type} ${i + 1} wins`);
			instance.state = gameState.finish;
		}
	}

	// rows
	field.forEach((row, i) => {
		isAllElementsEquel(row, 'row', i)
	})

	// cols
	for (let j = 0; j < field.length; j++) {
		let col = [];
		for (let i = 0; i < field.length; i++) {
			col.push(field[i][j])
		}
		isAllElementsEquel(col, 'col', j)
	}

	//diagonals
	let diagonal1 = []
	let diagonal2 = []
	field.forEach((row, i) => {
		diagonal1.push(row[i])
		diagonal2.push(row[row.length - i - 1])
	})
	isAllElementsEquel(diagonal1, 'diagonal', 0)
	isAllElementsEquel(diagonal2, 'diagonal', 1)
}
