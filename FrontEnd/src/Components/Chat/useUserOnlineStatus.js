import { useEffect, useState } from 'react';
import { useChat } from '../../Contexts/ChatContext';
import { useChatSocket } from '../../Contexts/ChatSocketContext';

// Custom hook to check if user is online
const useUserOnlineStatus = (user, chatRoom) => {
	const { isOnline, onlineUsers } = useChat();
	const [userOnline, setUserOnline] = useState(false);
	const { sendChatMessage } = useChatSocket();
	useEffect(() => {
		if (user) setUserOnline(isOnline(user?.id));
	}, [onlineUsers, user]);

	useEffect(() => {
		const message = {
			type: 'isOnline',
			chat_room_id: chatRoom.id,
		};
		sendChatMessage(message);
	}, []);

	return userOnline;
};

export default useUserOnlineStatus;
