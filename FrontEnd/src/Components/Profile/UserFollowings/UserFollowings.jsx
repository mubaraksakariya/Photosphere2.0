import React from 'react';
import ProfileCard from '../ProfileCard';
import useFollowings from '../../../CustomHooks/useFollowings';
import LoadingRing from '../../Loading/LoadingRing';

const UserFollowings = ({ userId }) => {
	const { data, isLoading, error } = useFollowings(userId);
	const followings = data?.followings;

	if (isLoading) {
		return <LoadingRing />;
	}

	if (error) {
		return (
			<div className='text-red-500 text-center p-4'>
				Error loading followings: {error.message}
			</div>
		);
	}

	return (
		<div className='p-4 md:p-6 bg-lightMode-section dark:bg-darkMode-section rounded-2xl shadow-md'>
			<h2 className='text-xl font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-4'>
				Followings
			</h2>

			{followings?.length === 0 ? (
				<p className='text-gray-500 text-center'>No followings yet.</p>
			) : (
				<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
					{followings.map((following) => (
						<ProfileCard user={following} key={following.id} />
					))}
				</div>
			)}
		</div>
	);
};

export default UserFollowings;
