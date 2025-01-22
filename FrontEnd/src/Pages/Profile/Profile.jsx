import React from 'react';
import Header from '../../Components/Profile/Header/Header';

function Profile() {
	return (
		<div className='min-h-[100dvh] flex flex-col bg-lightMode-background dark:bg-darkMode-background text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
			<div className='px-4 md:px-6 lg:px-8'>
				<div className='bg-lightMode-section dark:bg-darkMode-section shadow-light dark:shadow-dark py-4 px-6'>
					<Header />
				</div>
			</div>
			<div className='flex flex-1 gap-4 p-4 md:p-6 lg:p-8'>posts</div>
		</div>
	);
}

export default Profile;
