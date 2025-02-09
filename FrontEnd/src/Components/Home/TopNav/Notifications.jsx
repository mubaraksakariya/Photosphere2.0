import React from 'react';
import { useNotifications } from '../../../Contexts/NotificationContext';

function Notifications() {
	const { notifications, markAsRead, removeNotification } =
		useNotifications();

	return (
		<div className='absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-all duration-200'>
			<div className='p-4 text-lg font-semibold border-b dark:border-gray-700'>
				Notifications
			</div>
			<div className='max-h-60 overflow-y-auto'>
				{notifications.length > 0 ? (
					notifications.map((notification) => (
						<div
							key={notification.id}
							className='px-4 py-2 border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'>
							{notification.message}
						</div>
					))
				) : (
					<div className='p-4 text-center text-gray-500 dark:text-gray-400'>
						No notifications
					</div>
				)}
			</div>
		</div>
	);
}

export default Notifications;
