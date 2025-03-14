import React from 'react';

import BlockButton from './BlockButton';

const OtherUsersSettings = ({ user }) => {
	return (
		<div className=' bg-lightMode-section dark:bg-darkMode-section rounded-2xl p-5'>
			<h2 className='text-xl font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-4 text-center'>
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
