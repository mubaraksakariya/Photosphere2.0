import { useEffect, useState } from 'react';
import { useChat } from '../../Contexts/ChatContext';

// Custom hook to track unread messages
const useUnreadMessages = (chatRoom) => {
	const { currentChat, getMessagesForChatRoom, noneChatRoomMessages } =
		useChat();
	const [unreadMessages, setUnreadMessages] = useState([]);

	useEffect(() => {
		if (!chatRoom?.id) return;
		if (currentChat?.id === chatRoom.id) {
			setUnreadMessages([]);
			return;
		}
		setUnreadMessages(getMessagesForChatRoom(chatRoom.id));
	}, [chatRoom, currentChat, noneChatRoomMessages, getMessagesForChatRoom]);

	return unreadMessages;
};

export default useUnreadMessages;
