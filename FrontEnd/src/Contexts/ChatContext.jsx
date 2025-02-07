import React, { createContext, useContext, useCallback, useMemo } from 'react';
import useMessages from '../CustomHooks/useMessages';
import { useQueryClient } from '@tanstack/react-query';

// Create a context for the chat
const ChatContext = createContext();

// ChatProvider component to manage chat-related state and logic
export const ChatProvider = ({ children }) => {
	// State for managing the current chat, group status, messages, online users, and typing indicators
	const [currentChat, setCurrentChat] = React.useState(null);
	const [isGroup, setIsGroup] = React.useState(false);
	const [chatRoomMessages, setChatRoomMessages] = React.useState([]);
	const [noneChatRoomMessages, setNoneChatRoomMessages] = React.useState([]);
	const [onlineUsers, setOnlineUsers] = React.useState({});
	const [whoIsTyping, setWhoIsTyping] = React.useState({});
	const [isTyping, setIsTyping] = React.useState(false);

	// Fetch messages for the current chat using a custom hook
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		error,
	} = useMessages(currentChat?.id);

	// Access the query client for managing React Query cache
	const queryClient = useQueryClient();

	// Function to select a chat and reset related state
	const selectChat = useCallback((chat) => {
		if (!chat) {
			console.error('No chat provided to selectChat');
			return;
		}
		setCurrentChat(chat);
		setIsGroup(chat.is_group);
		setChatRoomMessages([]); // Reset messages for the new chat
	}, []);

	// Function to clear the current chat and its messages
	const clearChat = useCallback(() => {
		setCurrentChat(null);
		setChatRoomMessages([]);
	}, []);

	// Function to add a new message to the appropriate state and update the React Query cache

	const setNewMessages = useCallback(
		(newMessage) => {
			if (!newMessage) {
				console.error('No message provided to setNewMessages');
				return;
			}

			// Add the message to the current chat's messages if it belongs to the current chat
			if (currentChat && newMessage.chat_room === currentChat.id) {
				setChatRoomMessages((prevMessages) => {
					// Avoid adding duplicate messages
					if (!prevMessages.some((msg) => msg.id === newMessage.id)) {
						return [...prevMessages, newMessage];
					}
					return prevMessages;
				});

				// Update the React Query cache for the current chat's messages
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
											results: [
												newMessage,
												...page.results,
											],
									  }
									: page
							),
						};
					}
				);
			} else {
				// Add the message to the noneChatRoomMessages state for other chats
				setNoneChatRoomMessages((prevMessages) => {
					if (!prevMessages.some((msg) => msg.id === newMessage.id)) {
						return [...prevMessages, newMessage];
					}
					return prevMessages;
				});
			}
		},
		[currentChat, queryClient]
	);

	// Function to retrieve messages for a specific chat room
	const getMessagesForChatRoom = useCallback(
		(chatRoomId) => {
			if (!chatRoomId) {
				console.error(
					'No chat room ID provided to getMessagesForChatRoom'
				);
				return [];
			}

			const currentChatRoomMessages = chatRoomMessages.filter(
				(message) => message.chat_room === chatRoomId
			);
			const otherChatRoomMessages = noneChatRoomMessages.filter(
				(message) => message.chat_room === chatRoomId
			);
			return [...currentChatRoomMessages, ...otherChatRoomMessages];
		},
		[chatRoomMessages, noneChatRoomMessages]
	);

	// Function to check if a user is online
	const isOnline = useCallback(
		(userId) => {
			return onlineUsers[userId] === true;
		},
		[onlineUsers]
	);

	// Function to initialize the online status of users
	const setInitialUserStatus = useCallback((initialUserStatus) => {
		if (!initialUserStatus || !Array.isArray(initialUserStatus)) {
			console.error('Invalid initialUserStatus provided');
			return;
		}

		setOnlineUsers((old) => {
			const newUsers = { ...old };
			initialUserStatus.forEach((userId) => {
				newUsers[userId] = true;
			});
			return newUsers;
		});
	}, []);

	// Function to update the online status of a user based on WebSocket messages
	const manageUserOnlineStatus = useCallback((newMessage) => {
		if (!newMessage || !newMessage.user_id) {
			console.error(
				'Invalid newMessage provided to manageUserOnlineStatus'
			);
			return;
		}

		const { status, user_id: userId } = newMessage;

		setOnlineUsers((prev) => {
			const newUsers = { ...prev };

			if (status === 'online') {
				newUsers[userId] = true; // Mark user as online
			} else {
				delete newUsers[userId]; // Remove user from online list
			}

			return newUsers;
		});
	}, []);

	// Function to update the typing status of a user
	const setIsTypingStatus = useCallback((newMessage) => {
		if (!newMessage || !newMessage.user_id) {
			console.error('Invalid newMessage provided to setIsTypingStatus');
			return;
		}

		const { user_id, is_typing } = newMessage;
		console.log(user_id, is_typing);

		setWhoIsTyping((old) => {
			if (old[user_id] !== is_typing) {
				const allUsers = { ...old };
				if (is_typing) {
					allUsers[user_id] = true; // Mark user as typing
				} else {
					delete allUsers[user_id]; // Remove user from typing list
				}
				return allUsers;
			}
			return old; // Avoid unnecessary state updates
		});
	}, []);

	// Function to check if a specific user is currently typing
	const getIsUserTyping = useCallback(
		(userId) => {
			return whoIsTyping[userId] === true;
		},
		[whoIsTyping]
	);

	// Memoized context value to avoid unnecessary re-renders
	const contextValue = useMemo(
		() => ({
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
			onlineUsers,
			whoIsTyping,
			selectChat,
			clearChat,
			setChatRoomMessages,
			setNewMessages,
			getMessagesForChatRoom,
			fetchNextPage,
			isOnline,
			manageUserOnlineStatus,
			setInitialUserStatus,
			setIsTypingStatus,
			getIsUserTyping,
			isTyping,
			setIsTyping,
		}),
		[
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
			onlineUsers,
			whoIsTyping,
			selectChat,
			clearChat,
			setNewMessages,
			getMessagesForChatRoom,
			fetchNextPage,
			isOnline,
			manageUserOnlineStatus,
			setInitialUserStatus,
			setIsTypingStatus,
			getIsUserTyping,
			isTyping,
			setIsTyping,
		]
	);

	// Provide the context value to the component tree
	return (
		<ChatContext.Provider value={contextValue}>
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
