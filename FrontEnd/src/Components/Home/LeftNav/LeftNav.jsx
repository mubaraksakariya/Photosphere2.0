import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../Store/Slices/AuthSlice';
import { useNavigate } from 'react-router';
import { openCreatePostModal } from '../../../Store/Slices/ModalSlice';
import { useNotifications } from '../../../Contexts/NotificationContext';

function LeftNav() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.auth.user);
	const { unreadCount } = useNotifications();

	const manageOpenProfile = () => {
		navigate(`/profile/${user?.id}`);
	};

	// Dynamic styles for unread notifications
	const notificationIconColor =
		unreadCount > 0 ? 'text-red-500' : 'text-inherit';

	return (
		<div className='md:flex md:flex-col justify-center items-center h-full md:w-60 bg-lightMode-section dark:bg-darkMode-section text-lightMode-textPrimary dark:text-darkMode-textPrimary shadow-light dark:shadow-dark md:p-4'>
			{/* Logo */}
			<div className='hidden md:block mb-8'>
				<h4 className='font-titan text-xl text-lightMode-accent dark:text-darkMode-accent'>
					PHOTOSPHERE
				</h4>
			</div>

			{/* Navigation Links */}
			<div className='md:space-y-6 md:flex-col flex gap-3 w-full justify-between'>
				{/* Home */}
				<div
					className='flex items-center space-x-2 cursor-pointer hover:text-lightMode-accent dark:hover:text-darkMode-accent'
					onClick={() => {
						window.location.reload();
						navigate('/');
					}}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						className='size-6'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
						/>
					</svg>

					<span className='hidden md:inline'>Home</span>
				</div>

				{/* Search */}
				<div className='flex items-center cursor-pointer space-x-2 hover:text-lightMode-accent dark:hover:text-darkMode-accent'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						className='size-6'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
						/>
					</svg>

					<span className='hidden md:inline'>Search</span>
				</div>

				{/* Explore */}
				<div className='flex items-center space-x-2 cursor-pointer hover:text-lightMode-accent dark:hover:text-darkMode-accent'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						className='size-6'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15'
						/>
					</svg>

					<span className='hidden md:inline'>Explore</span>
				</div>

				{/* Create */}
				<div
					className='flex items-center space-x-2 cursor-pointer hover:text-lightMode-accent dark:hover:text-darkMode-accent'
					onClick={() => dispatch(openCreatePostModal())}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						className='size-6'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
						/>
					</svg>

					<span className='hidden md:inline'>Create</span>
				</div>

				{/* Messages */}
				<div
					className='flex items-center space-x-2 cursor-pointer hover:text-lightMode-accent dark:hover:text-darkMode-accent'
					onClick={() => navigate('/chat')}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						className='size-6'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z'
						/>
					</svg>

					<span className='hidden md:inline'>Messages</span>
				</div>

				{/* Notifications */}
				<div
					className='flex items-center space-x-2 cursor-pointer hover:text-lightMode-accent dark:hover:text-darkMode-accent'
					onClick={() => navigate('/notifications')}>
					<span className='relative '>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className={`size-6 text-inherit ${notificationIconColor}`}>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5'
							/>
						</svg>
						{unreadCount > 0 && (
							<span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5'>
								{unreadCount}
							</span>
						)}
					</span>
					<span className='hidden md:inline'>Notification</span>
				</div>

				{/* Profile */}
				<div
					className='flex items-center space-x-2 cursor-pointer hover:text-lightMode-accent dark:hover:text-darkMode-accent'
					onClick={manageOpenProfile}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						className='size-6'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
						/>
					</svg>

					<span className='hidden md:inline'>Profile</span>
				</div>
			</div>

			{/* Logout Button */}
			<div className='mt-auto'>
				<button
					className='bg-lightMode-accent dark:bg-darkMode-accent text-white py-2 px-4 rounded-md text-sm hidden md:block hover:opacity-90 transition-all'
					onClick={() => dispatch(logout())}>
					Logout
				</button>
			</div>
		</div>
	);
}

export default LeftNav;
