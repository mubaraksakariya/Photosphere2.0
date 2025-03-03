import React, { useEffect, useRef } from 'react';
import { useNotifications } from '../../../Contexts/NotificationContext';
import FollowRequestNotif from './FollowRequestNotif';
import GeneralNotif from './GeneralNotif';

function Notifications() {
	const { notifications, markAsRead, isLoading, error, unreadCount } =
		useNotifications();
	useEffect(() => {
		// Mark notifications as read when unmounting
		return () => {
			if (unreadCount > 0) {
				console.log('Marked as read on unmount');
				markAsRead();
			}
		};
	}, []);
	const getNotificationType = (notification) => {
		if (notification.action_object_type === 'followrequest')
			return (
				<FollowRequestNotif
					notification={notification}
					key={notification.id}
				/>
			);
		else
			return (
				<GeneralNotif
					notification={notification}
					key={notification.id}
				/>
			);
	};
	const manageClick = (notification) => {
		console.log(notifications);
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
				<div className='max-h-60 overflow-y-auto space-y-1'>
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
