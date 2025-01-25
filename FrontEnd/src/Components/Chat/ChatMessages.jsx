// ChatMessages.jsx
import React from 'react';

function ChatMessages() {
	const Message = ({ text, align }) => (
		<div className={`flex ${align}`}>
			<div className='bg-lightMode-highlight dark:bg-darkMode-highlight text-lightMode-textPrimary dark:text-darkMode-textPrimary p-3 rounded-lg max-w-sm shadow-light dark:shadow-dark'>
				{text}
			</div>
		</div>
	);

	return (
		<div className='flex-1 p-4 overflow-y-auto space-y-4'>
			<Message text='Hello! How are you?' align='justify-start' />
			<Message
				text="I'm good, thanks! How about you?"
				align='justify-end'
			/>
		</div>
	);
}

export default ChatMessages;
