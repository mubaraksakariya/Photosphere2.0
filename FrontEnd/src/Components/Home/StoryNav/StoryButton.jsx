import React from 'react';
import { useSelector } from 'react-redux';

function StoryButton() {
	const currentUser = useSelector((state) => state.auth.user);

	return (
		<div className='flex items-center justify-center'>
			<button
				type='button'
				className='w-16 aspect-square flex justify-center items-center rounded-full overflow-hidden bg-lightMode-background dark:bg-darkMode-background shadow-light dark:shadow-dark transition-transform hover:scale-105'>
				<span className='w-14 aspect-square block rounded-full overflow-hidden'>
					<img
						src={currentUser.profile_image}
						alt={`${currentUser.username}'s profile`}
						className='w-full h-full object-cover'
					/>
				</span>
			</button>
		</div>
	);
}

export default StoryButton;
