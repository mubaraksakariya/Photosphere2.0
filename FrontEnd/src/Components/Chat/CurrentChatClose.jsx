import React from 'react';
import { useChat } from '../../Contexts/ChatContext';
import { CircleX } from 'lucide-react';

function CurrentChatClose({ buttonType = 'icon' }) {
	// buttonType is either 'button' or 'icon'
	const { clearChat } = useChat();
	if (buttonType === 'button') {
		return (
			<button
				className='text-red-600 hover:text-red-800 transition-colors text-xl shrink-0'
				onClick={() => clearChat()}
				aria-label='Close Modal'>
				Close
			</button>
		);
	}
	if (buttonType === 'icon') {
		return (
			<span
				className='text-red-600 hover:text-red-800 transition-colors text-xl shrink-0 cursor-pointer'
				onClick={() => clearChat()}
				aria-label='Close Modal'>
				<CircleX />
			</span>
		);
	}
	return null;
}

export default CurrentChatClose;
