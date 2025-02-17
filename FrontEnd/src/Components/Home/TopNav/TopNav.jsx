import React from 'react';
import StoryNav from '../StoryNav/StoryNav';
import NotificationDropdown from './NotificationDropDown';

function TopNav() {
	return (
		<div className='bg-lightMode-section dark:bg-darkMode-section shadow-light dark:shadow-dark md:py-4 p-2 md:px-6'>
			<div className='flex gap-4 bg-lightMode-background dark:bg-darkMode-background  shadow-light dark:shadow-dark'>
				{/* Logo Section */}
				<div className='hidden md:flex flex-[1] p-4'>
					<div className='justify-center items-center '>
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
				<div className='flex-[4] md:p-4 p-2'>
					<StoryNav />
				</div>
				<div className='hidden md:flex justify-end items-center flex-[1] p-4'>
					<NotificationDropdown />
				</div>
			</div>
		</div>
	);
}

export default TopNav;
