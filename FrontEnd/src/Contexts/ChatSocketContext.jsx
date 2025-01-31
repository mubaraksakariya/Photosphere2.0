import { createContext, useContext, useCallback, useRef } from 'react';
import useWebSocket from '../CustomHooks/useWebSocket';
import { useChat } from './ChatContext';
// import { useDispatch, useSelector } from 'react-redux';
// import { setMessages } from '../Store/Slices/ChatSlice';

// Create a context for the chat WebSocket
const ChatSocketContext = createContext();

export const ChatSocketProvider = ({ children }) => {
	const isConnected = useRef(false);
	const { currentChat, setNewMessages } = useChat();
	// const { currentChat } = useSelector((state) => state.chat);
	// const dispatch = useDispatch();
	const { sendMessage } = useWebSocket(
		`chat`, // key
		`chat`, // URL
		(event) => handleIncomingMessage(event), // On message received
		() => handleSocketOpen(), // On WebSocket open
		() => handleSocketClose(), // On WebSocket close
		(error) => handleSocketError(error) // On WebSocket error
	);

	// Handle incoming messages from WebSocket
	const handleIncomingMessage = (event) => {
		const data = JSON.parse(event.data);
		// console.log(data.message);
		const newMessage = data.message;
		setNewMessages(newMessage);
	};

	// Handle WebSocket open connection
	const handleSocketOpen = () => {
		isConnected.current = true;
		console.log('WebSocket connected');
	};

	// Handle WebSocket close connection
	const handleSocketClose = () => {
		isConnected.current = false;
		console.log('WebSocket disconnected');
	};

	// Handle WebSocket errors
	const handleSocketError = (error) => {
		isConnected.current = false;
		console.error('WebSocket error:', error);
	};

	// Explicit method to send a message
	const sendChatMessage = useCallback(
		(message) => {
			// Validate currentChat
			if (!currentChat) {
				console.error('No active chat selected.');
				return;
			}

			if (!currentChat?.id) {
				console.error('Chat room ID is missing or invalid.');
				return;
			}

			const data = {
				message,
				chat_room_id: currentChat.id,
				timestamp: new Date(),
			};

			if (isConnected.current) {
				sendMessage(data);
			} else {
				console.error('Cannot send message: WebSocket not connected.');
			}
		},
		[isConnected, sendMessage, currentChat]
	);

	// Return context value
	return (
		<ChatSocketContext.Provider
			value={{
				isConnected,
				sendChatMessage,
			}}>
			{children}
		</ChatSocketContext.Provider>
	);
};

// Custom hook to use the ChatContext
export const useChatSocket = () => {
	const context = useContext(ChatSocketContext);
	if (!context) {
		throw new Error('useChatSocket must be used within a ChatProvider');
	}

	return context;
};
