import React from 'react';
import { useSelector } from 'react-redux';
import ProfileImage from './ProfileImage';
import FollowButton from './FollowButton';

function Header({ user }) {
	// const user = useSelector((state) => state.auth.user);
	const followers_count = user?.profile?.followers_count || 0;
	const following_count = user?.profile?.following_count || 0;
	const post_count = user?.profile?.post_count || 0;
	const bio = user?.profile?.bio || '';
	const isOwnProfile = user?.profile?.is_own_profile;

	return (
		<div className='flex flex-col md:flex-row items-center gap-4 p-4 bg-lightMode-section dark:bg-darkMode-section  rounded-md max-w-5xl mx-auto'>
			<div className='flex-shrink-0'>
				<ProfileImage user={user} />
			</div>
			<div className='w-full'>
				{/* Username and follow button */}
				<div className='flex flex-col md:flex-row md:items-center justify-between'>
					<div className='text-xl font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
						{user.username}
					</div>
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
						<span>Followers</span>
					</div>
					<div className='text-center'>
						<span className='block font-medium text-lightMode-accent dark:text-darkMode-accent'>
							{post_count}
						</span>
						<span>Posts</span>
					</div>
					<div className='text-center'>
						<span className='block font-medium text-lightMode-accent dark:text-darkMode-accent'>
							{following_count}
						</span>
						<span>Following</span>
					</div>
				</div>

				{/* Bio */}
				<div className='mt-4 text-sm text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
					<span className='font-semibold'>About: </span>
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
	);
}

export default Header;
