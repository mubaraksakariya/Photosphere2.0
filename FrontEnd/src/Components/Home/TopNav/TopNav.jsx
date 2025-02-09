import React from 'react';
import StoryNav from '../StoryNav/StoryNav';
import NotificationDropdown from './NotificationDropDown';

function TopNav() {
	return (
		<div className='bg-lightMode-background dark:bg-darkMode-background flex gap-4 shadow-light dark:shadow-dark'>
			{/* Logo Section */}
			<div className='flex-[1] p-4'>
				<div className='hidden md:flex justify-center items-center '>
					<button
						type='button'
						className='aspect-square w-16 hover:opacity-80 transition-opacity'>
						<img
							src='logo.png'
							alt='Logo'
							className='w-full h-full object-contain'
						/>
					</button>
				</div>
			</div>
			<div className='flex-[4] p-4'>
				<StoryNav />
			</div>
			<div className='flex justify-end items-center flex-[1] p-4'>
				<NotificationDropdown />
			</div>
		</div>
	);
}

export default TopNav;
