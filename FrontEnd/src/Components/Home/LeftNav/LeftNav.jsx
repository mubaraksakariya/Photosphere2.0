import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../Store/Slices/AuthSlice';
import { useNavigate } from 'react-router';
import { openCreatePostModal } from '../../../Store/Slices/ModalSlice';
// import { HomeContext } from '../../Contexts/HomeContext';
// import { axiosInstance } from '../../Contexts/AxioContext';

function LeftNav() {
	const { isPostModalOpen, isStoryModalOpen } = useSelector(
		(state) => state.modal
	);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [notificationCount, setNotificationCount] = useState(0);
	const iconRef = useRef();

	// useEffect(() => {
	// 	axiosInstance
	// 		.get('notification/get-unread-notifications')
	// 		.then((response) => {
	// 			if (response.data.result) {
	// 				setNotificationCount(response.data.count);
	// 			}
	// 		});
	// }, []);

	useEffect(() => {
		if (notificationCount > 0) {
			iconRef.current.style.color = 'red';
		} else {
			iconRef.current.style.color = 'black';
		}
	}, [notificationCount]);

	return (
		<div className='flex flex-col h-full w-16 md:w-64 bg-lightMode-section dark:bg-darkMode-section text-lightMode-textPrimary dark:text-darkMode-textPrimary shadow-light dark:shadow-dark p-4'>
			{/* Logo */}
			<div className='hidden md:block mb-8'>
				<h4 className='font-titan text-xl text-lightMode-accent dark:text-darkMode-accent'>
					PHOTOSPHERE
				</h4>
			</div>

			{/* Navigation Links */}
			<div className='space-y-6'>
				{/* Home */}
				<div
					className='flex items-center space-x-2 cursor-pointer hover:text-lightMode-accent dark:hover:text-darkMode-accent'
					onClick={() => {
						window.location.reload();
						navigate('/');
					}}>
					<i className='bi bi-house-door-fill text-xl'></i>
					<span className='hidden md:inline'>Home</span>
				</div>

				{/* Search */}
				<div className='flex items-center space-x-2 hover:text-lightMode-accent dark:hover:text-darkMode-accent'>
					<i className='bi bi-search text-xl'></i>
					<span className='hidden md:inline'>Search</span>
				</div>

				{/* Explore */}
				<div className='flex items-center space-x-2 hover:text-lightMode-accent dark:hover:text-darkMode-accent'>
					<i className='bi bi-compass-fill text-xl'></i>
					<span className='hidden md:inline'>Explore</span>
				</div>

				{/* Messages */}
				<div
					className='flex items-center space-x-2 cursor-pointer hover:text-lightMode-accent dark:hover:text-darkMode-accent'
					onClick={() => navigate('/chat')}>
					<i className='bi bi-chat-quote-fill text-xl'></i>
					<span className='hidden md:inline'>Messages</span>
				</div>

				{/* Create */}
				<div
					className='flex items-center space-x-2 cursor-pointer hover:text-lightMode-accent dark:hover:text-darkMode-accent'
					onClick={() => dispatch(openCreatePostModal())}>
					<i className='bi bi-plus-circle-fill text-xl'></i>
					<span className='hidden md:inline'>Create</span>
				</div>

				{/* Notifications */}
				<div className='flex items-center space-x-2 cursor-pointer hover:text-lightMode-accent dark:hover:text-darkMode-accent'>
					<i ref={iconRef} className='bi bi-bell-fill text-xl'></i>
					<span className='hidden md:inline'>Notification</span>
				</div>

				{/* Profile */}
				<div
					className='flex items-center space-x-2 cursor-pointer hover:text-lightMode-accent dark:hover:text-darkMode-accent'
					onClick={() => navigate('/profile')}>
					<i className='bi bi-person-circle text-xl'></i>
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
