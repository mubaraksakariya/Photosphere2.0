import React, { createContext, useContext, useEffect, useState } from 'react';
import useMessages from '../CustomHooks/useMessages';
import { useQueryClient } from '@tanstack/react-query';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
	const [currentChat, setCurrentChat] = useState(null);
	const [isGroup, setIsGroup] = useState(false);
	const [chatRoomMessages, setChatRoomMessages] = useState([]);
	const [noneChatRoomMessages, setNoneChatRoomMessages] = useState([]);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		error,
	} = useMessages(currentChat?.id);

	const selectChat = (chat) => {
		setCurrentChat(chat);
		setIsGroup(chat.is_group);
		setChatRoomMessages([]);
	};

	const clearChat = () => {
		setCurrentChat(null);
		setChatRoomMessages([]);
	};

	const queryClient = useQueryClient();
	const setNewMessages = (newMessage) => {
		if (currentChat && newMessage.chat_room === currentChat.id) {
			setChatRoomMessages((prevMessages) => [
				...prevMessages,
				newMessage,
			]);
			// Update messages in React Query cache
			queryClient.setQueryData(
				['messages', currentChat.id],
				(oldData) => {
					if (!oldData) return oldData;

					return {
						...oldData,
						pages: oldData.pages.map((page, index) =>
							index === oldData.pages.length - 1 // Append only to the last page
								? {
										...page,
										results: [newMessage, ...page.results],
								  }
								: page
						),
					};
				}
			);
		} else {
			// Store messages for other chat rooms separately
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
				data,
				hasNextPage,
				isLoading,
				isError,
				isFetchingNextPage,
				error,
				isGroup,
				chatRoomMessages,
				noneChatRoomMessages,
				selectChat,
				clearChat,
				setChatRoomMessages,
				setNewMessages,
				getMessagesForChatRoom,
				fetchNextPage,
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
