import React, { useState } from 'react';
import { useChat } from '../../Contexts/ChatContext';
import ChatSelectionNav from '../../Components/Chat/ChatSelectionNav';
import CurrentChat from '../../Components/Chat/CurrentChat';
import Sidebar from '../../Components/Chat/Sidebar';

function MobileScreen() {
	const [searchQuery, setSearchQuery] = useState('');
	const { currentChat } = useChat();

	const handleSearch = (e) => {
		setSearchQuery(e.target.value);
	};
	if (currentChat) return <CurrentChat />;
	return (
		<div className='flex flex-col h-dvh md:h-full'>
			<ChatSelectionNav
				searchQuery={searchQuery}
				handleSearch={handleSearch}
			/>
			<div className='bg-lightMode-accent dark:bg-darkMode-accent text-lightMode-background dark:text-darkMode-background '>
				<Sidebar />
			</div>
		</div>
	);
}

export default MobileScreen;
