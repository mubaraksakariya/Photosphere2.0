import React from 'react';

const UserHeader = ({ user }) => {
	const { username, email } = user;
	const { profile_image: profileImage } = user?.profile;
	return (
		<div className='flex justify-between items-center mb-2'>
			<div className='flex items-center gap-2 w-full min-w-0'>
				<img
					src={profileImage}
					alt={username}
					className='w-9 md:w-10 aspect-square rounded-full object-cover border border-lightMode-shadow dark:border-darkMode-shadow shrink-0'
				/>

				<div className='w-full min-w-0'>
					<p className='md:text-lg text-lightMode-textPrimary dark:text-darkMode-textPrimary font-semibold truncate'>
						{username}
					</p>
					<p className='text-xs md:text-sm text-lightMode-textSecondary dark:text-darkMode-textSecondary truncate'>
						{email}
					</p>
				</div>
			</div>
		</div>
	);
};
export default UserHeader;
