import React from 'react';
import FollowButton from '../Header/FollowButton';

const UserDetails = ({ user }) => {
	if (!user) {
		return (
			<div className='text-center text-lg text-red-500'>
				No user details available.
			</div>
		);
	}

	const { first_name, last_name, bio, date_of_birth } = user.profile || {};
	const { email, username } = user;

	return (
		<div className='p-6 md:p-8 bg-lightMode-section dark:bg-darkMode-section rounded-2xl max-w-lg mx-auto'>
			<h2 className='text-3xl font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-2 text-center'>
				{first_name} {last_name}
			</h2>
			<p className='text-center text-lightMode-accent dark:text-darkMode-accent mb-4 text-sm'>
				{bio || 'No bio available'}
			</p>

			{/* Follow Button Centered Below Username */}
			<div className='flex justify-center mb-6'>
				<FollowButton user={user} />
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<div>
					<span className='block text-lightMode-textPrimary dark:text-darkMode-textPrimary font-medium'>
						Date of Birth:
					</span>
					<span className='block text-gray-600 dark:text-gray-400'>
						{date_of_birth || 'N/A'}
					</span>
				</div>
				<div>
					<span className='block text-lightMode-textPrimary dark:text-darkMode-textPrimary font-medium'>
						Email:
					</span>
					<span className='block text-gray-600 dark:text-gray-400'>
						{email || 'N/A'}
					</span>
				</div>
				<div className='md:col-span-2'>
					<span className='block text-lightMode-textPrimary dark:text-darkMode-textPrimary font-medium'>
						Username:
					</span>
					<span className='block text-gray-600 dark:text-gray-400'>
						{username || 'N/A'}
					</span>
				</div>
			</div>
		</div>
	);
};

export default UserDetails;
