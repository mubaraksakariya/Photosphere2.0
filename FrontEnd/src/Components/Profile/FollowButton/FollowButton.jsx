import React, { useEffect, useState } from 'react';
import useToggleFollow from '../../../CustomHooks/useToggleFollow';
import useCheckFollow from '../../../CustomHooks/useCheckFollow';

function FollowButton({ user }) {
	const {
		data: checkFollowData,
		isLoading: checkFollowLoading,
		error: checkFollowError,
	} = useCheckFollow(user.id);
	const { mutate: toggleFollow, isLoading: toggleLoading } =
		useToggleFollow();

	const [isFollowing, setIsFollowing] = useState(false);

	// Sync initial following state from API response
	useEffect(() => {
		if (checkFollowData?.is_following !== undefined) {
			setIsFollowing(checkFollowData.is_following);
		}
	}, [checkFollowData]);

	const handleToggleFollow = () => {
		toggleFollow(user.id, {
			onSuccess: (response) => {
				console.log('following/unfollowing success', response);

				setIsFollowing(response.data.is_following);
			},
			onError: (error) => {
				console.error('Error toggling follow:', error);
			},
		});
	};

	if (checkFollowLoading) return <div>Loading...</div>;
	if (checkFollowError) return <div>Error</div>;
	return (
		<div
			onClick={handleToggleFollow}
			className=' flex-1 cursor-pointer text-lightMode-accent dark:text-darkMode-accent hover:text-lightMode-textPrimary dark:hover:text-darkMode-textPrimary transition-colors'>
			{isFollowing ? (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					strokeWidth={1.5}
					stroke='currentColor'
					className='w-6 h-6'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z'
					/>
				</svg>
			) : (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					strokeWidth={1.5}
					stroke='currentColor'
					className='w-6 h-6'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z'
					/>
				</svg>
			)}
		</div>
	);
}

export default FollowButton;
