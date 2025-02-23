import React from 'react';
import useAllNotifications from '../../CustomHooks/useNotifications';
import { useInView } from 'react-intersection-observer';
import { useNotifications } from '../../Contexts/NotificationContext';
import LikeNotificationCard from '../../Components/Notifications/LikeNotificationCard';
import CommentNotificationCard from '../../Components/Notifications/CommentNotificationCard';
import FollowNotificationCard from '../../Components/Notifications/FollowNotificationCard';
import DefaultNotificationCard from '../../Components/Notifications/DefaultNotificationCard';

function NotificationsFullPage() {
	const { ref, inView } = useInView();
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		error,
	} = useAllNotifications();
	const { markAsRead } = useNotifications();

	const getNotificationComponent = (notification) => {
		switch (notification.notification_type) {
			case 'liked':
				return (
					<LikeNotificationCard
						key={notification.id}
						notification={notification}
						onClick={markAsRead}
					/>
				);
			case 'commented':
				return (
					<CommentNotificationCard
						key={notification.id}
						notification={notification}
						onClick={markAsRead}
					/>
				);
			case 'followed':
				return (
					<FollowNotificationCard
						key={notification.id}
						notification={notification}
						onClick={markAsRead}
					/>
				);
			default:
				return (
					<DefaultNotificationCard
						key={notification.id}
						notification={notification}
						onClick={markAsRead}
					/>
				);
		}
	};
	React.useEffect(() => {
		return () => {
			markAsRead();
		};
	}, []);
	React.useEffect(() => {
		if (inView && hasNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, fetchNextPage]);

	if (isLoading)
		return (
			<div className='flex justify-center items-center min-h-screen text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
				Loading...
			</div>
		);

	if (isError)
		return (
			<p className='text-center text-red-500'>
				Failed to load notifications. {error?.message}
			</p>
		);

	return (
		<div className='min-h-[100dvh] flex flex-col bg-lightMode-background dark:bg-darkMode-background text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
			{/* Navbar */}
			<div className='p-4 gap-3 border-b border-lightMode-border dark:border-darkMode-border bg-lightMode-section dark:bg-darkMode-section shadow-light dark:shadow-dark'>
				<div className='text-center w-full relative'>
					<h2 className='text-lg font-semibold'>Notifications</h2>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						onClick={() => window.history.back()}
						className='size-7 absolute left-2 top-0 cursor-pointer hover:bg-lightMode-hover dark:hover:bg-darkMode-hover'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18'
						/>
					</svg>
				</div>
			</div>

			{/* Notifications List */}
			<div className='flex-1 flex justify-center'>
				<div className='sm:w-[50%] w-full max-h-[95vh] overflow-y-auto p-4'>
					{data?.pages?.length > 0 ? (
						<ul className='space-y-4'>
							{data.pages.map((page) =>
								page.results.map((notif) =>
									getNotificationComponent(notif)
								)
							)}
						</ul>
					) : (
						<p className='text-center text-lightMode-textSecondary dark:text-darkMode-textSecondary'>
							No notifications
						</p>
					)}

					{/* Infinite Scroll Trigger */}
					<div ref={ref} className='h-10'></div>

					{/* Loading More */}
					{isFetchingNextPage && (
						<div className='flex justify-center py-4'>
							<span className='text-lightMode-textSecondary dark:text-darkMode-textSecondary'>
								Loading more notifications...
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default NotificationsFullPage;
