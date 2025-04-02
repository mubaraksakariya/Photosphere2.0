import React from 'react';
import ChatProfileThumpnail from './ChatProfileThumpnail';

function FavoriteChats() {
	return (
		<div className='mb-6'>
			<h2 className='text-lg font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-2'>
				Favorite Chats
			</h2>
			<div className='flex space-x-2'>
				{/* Replace with dynamic favorite chats when available */}
				<ChatProfileThumpnail />
				<ChatProfileThumpnail />
			</div>
		</div>
	);
}

export default FavoriteChats;
