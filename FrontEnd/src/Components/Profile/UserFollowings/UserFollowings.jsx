import React from 'react';
import ProfileCard from '../ProfileCard';
import useFollowings from '../../../CustomHooks/useFollowings';
import LoadingRing from '../../Loading/LoadingRing';

const UserFollowings = ({ userId }) => {
	const { data, isLoading, error } = useFollowings(userId);
	const followings = data?.followings || [];

	if (isLoading) {
		return (
			<div className='flex justify-center items-center h-full'>
				<LoadingRing />
			</div>
		);
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
						Error loading followings: {error.message}
					</p>
				)}
			</div>
		);
	}
	if (followings?.length === 0)
		return (
			<div className='text-gray-500 flex justify-center items-center h-full'>
				No followings yet.
			</div>
		);

	return (
		<div className=' bg-lightMode-section dark:bg-darkMode-section rounded-2xl p-5'>
			<h2 className='text-xl text-center font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-4'>
				Followings
			</h2>

			<div className='flex flex-wrap justify-center gap-4'>
				{followings.map((following) => (
					<ProfileCard user={following} key={following.id} />
				))}
			</div>
		</div>
	);
};

export default UserFollowings;
