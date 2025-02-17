import React, { useState, useEffect, useRef } from 'react';
import Notifications from './Notifications';
import { useNotifications } from '../../../Contexts/NotificationContext';

function NotificationDropdown() {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);
	const { unreadCount } = useNotifications();

	// Toggle dropdown
	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className='relative' ref={dropdownRef}>
			{/* Notification Bell */}
			<div
				onClick={toggleDropdown}
				className='relative flex items-center gap-1 cursor-pointer p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition'>
				{/* Bell Icon */}
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					strokeWidth={1.5}
					stroke='currentColor'
					className={`size-6 ${
						unreadCount > 0
							? 'text-red-500 animate-pulse'
							: 'text-gray-700 dark:text-gray-300'
					}`}>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5'
					/>
				</svg>

				{/* Unread Notification Badge */}
				{unreadCount > 0 && (
					<span className='absolute top-1 right-0 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full'>
						{unreadCount}
					</span>
				)}
			</div>

			{/* Dropdown Content */}
			{isOpen && <Notifications />}
		</div>
	);
}

export default NotificationDropdown;
