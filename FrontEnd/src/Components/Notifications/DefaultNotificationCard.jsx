import React from 'react';
import { formatDistanceToNow } from 'date-fns';

function DefaultNotificationCard({ notification, onClick }) {
	if (!notification) return null;

	const { sender, message, created_at, is_read } = notification;

	return (
		<div
			onClick={() => onclick && onClick(notification.id)}
			className={`p-4 mx-2 rounded-lg flex items-center gap-4 cursor-pointer transition-all duration-200 shadow-light dark:shadow-dark 
				${
					is_read
						? 'bg-lightMode-section dark:bg-darkMode-section opacity-75'
						: 'bg-lightMode-highlight dark:bg-darkMode-highlight font-semibold'
				}
				hover:shadow-md hover:scale-105`}>
			{/* Sender Profile Image */}
			<img
				src={sender?.profile?.profile_image || '/default-avatar.png'}
				alt={sender?.username}
				className='w-10 h-10 rounded-full object-cover border border-lightMode-textSecondary dark:border-darkMode-textSecondary'
			/>

			{/* Notification Content */}
			<div className='flex-1'>
				<p className='text-lightMode-textPrimary dark:text-darkMode-textPrimary leading-tight'>
					{message || 'You have a new notification.'}
				</p>
				<small className='text-lightMode-textSecondary dark:text-darkMode-textSecondary'>
					{formatDistanceToNow(new Date(created_at), {
						addSuffix: true,
					})}
				</small>
			</div>
		</div>
	);
}

export default DefaultNotificationCard;
