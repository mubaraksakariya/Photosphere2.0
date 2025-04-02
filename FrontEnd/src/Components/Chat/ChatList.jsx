import React from 'react';
import RecentChatProfileCard from './RecentChatProfileCard';
import { useChat } from '../../Contexts/ChatContext';
import LoadingRing from '../Loading/LoadingRing';

function ChatList() {
	const { chatRooms, chatRoomsLoading, chatRoomsError, chatRoomsRefetch } =
		useChat();

	if (chatRoomsLoading) {
		return (
			<div className='flex justify-center items-center h-full'>
				<LoadingRing />
			</div>
		);
	}

	if (chatRoomsError) {
		return <div>Error loading chats. Please try again later.</div>;
	}

	return (
		<div className='flex flex-col min-h-full max-h-full'>
			<h2 className='text-lg font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-2'>
				Recent Chats
			</h2>
			<div className='flex-1 flex flex-col space-y-2 overflow-y-auto'>
				{/* Map through recent chat rooms */}
				{chatRooms?.map((chatRoom) => (
					<RecentChatProfileCard
						key={chatRoom.id}
						chatRoom={chatRoom}
					/>
				))}
			</div>
		</div>
	);
}

export default ChatList;
