import React from 'react';
import { useDispatch } from 'react-redux';
import { openViewStoryModal } from '../../../Store/Slices/ModalSlice';

function StoryButton({ story }) {
	const dispatch = useDispatch();
	const manageStoryRead = () => {
		dispatch(openViewStoryModal({ story: story }));
	};

	return (
		<div className='flex items-center justify-center'>
			<button
				onClick={manageStoryRead}
				type='button'
				aria-label={`View story of ${story?.user?.username}`}
				className={`w-16 aspect-square flex justify-center items-center rounded-full overflow-hidden transition-transform hover:scale-105 ${
					story?.is_viewed
						? ''
						: 'ring-4 ring-lightMode-highlight dark:ring-darkMode-highlight'
				} hover:shadow-light dark:hover:shadow-dark`}>
				<span className='w-14 aspect-square block rounded-full overflow-hidden'>
					<img
						src={story?.user?.profile_image}
						alt={`${story?.user?.username}'s profile`}
						className='w-full h-full object-cover border border-lightMode-shadow dark:border-darkMode-shadow'
					/>
				</span>
			</button>
		</div>
	);
}

export default StoryButton;
