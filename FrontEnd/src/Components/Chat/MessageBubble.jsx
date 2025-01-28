import React from 'react';

function MessageBubble({ text, align }) {
	return (
		<div className={`flex ${align}`}>
			<div className='bg-lightMode-highlight dark:bg-darkMode-highlight text-lightMode-textPrimary dark:text-darkMode-textPrimary p-3 rounded-lg max-w-sm shadow-light dark:shadow-dark'>
				{text}
			</div>
		</div>
	);
}

export default MessageBubble;
