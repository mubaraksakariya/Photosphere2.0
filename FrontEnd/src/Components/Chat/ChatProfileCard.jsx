import React from 'react';

function ChatProfileCard({ title, message }) {
	return (
		<div className='bg-lightMode-section dark:bg-darkMode-section p-3 rounded-lg shadow-light dark:shadow-dark hover:bg-lightMode-highlight dark:hover:bg-darkMode-highlight'>
			<p className='font-medium text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
				{title}
			</p>
			<span className='text-sm text-lightMode-textSecondary dark:text-darkMode-textSecondary'>
				{message}
			</span>
		</div>
	);
}

export default ChatProfileCard;
