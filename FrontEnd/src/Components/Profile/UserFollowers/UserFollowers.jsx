import React from 'react';
import useFollowers from '../../../CustomHooks/useFollowers';
import ProfileCard from '../ProfileCard';
import LoadingRing from '../../Loading/LoadingRing';

const UserFollowers = ({ userId }) => {
	const { data, isLoading, error } = useFollowers(userId);
	const followers = data?.followers;

	if (isLoading) {
		return <LoadingRing />;
	}

	if (error) {
		return (
			<div>
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

	return (
		<div className=' bg-lightMode-section dark:bg-darkMode-section rounded-2xl p-5'>
			<h2 className='text-xl font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-4 text-center'>
				Followers
			</h2>

			{followers?.length === 0 ? (
				<p className='text-gray-500 text-center'>No followers yet.</p>
			) : (
				<div className='flex flex-wrap justify-center gap-4'>
					{followers.map((follower) => (
						<ProfileCard user={follower} key={follower.id} />
					))}
				</div>
			)}
		</div>
	);
};

export default UserFollowers;
