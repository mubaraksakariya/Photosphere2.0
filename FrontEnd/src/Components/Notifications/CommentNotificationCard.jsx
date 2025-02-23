import React from 'react';
import { formatDistanceToNow } from 'date-fns';

function CommentNotificationCard({ notification, onClick }) {
	const { is_read, created_at, sender, action_object_id } = notification;

	const handleViewPost = (e) => {
		e.stopPropagation();
		window.location.href = `/post/${action_object_id}`;
	};

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
			{/* Profile Image */}
			<img
				src={sender?.profile?.profile_image || '/default-avatar.png'}
				alt='Sender Profile'
				className='w-10 h-10 rounded-full object-cover border border-lightMode-textSecondary dark:border-darkMode-textSecondary'
			/>

			{/* Notification Details */}
			<div className='flex-1'>
				<p className='text-lightMode-textPrimary dark:text-darkMode-textPrimary leading-tight'>
					<strong>{sender?.first_name || sender?.username}</strong>{' '}
					commented on your post.
				</p>
				<small className='text-lightMode-textSecondary dark:text-darkMode-textSecondary'>
					{formatDistanceToNow(new Date(created_at), {
						addSuffix: true,
					})}
				</small>
			</div>

			{/* View Button */}
			<button
				onClick={handleViewPost}
				className='text-lightMode-accent dark:text-darkMode-accent text-sm font-semibold hover:underline'>
				View
			</button>
		</div>
	);
}

export default CommentNotificationCard;
