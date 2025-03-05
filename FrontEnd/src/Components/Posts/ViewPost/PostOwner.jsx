import React from 'react';

function PostOwner({ user }) {
	const { username, email } = user;
	const { profile_image: profileImage } = user?.profile;

	return (
		<div className='flex items-center justify-between p-3 bg-lightMode-background dark:bg-darkMode-background rounded-lg border border-lightMode-accent/30 dark:border-darkMode-accent/30 shadow-sm'>
			<div className='flex items-center gap-3'>
				<img
					src={profileImage}
					alt='Profile'
					className='w-10 h-10 rounded-full object-cover border border-lightMode-accent dark:border-darkMode-accent'
				/>
				<div>
					<p className='text-sm font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
						{username}
					</p>
					<p className='text-xs text-lightMode-textSecondary dark:text-darkMode-textSecondary opacity-90'>
						{email}
					</p>
				</div>
			</div>
		</div>
	);
}

export default PostOwner;
