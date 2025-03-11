import React from 'react';
import { UserX, Loader } from 'lucide-react';
import { useRemoveFollowerMutation } from '../../../CustomHooks/useRemoveFollowerMutation';

function RemoveFollowerButton({ followerId, onSuccess }) {
	const { mutate: removeFollower, isLoading } = useRemoveFollowerMutation();

	const handleRemove = () => {
		removeFollower(followerId, {
			onSuccess: (response) => {
				console.log(response);
				if (onSuccess) onSuccess(response.data);
			},
		});
	};

	return (
		<div
			onClick={handleRemove}
			className='flex cursor-pointer text-lightMode-textPrimary dark:text-darkMode-textPrimary hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200'
			title='Remove follower'>
			{isLoading ? (
				<Loader className='w-5 h-5 animate-spin' />
			) : (
				<UserX className='w-5 h-5' />
			)}
		</div>
	);
}

export default RemoveFollowerButton;
