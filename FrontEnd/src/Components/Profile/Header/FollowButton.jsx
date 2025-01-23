import React, { useState, useEffect } from 'react';
import useCheckFollow from '../../../CustomHooks/useCheckFollow';
import useToggleFollow from '../../../CustomHooks/useToggleFollow';

function FollowButton({ user }) {
	const [isFollowed, setIsFollowed] = useState(
		user?.profile?.is_followed || false
	);

	// Fetch the follow status using the custom hook
	const { data, isLoading, refetch } = useCheckFollow(user?.id);
	const {
		mutate: toggleFollow,
		isSuccess,
		error,
		isPending,
	} = useToggleFollow();
	// Update the follow state when data is fetched
	useEffect(() => {
		// console.log(isFollowed);
		// console.log(user);

		if (data) {
			console.log(data);

			setIsFollowed(data.is_followed);
		}
	}, [data]);

	// Handle button click
	const handleToggle = () => {
		setIsFollowed((prev) => !prev);
		// if (onFollowToggle) onFollowToggle(!isFollowed);
		toggleFollow(user.id, {
			onSuccess: (response) => {
				refetch();
			},
			onError: (error) => {
				console.log(error.response.data.error);
				refetch();
			},
		});
	};

	return (
		<button
			onClick={handleToggle}
			disabled={isLoading}
			aria-label={isFollowed ? 'Unfollow user' : 'Follow user'}
			className={`md:px-4 md:py-2 px-2 py-1 rounded-lg text-sm font-medium transition-all 
				${
					isFollowed
						? 'bg-lightMode-section dark:bg-darkMode-section text-lightMode-textPrimary dark:text-darkMode-textPrimary hover:bg-lightMode-accent hover:text-white dark:hover:bg-darkMode-accent'
						: 'bg-lightMode-accent dark:bg-darkMode-accent text-white hover:opacity-90'
				}
				${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}>
			{isLoading || isPending ? (
				<span className='flex items-center'>
					<svg
						className='animate-spin h-4 w-4 mr-2 text-lightMode-shadow dark:text-darkMode-shadow'
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'>
						<circle
							className='opacity-25'
							cx='12'
							cy='12'
							r='10'
							stroke='currentColor'
							strokeWidth='4'></circle>
						<path
							className='opacity-75'
							fill='currentColor'
							d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
					</svg>
					Loading...
				</span>
			) : isFollowed ? (
				'Unfollow'
			) : (
				'Follow'
			)}
		</button>
	);
}

export default FollowButton;
