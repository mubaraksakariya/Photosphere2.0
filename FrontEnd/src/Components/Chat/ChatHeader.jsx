// ChatHeader.jsx
import React from 'react';
import { useChat } from '../../Contexts/ChatContext';
import useUserOnlineStatus from './useUserOnlineStatus';
// import { useSelector } from 'react-redux';

function ChatHeader() {
	const { currentChat, clearChat, isGroup } = useChat();
	const chatUser = currentChat?.members[0];
	const userOnline = useUserOnlineStatus(chatUser, currentChat);
	const username = chatUser?.username;
	const profile_image = chatUser?.profile.profile_image;
	const first_name = chatUser?.profile.first_name;
	const groupName = currentChat?.name;

	return (
		<div className='p-4 border-b border-lightMode-shadow dark:border-darkMode-shadow'>
			<div className=' flex items-center gap-3'>
				<div className=' relative'>
					<img
						src={profile_image || '/default-avatar.png'}
						alt={`${first_name || username}'s profile`}
						className='w-16 h-16 rounded-full object-cover border border-lightMode-textSecondary dark:border-darkMode-textSecondary'
					/>
					{userOnline && (
						<span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full'></span>
					)}
				</div>
				<div>
					<h2 className='text-xl font-bold text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
						{isGroup ? groupName : username}
					</h2>
					{userOnline && (
						<p className='text-sm text-lightMode-textSecondary dark:text-darkMode-textSecondary'>
							Active now
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default ChatHeader;
