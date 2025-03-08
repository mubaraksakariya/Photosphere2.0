import React from 'react';
import { useChat } from '../../Contexts/ChatContext';
import TextBubble from './ChatBubbles/TextBubble';
import SharedPostBubble from './ChatBubbles/SharedPost/SharedPostBubble';

function MessageBubble({ message }) {
	const { type } = message;

	if (type === 'text') {
		return <TextBubble message={message} />;
	}
	if (type === 'shared-post') {
		return <SharedPostBubble message={message} />;
	}
}

export default MessageBubble;
