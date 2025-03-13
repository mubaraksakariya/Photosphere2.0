import React from 'react';
import { useSelector } from 'react-redux';
import ProfileImage from './ProfileImage';
import FollowButton from './FollowButton';

function Header({ user }) {
	const username = user?.username;
	const followers_count = user?.profile?.followers_count || 0;
	const following_count = user?.profile?.following_count || 0;
	const post_count = user?.profile?.post_count || 0;
	const bio = user?.profile?.bio || '';
	const isOwnProfile = user?.profile?.is_own_profile;

	return (
		<div className=' bg-lightMode-section dark:bg-darkMode-section rounded-lg'>
			<div className='flex items-center gap-0 md:gap-4 rounded-md max-w-5xl mx-auto p-2'>
				<div className='md:px-3 '>
					<ProfileImage user={user} />
				</div>
				<div className='w-full ms-3 md:mx-3'>
					{/* Username and follow button */}
					<div className='flex flex-col md:flex-row md:items-center justify-between'>
						<h1 className='text-sm md:text-xl font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary truncate'>
							{username}
						</h1>
						{!isOwnProfile && (
							<div className='hidden md:block'>
								<FollowButton user={user} />
							</div>
						)}
					</div>

					{/* Stats */}
					<div className='flex justify-between gap-4 mt-3 text-sm text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
						<div className='text-center'>
							<span className='block font-medium text-lightMode-accent dark:text-darkMode-accent'>
								{followers_count}
							</span>
							<span className='text-xs md:text-base font-semibold'>
								Followers
							</span>
						</div>
						<div className='text-center'>
							<span className='block font-medium text-lightMode-accent dark:text-darkMode-accent'>
								{post_count}
							</span>
							<span className='text-xs md:text-base font-semibold'>
								Posts
							</span>
						</div>
						<div className='text-center'>
							<span className='block font-medium text-lightMode-accent dark:text-darkMode-accent'>
								{following_count}
							</span>
							<span className='text-xs md:text-base font-semibold'>
								Following
							</span>
						</div>
					</div>

					{/* Bio */}
					<div className='mt-4 text-sm text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
						{bio || 'No bio available.'}
					</div>

					{/* Mobile follow button */}
					{!isOwnProfile && (
						<div className='pt-4 md:hidden flex justify-end'>
							<FollowButton user={user} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default Header;
