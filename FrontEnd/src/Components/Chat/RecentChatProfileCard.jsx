import React, { useEffect, useState } from 'react';
import { useChat } from '../../Contexts/ChatContext';

function RecentChatProfileCard({ chatRoom }) {
	if (!chatRoom) return null;

	const [unreadMessages, setUnreadMessages] = useState([]);
	const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
	const {
		currentChat,
		selectChat,
		noneChatRoomMessages,
		getMessagesForChatRoom,
	} = useChat();

	useEffect(() => {
		if (chatRoom?.id) {
			if (currentChat?.id && currentChat.id === chatRoom.id) return;
			const messages = getMessagesForChatRoom(chatRoom.id);
			if (messages.length > 0) {
				setUnreadMessages(messages);
				setUnreadMessagesCount(messages.length);
			}
		}
	}, [chatRoom, noneChatRoomMessages, getMessagesForChatRoom]);

	const user = chatRoom.members[0];
	const manageSelectChat = () => {
		selectChat(chatRoom);
	};

	const { first_name, last_name, username, profile_image } =
		user.profile || {};

	return (
		<div
			className='relative bg-lightMode-section dark:bg-darkMode-section p-4 rounded-lg shadow-light dark:shadow-dark hover:bg-lightMode-highlight dark:hover:bg-darkMode-highlight flex items-center gap-4 cursor-pointer transition-transform duration-150 ease-in-out transform hover:scale-105'
			onClick={manageSelectChat}>
			{/* Profile Image */}
			<div className='relative'>
				<img
					src={profile_image || '/default-avatar.png'}
					alt={`${first_name || username}'s profile`}
					className='w-16 h-16 rounded-full object-cover border border-lightMode-textSecondary dark:border-darkMode-textSecondary'
				/>
				{/* Notification Badge */}
				{unreadMessagesCount > 0 && (
					<span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full'>
						{unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
					</span>
				)}
			</div>
			<div>
				{/* User Details */}
				<div className='flex-1'>
					<p className='font-medium text-lightMode-textPrimary dark:text-darkMode-textPrimary text-lg'>
						{first_name ? `${first_name} ${last_name}` : username}
					</p>
				</div>
				{/* Last Message Preview */}
				{unreadMessages.length > 0 && (
					<div className='text-sm text-lightMode-textSecondary dark:text-darkMode-textSecondary truncate'>
						{unreadMessages[unreadMessages.length - 1].content}
					</div>
				)}
			</div>
		</div>
	);
}

export default RecentChatProfileCard;
