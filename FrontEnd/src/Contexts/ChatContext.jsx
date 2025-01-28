import React, { createContext, useContext, useEffect, useState } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
	const [currentChat, setCurrentChat] = useState(null);
	const [isGroup, setIsGroup] = useState(false);
	const [messages, setMessages] = useState([]);

	const selectChat = (chat) => {
		setCurrentChat(chat);
		setIsGroup(chat.is_group);
		setMessages([]);
	};

	const clearChat = () => {
		setCurrentChat(null);
		setMessages([]);
	};

	// Return context value
	return (
		<ChatContext.Provider
			value={{
				currentChat,
				isGroup,
				messages,
				selectChat,
				clearChat,
				setMessages,
			}}>
			{children}
		</ChatContext.Provider>
	);
};

// Custom hook to use the ChatContext
export const useChat = () => {
	const context = useContext(ChatContext);

	if (!context) {
		throw new Error('useChat must be used within a ChatProvider');
	}

	return context;
};
