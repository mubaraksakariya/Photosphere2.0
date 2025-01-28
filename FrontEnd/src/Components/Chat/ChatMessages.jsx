import React from 'react';
import MessageBubble from './MessageBubble';

function ChatMessages() {
	return (
		<div className='flex-1 p-4 overflow-y-auto space-y-4'>
			<MessageBubble text='Hello! How are you?' align='justify-start' />
			<MessageBubble
				text="I'm good, thanks! How about you?"
				align='justify-end'
			/>
		</div>
	);
}

export default ChatMessages;
