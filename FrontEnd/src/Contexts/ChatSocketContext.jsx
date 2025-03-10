import {
	createContext,
	useContext,
	useCallback,
	useRef,
	useState,
} from 'react';
import useWebSocket from '../CustomHooks/useWebSocket';
import { useChat } from './ChatContext';

// Create a context for the chat WebSocket
const ChatSocketContext = createContext();

export const ChatSocketProvider = ({ children }) => {
	const {
		currentChat,
		setNewMessages,
		manageUserOnlineStatus,
		setInitialUserStatus,
		setIsTypingStatus,
		isTyping,
		setIsTyping,
	} = useChat();

	const { isConnected, sendMessage, reconnect } = useWebSocket(
		`chat`, // key
		`chat`, // URL
		(event) => handleIncomingMessage(event), // On message received
		() => handleSocketOpen(), // On WebSocket open
		() => handleSocketClose(), // On WebSocket close
		(error) => handleSocketError(error) // On WebSocket error
	);

	// Handle WebSocket open connection
	const handleSocketOpen = () => {
		// isConnected.current = true;
		// setIsConnected(true);
		console.log('WebSocket connected');
	};

	// Handle WebSocket close connection
	const handleSocketClose = () => {
		// isConnected.current = false;
		// setIsConnected(false);

		console.log('WebSocket disconnected');
	};

	// Handle WebSocket errors
	const handleSocketError = (error) => {
		// isConnected.current = false;
		// setIsConnected(false);

		console.error('WebSocket error:', error);
	};

	// Handle incoming messages from WebSocket
	const handleIncomingMessage = (event) => {
		const { message: newMessage } = JSON.parse(event.data);

		switch (newMessage.type) {
			case 'text':
			case 'acknowledgement':
			case 'shared-post':
				setNewMessages(newMessage);
				break;

			case 'userStatus': // Status of a single user (online/offline)
				manageUserOnlineStatus(newMessage);
				break;

			case 'isOnline': // Status check for all recent chats on page load
				setInitialUserStatus(newMessage.users);
				break;

			case 'typing':
				setIsTypingStatus(newMessage);
				break;

			default:
				console.warn('Unhandled message type:', newMessage.type);
		}
	};

	// Explicit method to send a message
	const sendChatMessage = useCallback(
		(message) => {
			// Validate currentChat
			const chat_room_id = message.chat_room_id || currentChat?.id;

			if (!chat_room_id) {
				console.error('Chat room ID is missing or invalid.');
				return;
			}

			const data = {
				message,
				chat_room_id: chat_room_id,
				timestamp: new Date(),
			};

			if (isConnected) {
				sendMessage(data);
			} else {
				console.error('Cannot send message: WebSocket not connected.');
			}
		},
		[isConnected, sendMessage, currentChat]
	);

	const sendIsTypingMessage = useCallback(() => {
		const message = {
			type: 'typing',
			is_typing: true,
			chat_room_id: currentChat.id,
		};

		if (!isTyping) sendChatMessage(message);
		setIsTyping(true);
		// Clear the previous timeout if it exists
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}

		// Set a new timeout
		typingTimeoutRef.current = setTimeout(() => {
			stopTyping();
		}, 2000);
	}, [isConnected, currentChat]);

	// Ref to store the timeout ID
	const typingTimeoutRef = useRef(null);

	// Debounced function to stop typing after 2 seconds
	const stopTyping = () => {
		const message = {
			type: 'typing',
			is_typing: false,
			chat_room_id: currentChat.id,
		};
		setIsTyping(false);
		sendChatMessage(message);
	};
	// Return context value
	return (
		<ChatSocketContext.Provider
			value={{
				isConnected,
				reconnect,
				sendChatMessage,
				sendIsTypingMessage,
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
