import React from 'react';
import ChatProfileThumpnail from './ChatProfileThumpnail';
import useChatUsers from '../../CustomHooks/useChatUsers';
import RecentChatProfileCard from './RecentChatProfileCard';

function ChatList() {
	const { data, isLoading, error } = useChatUsers();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error loading chats. Please try again later.</div>;
	}

	return (
		<div className='flex flex-col'>
			{/* Favorite Chats */}
			<div className='mb-6'>
				<h2 className='text-lg font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-2'>
					Favorite Chats
				</h2>
				<div className='flex space-x-2'>
					{/* Replace with dynamic favorite chats when available */}
					<ChatProfileThumpnail />
					<ChatProfileThumpnail />
				</div>
			</div>

			{/* Recent Chats */}
			<div>
				<h2 className='text-lg font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-2'>
					Recent Chats
				</h2>
				<div className='flex flex-col space-y-2'>
					{/* Map through recent chat rooms */}
					{data?.map((chatRoom) => (
						<RecentChatProfileCard
							key={chatRoom.id}
							chatRoom={chatRoom}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export default ChatList;
