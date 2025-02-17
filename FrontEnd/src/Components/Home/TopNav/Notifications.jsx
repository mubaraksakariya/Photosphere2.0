import React, { useEffect, useRef } from 'react';
import { useNotifications } from '../../../Contexts/NotificationContext';

function Notifications() {
	const { notifications, markAsRead, isLoading, error } = useNotifications();

	useEffect(() => {
		// Mark notifications as read when unmounting
		return () => {
			console.log('Marked as read on unmount');
			markAsRead();
		};
	}, []);

	const manageClick = (notification) => {
		console.log(notification);
	};

	return (
		<div className='absolute right-0 mt-2 w-72 bg-lightMode-section dark:bg-darkMode-section shadow-light dark:shadow-dark rounded-lg overflow-hidden transition-all duration-200'>
			{/* Header */}
			<div className='flex justify-between items-center p-4 text-lg font-semibold border-b border-lightMode-shadow dark:border-darkMode-shadow text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
				<span>Notifications</span>
			</div>

			{/* Loading State */}
			{isLoading && (
				<div className='p-4 text-center text-lightMode-textSecondary dark:text-darkMode-textSecondary'>
					Loading...
				</div>
			)}

			{/* Error State */}
			{error && (
				<div className='p-4 text-center text-red-500'>
					Failed to load notifications
				</div>
			)}

			{/* Notifications List */}
			{!isLoading && !error && (
				<div className='max-h-60 overflow-y-auto'>
					{notifications.length > 0 ? (
						notifications.map((notification) => (
							<div
								onClick={() => manageClick(notification)}
								key={notification.id}
								className={`flex justify-between items-center px-4 py-2 border-b border-lightMode-shadow dark:border-darkMode-shadow cursor-pointer transition ${
									notification.is_read
										? 'bg-lightMode-background dark:bg-darkMode-background text-lightMode-textSecondary dark:text-darkMode-textSecondary'
										: 'bg-lightMode-highlight dark:bg-darkMode-highlight text-lightMode-textPrimary dark:text-darkMode-textPrimary font-semibold border-l-4 border-lightMode-accent dark:border-darkMode-accent hover:bg-lightMode-accent dark:hover:bg-darkMode-accent hover:text-white dark:hover:text-darkMode-background'
								}`}>
								<span className='w-full'>
									{notification.message}
								</span>
							</div>
						))
					) : (
						<div className='p-4 text-center text-lightMode-textSecondary dark:text-darkMode-textSecondary'>
							No notifications
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default Notifications;
