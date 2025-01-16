import React from 'react';
import { useSelector } from 'react-redux';
import CreateStoryBtn from './CreateStoryBtn';
import StoryButton from './StoryButton';

function StoryNav() {
	return (
		<div className='bg-lightMode-background dark:bg-darkMode-background flex gap-4 shadow-light dark:shadow-dark'>
			{/* Logo Section */}
			<div className='hidden md:flex flex-[2] justify-center items-center p-4'>
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

			{/* Stories Section */}
			<div className='flex-[10] flex gap-3 items-center overflow-x-auto p-4'>
				<CreateStoryBtn />
				<StoryButton />
				{/* Add more <StoryButton /> components dynamically if needed */}
			</div>
		</div>
	);
}

export default StoryNav;
