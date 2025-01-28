class WebSocketService {
	constructor() {
		this.sockets = {};
	}

	// Helper method to construct the WebSocket URL
	constructWebSocketUrl(url) {
		const token = JSON.parse(localStorage.getItem('token'));
		const webSocketBaseUrl = import.meta.env.VITE_SOCKET_ADDRESS;
		const wsUrl = new URL(`${webSocketBaseUrl}${url}/`);

		if (token) {
			wsUrl.searchParams.append('token', token.access);
		}

		return wsUrl.toString();
	}

	connect(url, onMessage, onOpen, onClose, onError, key) {
		// Return if any existing socket
		if (this.sockets[key]) {
			return this.sockets[key];
		}

		let socket;

		if (url && !url.includes('undefined')) {
			const wsUrl = this.constructWebSocketUrl(url);
			socket = new WebSocket(wsUrl);

			socket.onopen = (event) => {
				if (onOpen) onOpen(event);
			};

			socket.onmessage = (event) => {
				if (onMessage) onMessage(event);
			};

			socket.onclose = (event) => {
				if (onClose) onClose(event);
			};

			socket.onerror = (error) => {
				if (onError) onError(error);
			};

			// Register the new socket
			this.registerSocket(key, socket);
		}
		return socket;
	}

	sendMessage(key, message) {
		const socket = this.getSocket(key);
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send(JSON.stringify(message));
		} else {
			console.error(`Cannot send message, WebSocket ${key} is not open.`);
		}
	}

	registerSocket(key, socket) {
		this.sockets[key] = socket;
	}

	getSocket(key) {
		return this.sockets[key];
	}

	closeSocket(key) {
		if (this.sockets[key]) {
			const socket = this.sockets[key];
			if (
				socket.readyState !== WebSocket.CLOSED &&
				socket.readyState !== WebSocket.CONNECTING
			) {
				socket.close();
				delete this.sockets[key];
			}
		}
	}
}

const websocketService = new WebSocketService();
export default websocketService;
