import { useCallback, useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import websocketService from '../Services/WebSocketService';

const useWebSocket = (key, url, onMessage, onOpen, onClose, onError) => {
	const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
	const [isConnected, setIsConnected] = useState(false);
	const retryCount = useRef(0);
	const maxRetries = 5;

	const connectSocket = useCallback(() => {
		if (!isAuthenticated || !url) return;

		const socket = websocketService.connect(
			url,
			(event) => {
				setIsConnected(true);
				retryCount.current = 0; // Reset retry count on successful connection
				onMessage?.(event);
			},
			() => {
				setIsConnected(true);
				retryCount.current = 0;
				onOpen?.();
			},
			() => {
				setIsConnected(false);
				if (retryCount.current < maxRetries) {
					const delay = Math.min(
						5000 * (retryCount.current + 1),
						30000
					);
					setTimeout(() => {
						retryCount.current += 1;
						connectSocket();
					}, delay);
				}
				onClose?.();
			},
			(error) => {
				setIsConnected(false);
				onError?.(error);
			},
			key
		);

		return socket;
	}, [key, url, isAuthenticated]);

	// Establish WebSocket connection on mount
	useEffect(() => {
		const socket = connectSocket();

		return () => {
			if (socket) websocketService.closeSocket(key);
		};
	}, [connectSocket]);

	// Manual reconnect function
	const reconnect = useCallback(() => {
		retryCount.current = 0;
		connectSocket();
		console.log('retrying connection');
	}, [connectSocket]);

	// Function to send messages
	const sendMessage = useCallback(
		(message) => {
			if (isAuthenticated && isConnected) {
				websocketService.sendMessage(key, message);
			} else {
				console.warn('Cannot send message: WebSocket not connected.');
			}
		},
		[key, isAuthenticated, isConnected]
	);

	return { isConnected, sendMessage, reconnect };
};

export default useWebSocket;
