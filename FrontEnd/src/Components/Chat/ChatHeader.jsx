// ChatHeader.jsx
import React from 'react';

function ChatHeader() {
	return (
		<div className='p-4 border-b border-lightMode-shadow dark:border-darkMode-shadow'>
			<h2 className='text-xl font-bold text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
				Username
			</h2>
			<p className='text-sm text-lightMode-textSecondary dark:text-darkMode-textSecondary'>
				Active now
			</p>
		</div>
	);
}

export default ChatHeader;
