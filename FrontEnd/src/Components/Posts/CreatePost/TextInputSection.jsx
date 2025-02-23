import React from 'react';

const TextInputSection = ({
	label,
	value,
	onChange,
	placeholder,
	isTextArea = false,
}) => {
	return (
		<div className='mb-4'>
			<label className='block text-lg font-medium text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
				{label}
			</label>
			{isTextArea ? (
				<textarea
					value={value}
					onChange={onChange}
					className='mt-2 block w-full p-3 bg-lightMode-section dark:bg-darkMode-section text-lightMode-textPrimary dark:text-darkMode-textPrimary border border-lightMode-textPrimary dark:border-darkMode-textPrimary rounded-md shadow-light dark:shadow-dark focus:ring-2 focus:ring-lightMode-accent dark:focus:ring-darkMode-accent focus:outline-none transition-all resize-none h-[120px]'
					placeholder={placeholder}
				/>
			) : (
				<input
					type='text'
					value={value}
					onChange={onChange}
					className='mt-2 block w-full p-3 bg-lightMode-section dark:bg-darkMode-section text-lightMode-textPrimary dark:text-darkMode-textPrimary border border-lightMode-textPrimary dark:border-darkMode-textPrimary rounded-md shadow-light dark:shadow-dark focus:ring-2 focus:ring-lightMode-accent dark:focus:ring-darkMode-accent focus:outline-none transition-all h-[40px]'
					placeholder={placeholder}
				/>
			)}
		</div>
	);
};

export default TextInputSection;
