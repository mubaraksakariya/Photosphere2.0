import React from 'react';

import BlockButton from './BlockButton';

const OtherUsersSettings = ({ user }) => {
	return (
		<div className='p-4 md:p-6 bg-lightMode-section dark:bg-darkMode-section rounded-2xl shadow-md'>
			<h2 className='text-xl font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-4'>
				User Settings
			</h2>
			<div className='flex items-center justify-between'>
				<span className='text-lightMode-textPrimary dark:text-darkMode-textPrimary font-medium'>
					Block User
				</span>
				<BlockButton user={user} />
			</div>
		</div>
	);
};

export default OtherUsersSettings;
