import React, { useState } from 'react';
import Sidebar from '../../Components/Chat/Sidebar';
import ChatHeader from '../../Components/Chat/ChatHeader';
import ChatMessages from '../../Components/Chat/ChatMessages';
import ChatInput from '../../Components/Chat/ChatInput';
import SearchedUsers from '../../Components/Chat/SearchedUsers';
import ChatList from '../../Components/Chat/ChatList';
import { useChat } from '../../Contexts/ChatContext';
import NoChatSelected from '../../Components/Chat/NoChatSelected';

function ChatMainPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const { currentChat } = useChat();
	const handleSearch = (e) => {
		setSearchQuery(e.target.value);
	};
	// console.log(currentChat);

	return (
		<div className='flex h-screen'>
			<div className='w-16 bg-lightMode-accent dark:bg-darkMode-accent text-lightMode-background dark:text-darkMode-background '>
				<Sidebar />
			</div>
			<div className='flex-[3] bg-lightMode-section dark:bg-darkMode-section  p-4 border-r border-lightMode-shadow dark:border-darkMode-shadow'>
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
			<div className='flex-[8] bg-lightMode-background dark:bg-darkMode-background flex flex-col'>
				{currentChat ? (
					<>
						<ChatHeader />
						<ChatMessages />
						<ChatInput />
					</>
				) : (
					<NoChatSelected />
				)}
			</div>
		</div>
	);
}

export default ChatMainPage;
