import React from 'react';
import { useDispatch } from 'react-redux';
import { openCreateStoryModal } from '../../../Store/Slices/ModalSlice';

function CreateStoryBtn() {
	const dispatch = useDispatch();

	const manageCreateStory = () => {
		dispatch(openCreateStoryModal());
	};

	return (
		<div className='flex items-center justify-center'>
			<button
				type='button'
				onClick={manageCreateStory}
				className='w-16 aspect-square flex justify-center items-center rounded-full bg-lightMode-accent dark:bg-darkMode-accent text-white shadow-light dark:shadow-dark transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lightMode-shadow dark:focus:ring-darkMode-shadow'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					strokeWidth={1.5}
					stroke='currentColor'
					className='w-8 h-8'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M12 4.5v15m7.5-7.5h-15'
					/>
				</svg>
			</button>
		</div>
	);
}

export default CreateStoryBtn;
