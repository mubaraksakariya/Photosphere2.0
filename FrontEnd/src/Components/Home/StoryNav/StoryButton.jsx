import React from 'react';
import { useDispatch } from 'react-redux';
import { openViewStoryModal } from '../../../Store/Slices/ModalSlice';

function StoryButton({ story }) {
	const dispatch = useDispatch();
	const manageStoryRead = () => {
		dispatch(openViewStoryModal({ story: story }));
	};

	return (
		<div className='flex items-center justify-center p-1 py-2'>
			<button
				onClick={manageStoryRead}
				type='button'
				aria-label={`View story of ${story?.user?.username}`}
				className={`relative md:w-16 w-12 aspect-square rounded-full transition-transform hover:scale-105 ${
					story?.is_viewed
						? ''
						: 'ring-4 ring-lightMode-highlight dark:ring-darkMode-highlight'
				} hover:shadow-light dark:hover:shadow-dark`}>
				{/* Profile Image */}
				<span className='block w-full h-full rounded-full overflow-hidden'>
					<img
						src={story?.user?.profile.profile_image}
						alt={`${story?.user?.username}'s profile`}
						className='w-full h-full object-cover border border-lightMode-shadow dark:border-darkMode-shadow'
					/>
				</span>
			</button>
		</div>
	);
}

export default StoryButton;
