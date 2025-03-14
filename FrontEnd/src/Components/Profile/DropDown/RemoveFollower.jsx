import React, { useState } from 'react';
import { useRemoveFollowerMutation } from '../../../CustomHooks/useRemoveFollowerMutation';
import { useAlert } from '../../../Contexts/AlertContext';

function RemoveFollower({ user, onSuccess, onClick }) {
	const isFollower = user?.profile?.is_follower;
	if (!isFollower) return null;
	const { mutate: removeFollower, isLoading } = useRemoveFollowerMutation();
	const { showConfirm } = useAlert();

	const handleRemove = () => {
		if (onClick) onClick();
		showConfirm('Are you sure you want to remove this follower?', () => {
			removeFollower(user?.id, {
				onSuccess: (response) => {
					console.log(response);
					if (onSuccess) onSuccess(response.data);
				},
			});
		});
	};

	return (
		<button
			onClick={handleRemove}
			className='block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'>
			Remove Follower
		</button>
	);
}

export default RemoveFollower;
