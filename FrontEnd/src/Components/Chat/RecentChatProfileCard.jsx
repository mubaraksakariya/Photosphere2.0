import React, { useCallback } from 'react';
import { useChat } from '../../Contexts/ChatContext';
import useUnreadMessages from './useUnreadMessages';
import useUserOnlineStatus from './useUserOnlineStatus';

function RecentChatProfileCard({ chatRoom }) {
	if (!chatRoom) return null;

	const unreadMessages = useUnreadMessages(chatRoom);
	const unreadMessagesCount = unreadMessages.length;
	const user = chatRoom.members[0];
	const userOnline = useUserOnlineStatus(user, chatRoom);
	const { selectChat } = useChat();

	const { first_name, last_name, username, profile_image } =
		user?.profile || {};

	const manageSelectChat = useCallback(() => {
		selectChat(chatRoom);
	}, [selectChat, chatRoom]);
	const getLastMessage = () => {
		if (unreadMessages[unreadMessages.length - 1].type === 'text') {
			return unreadMessages[unreadMessages.length - 1].content.text;
		}
		if (unreadMessages[unreadMessages.length - 1].type === 'shared-post') {
			return 'shared a post';
		}
		if (unreadMessages[unreadMessages.length - 1].type === 'file') {
			return 'shared a file';
		}
	};
	return (
		<div
			className='relative bg-lightMode-section dark:bg-darkMode-section p-4 rounded-lg shadow-light dark:shadow-dark hover:bg-lightMode-highlight dark:hover:bg-darkMode-highlight flex items-center gap-4 cursor-pointer transition-transform duration-150 ease-in-out transform scale-95 hover:scale-100'
			onClick={manageSelectChat}>
			{/* Profile Image with Online Indicator */}
			<div className='relative'>
				<img
					src={profile_image || '/default-avatar.png'}
					alt={`${first_name || username}'s profile`}
					className='w-12 h-12 rounded-full object-cover border border-lightMode-textSecondary dark:border-darkMode-textSecondary'
				/>
				{userOnline && (
					<span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full'></span>
				)}
			</div>
			{/* User Details */}
			<div>
				<p className='font-medium text-lightMode-textPrimary dark:text-darkMode-textPrimary text-lg'>
					{first_name ? `${first_name} ${last_name}` : username}
				</p>
				{/* Last Message Preview */}
				{unreadMessages.length > 0 && (
					<p className='text-sm text-lightMode-textSecondary dark:text-darkMode-textSecondary truncate'>
						{getLastMessage()}
					</p>
				)}
			</div>
			{/* Unread Messages Badge */}
			{unreadMessagesCount > 0 && (
				<span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full'>
					{unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
				</span>
			)}
		</div>
	);
}

export default RecentChatProfileCard;
