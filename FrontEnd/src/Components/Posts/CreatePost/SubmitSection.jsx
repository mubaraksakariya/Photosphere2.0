import React from 'react';

const SubmitSection = ({ onSubmit, onCancel }) => {
	return (
		<div className='mt-4 flex justify-end space-x-2'>
			<button
				onClick={onSubmit}
				className='py-2 px-4 rounded-md bg-lightMode-accent dark:bg-darkMode-accent text-lightMode-background dark:text-darkMode-background font-medium shadow-light dark:shadow-dark hover:opacity-90 focus:ring-2 focus:ring-lightMode-accent dark:focus:ring-darkMode-accent focus:outline-none transition-all'>
				Submit
			</button>
			<button
				onClick={onCancel}
				className='py-2 px-4 rounded-md bg-lightMode-textPrimary dark:bg-darkMode-textPrimary text-lightMode-background dark:text-darkMode-background font-medium shadow-light dark:shadow-dark hover:opacity-90 focus:ring-2 focus:ring-lightMode-textPrimary dark:focus:ring-darkMode-textPrimary focus:outline-none transition-all'>
				Cancel
			</button>
		</div>
	);
};

export default SubmitSection;
