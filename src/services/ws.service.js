import EventEmitter from 'eventemitter3';

export class WsService extends EventEmitter {
	constructor() {
		super();
		this.socket = new WebSocket('ws://localhost:8080');

		this.socket.addEventListener('open', () => {
			// console.log('Connected to the WebSocket server');
		});

		this.socket.addEventListener('message', (event) => {
			const data = JSON.parse(event.data);
			console.log('Message from server:', data);
			this.emit('dataReceived', data);
		});
	}

	sendData(matrix) {
		console.log('send', matrix);
		this.socket.send(JSON.stringify(matrix));
	}
}