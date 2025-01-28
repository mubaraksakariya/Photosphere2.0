import React from 'react';
import { useChat } from '../../Contexts/ChatContext';

function RecentChatProfileCard({ chatRoom }) {
	if (!chatRoom) return null;
	const { currentChat, selectChat, clearChat } = useChat();
	const user = chatRoom.members[0];
	const manageSelectChat = () => {
		selectChat(chatRoom);
	};
	const { first_name, last_name, username, profile_image } =
		user.profile || {};

	return (
		<div
			className='bg-lightMode-section dark:bg-darkMode-section p-4 rounded-lg shadow-light dark:shadow-dark hover:bg-lightMode-highlight dark:hover:bg-darkMode-highlight flex items-center gap-4 cursor-pointer'
			onClick={manageSelectChat}>
			{/* Profile Image */}
			<img
				src={profile_image || '/default-avatar.png'}
				alt={`${first_name || username}'s profile`}
				className='w-16 h-16 rounded-full object-cover border border-lightMode-textSecondary dark:border-darkMode-textSecondary'
			/>
			<div>
				{/* User Details */}
				<div className='flex-1'>
					<p className='font-medium text-lightMode-textPrimary dark:text-darkMode-textPrimary text-lg'>
						{first_name ? `${first_name} ${last_name}` : username}
					</p>
				</div>
				{/* recent message */}
				<div>message</div>
			</div>
		</div>
	);
}

export default RecentChatProfileCard;
