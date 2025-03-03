// ChatInput.jsx
import React from 'react';
import { useChatSocket } from '../../Contexts/ChatSocketContext';

function ChatInput() {
	const { sendChatMessage, sendIsTypingMessage } = useChatSocket();
	const manageSubmit = (e) => {
		e.preventDefault();
		const text = e.target.message.value;
		if (text === '') return;
		sendChatMessage({ data: e.target.message.value, type: 'text' });
		e.target.message.value = '';
	};
	const manageIsTyping = () => {
		sendIsTypingMessage();
	};
	return (
		<div className='p-4 border-t border-lightMode-shadow dark:border-darkMode-shadow'>
			<form
				action=''
				className='flex items-center space-x-4'
				onSubmit={manageSubmit}>
				<input
					onChange={manageIsTyping}
					name='message'
					type='text'
					placeholder='Type a message...'
					className='flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lightMode-accent dark:focus:ring-darkMode-accent'
				/>
				<button
					type='submit'
					className='px-4 py-2 bg-lightMode-accent dark:bg-darkMode-accent text-lightMode-background dark:text-darkMode-background rounded-lg hover:bg-lightMode-highlight dark:hover:bg-darkMode-highlight'>
					Send
				</button>
			</form>
		</div>
	);
}

export default ChatInput;
