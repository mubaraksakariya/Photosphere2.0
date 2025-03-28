import React from 'react';
import useFollowers from '../../../CustomHooks/useFollowers';
import ProfileCard from '../ProfileCard';
import LoadingRing from '../../Loading/LoadingRing';

const UserFollowers = ({ userId }) => {
	const { data, isLoading, error } = useFollowers(userId);
	const followers = data?.followers || [];

	if (isLoading) {
		return (
			<div className='flex justify-center items-center h-full'>
				<LoadingRing />
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex justify-center items-center h-full'>
				{error.response?.data?.error ? (
					<p className='text-red-500 text-center p-4'>
						{error.response?.data?.error}
					</p>
				) : (
					<p className='text-red-500 text-center p-4'>
						Error loading followers: {error.message}
					</p>
				)}
			</div>
		);
	}
	if (followers?.length === 0)
		return (
			<div className='text-gray-500 flex justify-center items-center h-full'>
				No followers yet.
			</div>
		);

	return (
		<div className=' bg-lightMode-section dark:bg-darkMode-section rounded-2xl p-5'>
			<h2 className='text-xl font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-4 text-center'>
				Followers
			</h2>

			<div className='flex flex-wrap justify-center gap-4'>
				{followers.map((follower) => (
					<ProfileCard user={follower} key={follower.id} />
				))}
			</div>
		</div>
	);
};

export default UserFollowers;
