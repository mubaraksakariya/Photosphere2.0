import React from 'react';
import ChatProfileThumpnail from './ChatProfileThumpnail';
import RecentChatProfileCard from './RecentChatProfileCard';
import { useChat } from '../../Contexts/ChatContext';

function ChatList() {
	const { chatRooms, chatRoomsLoading, chatRoomsError, chatRoomsRefetch } =
		useChat();

	if (chatRoomsLoading) {
		return <div>Loading...</div>;
	}

	if (chatRoomsError) {
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
					{chatRooms?.map((chatRoom) => (
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
