import React from 'react';
import useUserChatRoom from '../../CustomHooks/useUserChatRoom';
import { useChat } from '../../Contexts/ChatContext';

function SearchedChatProfileCard({ user }) {
	if (!user) return null;
	const { selectChat } = useChat();
	const { mutate, isPending, isError, data } = useUserChatRoom(user?.id);
	const manageSelectChat = () => {
		mutate(
			{},
			{
				onSuccess: (data) => {
					selectChat(data.chat_room);
				},
			}
		);
	};
	const { first_name, last_name, username, profile_image } =
		user.profile || {};

	return (
		<div
			className='bg-lightMode-section dark:bg-darkMode-section p-4 rounded-lg shadow-light dark:shadow-dark hover:bg-lightMode-highlight dark:hover:bg-darkMode-highlight flex items-center gap-4 cursor-pointer transition-transform duration-150 ease-in-out transform scale-95 hover:scale-100'
			onClick={manageSelectChat}>
			{/* Profile Image */}
			<img
				src={profile_image || '/default-avatar.png'}
				alt={`${first_name || username}'s profile`}
				className='w-12 h-12 rounded-full object-cover border border-lightMode-textSecondary dark:border-darkMode-textSecondary'
			/>
			<div>
				{/* User Details */}
				<div className='flex-1'>
					<p className='font-medium text-lightMode-textPrimary dark:text-darkMode-textPrimary text-lg'>
						{first_name ? `${first_name} ${last_name}` : username}
					</p>
				</div>
			</div>
		</div>
	);
}

export default SearchedChatProfileCard;
