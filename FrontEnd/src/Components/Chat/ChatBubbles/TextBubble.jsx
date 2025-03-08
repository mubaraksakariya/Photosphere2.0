import React from 'react';
import { useChat } from '../../../Contexts/ChatContext';

function TextBubble({ message }) {
	const { currentChat } = useChat();
	const chatUserEmail = currentChat?.members[0]?.email;
	const align =
		message.sender.email === chatUserEmail
			? 'justify-start'
			: 'justify-end';
	const { content } = message;
	return (
		<div className={`flex ${align}`}>
			<div className='bg-lightMode-highlight dark:bg-darkMode-highlight text-lightMode-textPrimary dark:text-darkMode-textPrimary p-3 rounded-lg max-w-sm shadow-light dark:shadow-dark'>
				{content.text}
			</div>
		</div>
	);
}

export default TextBubble;
