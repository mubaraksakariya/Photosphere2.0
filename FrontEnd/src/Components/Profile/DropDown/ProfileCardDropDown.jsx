import React, { useState, useRef, useEffect } from 'react';
import RemoveFollower from './RemoveFollower';

function ProfileCardDropDown({ user }) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

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
			<span
				onClick={() => setIsOpen(!isOpen)}
				className='text-lightMode-textPrimary dark:text-darkMode-textPrimary cursor-pointer'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-5 w-5'
					viewBox='0 0 20 20'
					fill='currentColor'>
					<path d='M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z' />
				</svg>
			</span>
			{isOpen && (
				<div className='absolute right-0 mt-2 w-48 max-w-max bg-white dark:bg-gray-800 rounded-md shadow-lg z-10'>
					<div className='py-1'>
						<RemoveFollower
							user={user}
							onSuccess={() => setIsOpen(false)}
							onClick={() => setIsOpen(false)}
						/>
						<button
							onClick={() => setIsOpen(false)}
							className='block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'>
							Block User
						</button>

						<button
							onClick={() => setIsOpen(false)}
							className='block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'>
							Report User
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default ProfileCardDropDown;
