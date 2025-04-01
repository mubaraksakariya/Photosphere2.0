import React, { useState } from 'react';
import Sidebar from '../../Components/Chat/Sidebar';
import ChatHeader from '../../Components/Chat/ChatHeader';
import ChatMessages from '../../Components/Chat/ChatMessages';
import ChatInput from '../../Components/Chat/ChatInput';
import { useChat } from '../../Contexts/ChatContext';
import NoChatSelected from '../../Components/Chat/NoChatSelected';
import ChatSelectionNav from '../../Components/Chat/ChatSelectionNav';
import CurrentChat from '../../Components/Chat/CurrentChat';

function OtherScreen() {
	const [searchQuery, setSearchQuery] = useState('');
	const { currentChat } = useChat();

	const handleSearch = (e) => {
		setSearchQuery(e.target.value);
	};

	return (
		<div className='flex h-screen relative'>
			<div className='w-16 bg-lightMode-accent dark:bg-darkMode-accent text-lightMode-background dark:text-darkMode-background '>
				<Sidebar />
			</div>
			<div className='flex-[3]'>
				<ChatSelectionNav
					searchQuery={searchQuery}
					handleSearch={handleSearch}
				/>
			</div>
			<div className='flex-[8]'>
				{currentChat ? <CurrentChat /> : <NoChatSelected />}
			</div>
		</div>
	);
}

export default OtherScreen;
