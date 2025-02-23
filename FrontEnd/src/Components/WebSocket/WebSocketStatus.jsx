import React, { useEffect, useState } from 'react';
import { useChatSocket } from '../../Contexts/ChatSocketContext';

const WebSocketStatus = () => {
	const [show, setShow] = useState(false);
	const { isConnected, reconnect } = useChatSocket(); // Get WebSocket status
	const handleRetry = () => {
		window.location.reload();
		// reconnect();
	};
	useEffect(() => {
		if (isConnected) {
			setShow(true);
			const timer = setTimeout(() => setShow(false), 2000);
			return () => clearTimeout(timer);
		} else {
			setShow(true);
		}
	}, [isConnected]);

	return (
		<div
			className={`fixed top-0 left-0 right-0 text-center py-1 text-sm font-medium transition-transform duration-500 ${
				show ? 'translate-y-0' : '-translate-y-full'
			} ${
				isConnected
					? 'bg-green-600 text-white'
					: 'bg-red-600 text-white'
			}`}>
			{isConnected ? 'Connected Successfully' : 'Disconnected from chat'}
			{!isConnected && (
				<button
					onClick={handleRetry}
					className='ml-3 text-white underline font-medium'>
					Retry
				</button>
			)}
		</div>
	);
};

export default WebSocketStatus;
