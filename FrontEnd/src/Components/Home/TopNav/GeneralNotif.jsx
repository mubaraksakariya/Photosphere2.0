import React from 'react';

function GeneralNotif({ notification }) {
	return (
		<div
			onClick={() => manageClick(notification)}
			key={notification.id}
			className={`flex justify-between items-center px-4 py-2 border-b border-lightMode-shadow dark:border-darkMode-shadow cursor-pointer transition ${
				notification.is_read
					? 'bg-lightMode-background dark:bg-darkMode-background text-lightMode-textSecondary dark:text-darkMode-textSecondary'
					: 'bg-lightMode-highlight dark:bg-darkMode-highlight text-lightMode-textPrimary dark:text-darkMode-textPrimary font-semibold border-l-4 border-lightMode-accent dark:border-darkMode-accent hover:bg-lightMode-accent dark:hover:bg-darkMode-accent hover:text-white dark:hover:text-darkMode-background'
			}`}>
			<span className='w-full'>{notification.message}</span>
		</div>
	);
}

export default GeneralNotif;
