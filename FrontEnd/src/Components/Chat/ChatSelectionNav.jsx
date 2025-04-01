import React from 'react';
import SearchedUsers from './SearchedUsers';
import ChatList from './ChatList';

function ChatSelectionNav({ searchQuery, handleSearch }) {
	return (
		<div className='bg-lightMode-section dark:bg-darkMode-section  p-4 border-r border-lightMode-shadow dark:border-darkMode-shadow h-dvh md:h-full'>
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
			{searchQuery ? (
				<SearchedUsers searchQuery={searchQuery} />
			) : (
				<ChatList />
			)}
		</div>
	);
}

export default ChatSelectionNav;
