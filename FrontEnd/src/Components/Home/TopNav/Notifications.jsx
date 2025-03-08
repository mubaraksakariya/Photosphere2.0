import React, { useEffect } from 'react';
import { useNotifications } from '../../../Contexts/NotificationContext';
import FollowRequestNotif from './FollowRequestNotif';
import GeneralNotif from './GeneralNotif';

function Notifications() {
	const { notifications, markAsRead, isLoading, error, unreadCount } =
		useNotifications();

	useEffect(() => {
		return () => {
			if (unreadCount > 0) {
				console.log('Marked as read on unmount');
				markAsRead();
			}
		};
	}, [unreadCount, markAsRead]);

	const getNotificationType = (notification) => {
		if (notification.action_object_type === 'followrequest') {
			return (
				<FollowRequestNotif
					notification={notification}
					key={notification.id}
				/>
			);
		} else {
			return (
				<GeneralNotif
					notification={notification}
					key={notification.id}
				/>
			);
		}
	};

	return (
		<div
			className='absolute right-0 mt-2 w-80 bg-lightMode-section dark:bg-darkMode-section shadow-light dark:shadow-dark rounded-lg overflow-hidden transition-all duration-200'
			onClick={(e) => e.stopPropagation()} // Prevent accidental closing
		>
			{/* Header */}
			<div className='flex justify-between items-center p-4 text-lg font-semibold border-b border-lightMode-shadow dark:border-darkMode-shadow text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
				<span>Notifications</span>
				{unreadCount > 0 && (
					<span className='px-2 py-1 text-xs font-bold text-white bg-red-500 dark:bg-red-600 rounded-full'>
						{unreadCount}
					</span>
				)}
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
				<div className='max-h-72 overflow-y-auto space-y-2 p-2'>
					{notifications.length > 0 ? (
						notifications.map((notification) =>
							getNotificationType(notification)
						)
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
