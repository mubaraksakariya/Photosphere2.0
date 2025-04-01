import React, { useState } from 'react';
import { useChat } from '../../Contexts/ChatContext';
import ChatSelectionNav from '../../Components/Chat/ChatSelectionNav';
import ChatHeader from '../../Components/Chat/ChatHeader';
import ChatMessages from '../../Components/Chat/ChatMessages';
import ChatInput from '../../Components/Chat/ChatInput';
import CurrentChat from '../../Components/Chat/CurrentChat';

function MobileScreen() {
	const [searchQuery, setSearchQuery] = useState('');
	const { currentChat } = useChat();

	const handleSearch = (e) => {
		setSearchQuery(e.target.value);
	};
	if (currentChat) return <CurrentChat />;
	return (
		<ChatSelectionNav
			searchQuery={searchQuery}
			handleSearch={handleSearch}
		/>
	);
}

export default MobileScreen;
