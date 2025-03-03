import React from 'react';

function GeneralNotif({ notification }) {
	if (!notification) return null;

	const isUnread = !notification.is_read;

	return (
		<div
			onClick={() => console.log(notification)}
			key={notification.id}
			className={`cursor-pointer p-3 rounded-lg shadow-light dark:shadow-dark border-l-4 transition 
				${
					isUnread
						? 'bg-lightMode-highlight dark:bg-[#5C4B42] font-semibold border-lightMode-accent dark:border-darkMode-accent'
						: 'bg-lightMode-background dark:bg-darkMode-background text-lightMode-textSecondary dark:text-darkMode-textSecondary opacity-80 border-transparent'
				}
				hover:bg-lightMode-highlight dark:hover:bg-[#5C4B42] hover:text-lightMode-background dark:hover:text-darkMode-background`}>
			{/* Notification Content */}
			<p className='text-sm text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
				{notification.message}
			</p>
			<p className='text-xs text-lightMode-textPrimary dark:text-darkMode-textPrimary opacity-60'>
				{new Date(notification.created_at).toLocaleString()}
			</p>
		</div>
	);
}

export default GeneralNotif;
