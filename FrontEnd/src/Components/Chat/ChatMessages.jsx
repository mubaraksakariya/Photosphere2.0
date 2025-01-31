import React from 'react';
import MessageBubble from './MessageBubble';
import { useChat } from '../../Contexts/ChatContext';

function ChatMessages() {
	const { currentChat, chatRoomMessages } = useChat();
	const chatUserEmail = currentChat?.members[0].email;
	// console.log(chatUserEmail);

	return (
		<div className='flex-1 p-4 overflow-y-auto space-y-4'>
			{chatRoomMessages.map((data) => {
				if (data.sender.email === chatUserEmail) {
					return (
						<MessageBubble
							text={data.content}
							align='justify-start'
							key={data.id}
						/>
					);
				} else
					return (
						<MessageBubble
							key={data.id}
							text={data.content}
							align={'justify-end'}
						/>
					);
			})}
		</div>
	);
}

export default ChatMessages;
