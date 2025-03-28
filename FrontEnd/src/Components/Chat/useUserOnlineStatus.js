import { useEffect, useState } from 'react';
import { useChat } from '../../Contexts/ChatContext';
import { useChatSocket } from '../../Contexts/ChatSocketContext';

// Custom hook to check if user is online
const useUserOnlineStatus = (user, chatRoom) => {
	const { isOnline, onlineUsers } = useChat();
	const [userOnline, setUserOnline] = useState(false);
	const { sendChatMessage, isConnected } = useChatSocket();
	useEffect(() => {
		if (user) setUserOnline(isOnline(user?.id));
	}, [onlineUsers, user]);

	useEffect(() => {
		const message = {
			type: 'isOnline',
			chat_room_id: chatRoom.id,
		};
		if (!isConnected) return;
		sendChatMessage(message);
	}, [isConnected]);

	return userOnline;
};

export default useUserOnlineStatus;
