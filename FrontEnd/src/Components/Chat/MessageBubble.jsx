import React from 'react';
import TextBubble from './ChatBubbles/Text/TextBubble';
import SharedPostBubble from './ChatBubbles/SharedPost/SharedPostBubble';
import DefaultBubble from './ChatBubbles/Default/DefaultBubble';

function MessageBubble({ message }) {
	const { type } = message;

	if (type === 'text') {
		return <TextBubble message={message} />;
	}
	if (type === 'shared-post') {
		return <SharedPostBubble message={message} />;
	} else return <DefaultBubble message={message} />;
}

export default MessageBubble;
