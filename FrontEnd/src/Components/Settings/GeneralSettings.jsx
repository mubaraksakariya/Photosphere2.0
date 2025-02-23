import React from 'react';
import DarkModeToggle from '../Theme/DarkModeToggle';

const GeneralSettings = ({ currentUser }) => {
	return (
		<div className='p-6 md:p-8 bg-lightMode-section dark:bg-darkMode-section rounded-2xl dark:shadow-xl max-w-3xl mx-auto'>
			<h2 className='text-xl font-bold text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-6 text-center'>
				GeneralSettings
			</h2>
			<div className='space-y-6'>
				<div className='flex items-center justify-between'>
					<span className='text-lightMode-textPrimary dark:text-darkMode-textPrimary font-medium'>
						Theme
					</span>
					<DarkModeToggle />
				</div>
				{/* <div
						key={name}
						className='flex items-center justify-between'>
						<span className='text-lightMode-textPrimary dark:text-darkMode-textPrimary font-medium'>
							{label}
						</span>
						<input
							type='checkbox'
							name={name}
							checked={formState[name]}
							onChange={handleChange}
							className='form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400'
						/>
					</div> */}

				{/* <div className='flex items-center justify-between'>
					<span className='text-lightMode-textPrimary dark:text-darkMode-textPrimary font-medium'>
						Language
					</span>
					<select
						name='language'
						value={formState.language}
						onChange={handleChange}
						className='p-2 border border-gray-300 dark:border-gray-600 bg-lightMode-background dark:bg-darkMode-background rounded-md'>
						<option value='en'>English</option>
						<option value='es'>Spanish</option>
					</select>
				</div> */}
			</div>
		</div>
	);
};

export default GeneralSettings;
