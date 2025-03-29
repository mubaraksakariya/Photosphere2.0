import React from 'react';
import LoadingRing from '../../Loading/LoadingRing';

const SubmitSection = ({ onSubmit, onCancel, isLoading }) => {
	return (
		<div className='mt-2 flex justify-end space-x-2'>
			<button
				onClick={onSubmit}
				disabled={isLoading}
				className='py-2 px-4 rounded-md bg-lightMode-accent dark:bg-darkMode-accent text-lightMode-background dark:text-darkMode-background font-medium shadow-light dark:shadow-dark hover:opacity-90 focus:ring-2 focus:ring-lightMode-accent dark:focus:ring-darkMode-accent focus:outline-none transition-all'>
				{isLoading ? <LoadingRing /> : 'Submit'}
			</button>
			<button
				onClick={onCancel}
				disabled={isLoading}
				className='py-2 px-4 rounded-md bg-lightMode-textPrimary dark:bg-darkMode-textPrimary text-lightMode-background dark:text-darkMode-background font-medium shadow-light dark:shadow-dark hover:opacity-90 focus:ring-2 focus:ring-lightMode-textPrimary dark:focus:ring-darkMode-textPrimary focus:outline-none transition-all'>
				{isLoading ? 'Please Wait...' : 'Cancel'}
			</button>
		</div>
	);
};

export default SubmitSection;
