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
			<div className='text-red-500 text-center p-4'>
				Error loading followers: {error.message}
			</div>
		);
	}

	return (
		<div>
			<h2 className='text-xl text-center font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-4'>
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
