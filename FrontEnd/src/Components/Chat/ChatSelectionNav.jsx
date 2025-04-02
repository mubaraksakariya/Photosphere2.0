import React from 'react';
import SearchedUsers from './SearchedUsers';
import ChatList from './ChatList';
import FavoriteChats from './FavoriteChats';

function ChatSelectionNav({ searchQuery, handleSearch }) {
	return (
		<div className=' flex-1 flex flex-col bg-lightMode-section dark:bg-darkMode-section  p-4 border-r border-lightMode-shadow dark:border-darkMode-shadow md:h-full w-full'>
			<h1 className='text-2xl font-bold text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-2'>
				Chats
			</h1>
			{/* Search */}
			<div className='mb-4'>
				<input
					type='text'
					name='search'
					value={searchQuery}
					onChange={handleSearch}
					placeholder='Search chats...'
					className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lightMode-accent dark:focus:ring-darkMode-accent'
				/>
			</div>
			<FavoriteChats />
			<div className='flex-1 overflow-auto'>
				{searchQuery ? (
					<SearchedUsers searchQuery={searchQuery} />
				) : (
					<ChatList />
				)}
			</div>
		</div>
	);
}

export default ChatSelectionNav;
