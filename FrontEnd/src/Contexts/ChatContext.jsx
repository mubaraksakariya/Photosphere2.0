import React, { createContext, useContext, useEffect, useState } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
	const [currentChat, setCurrentChat] = useState(null);
	const [isGroup, setIsGroup] = useState(false);
	const [chatRoomMessages, setChatRoomMessages] = useState([]);
	const [noneChatRoomMessages, setNoneChatRoomMessages] = useState([]);

	const selectChat = (chat) => {
		setCurrentChat(chat);
		setIsGroup(chat.is_group);
		setChatRoomMessages([]);
	};

	const clearChat = () => {
		setCurrentChat(null);
		setChatRoomMessages([]);
	};

	const setNewMessages = (newMessage) => {
		// console.log(newMessage);
		// console.log(currentChat);

		if (currentChat && newMessage.chat_room === currentChat.id) {
			setChatRoomMessages((prevMessages) => [
				...prevMessages,
				newMessage,
			]);
		} else {
			setNoneChatRoomMessages((prevMessages) => [
				...prevMessages,
				newMessage,
			]);
		}
	};

	const getMessagesForChatRoom = (chatRoomId) => {
		const currentChatRoomMessages = chatRoomMessages.filter(
			(message) => message.chat_room === chatRoomId
		);
		const otherChatRoomMessages = noneChatRoomMessages.filter(
			(message) => message.chat_room === chatRoomId
		);
		return [...currentChatRoomMessages, ...otherChatRoomMessages];
	};

	// Return context value
	return (
		<ChatContext.Provider
			value={{
				currentChat,
				isGroup,
				chatRoomMessages,
				noneChatRoomMessages,
				selectChat,
				clearChat,
				setChatRoomMessages,
				setNewMessages,
				getMessagesForChatRoom,
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
