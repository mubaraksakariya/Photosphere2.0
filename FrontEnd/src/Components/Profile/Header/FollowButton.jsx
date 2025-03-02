import React, { useState, useEffect } from 'react';
import useCheckFollow from '../../../CustomHooks/useCheckFollow';
import useToggleFollow from '../../../CustomHooks/useToggleFollow';

function FollowButton({ user }) {
	const [followStatus, setFollowStatus] = useState(
		user?.profile?.follow_status || 'not_followed'
	);

	// Fetch the follow status using the custom hook
	const { data, isLoading, refetch } = useCheckFollow(user?.id);
	const { mutate: toggleFollow, isPending } = useToggleFollow();

	// Update the follow state when data is fetched
	useEffect(() => {
		if (data) {
			setFollowStatus(data?.follow_status);
		}
	}, [data]);

	// Handle button click
	const handleToggle = () => {
		toggleFollow(user.id, {
			onSuccess: (response) => {
				console.log(response.data.follow_data.status);
				// setFollowStatus(response.data.follow_data.status);
				refetch();
			},
			onError: (error) => {
				console.log(error);
				console.log(error.response?.data?.error || 'An error occurred');
				refetch();
			},
		});
	};

	// Determine button text based on follow status
	const getButtonText = () => {
		if (isPending) return 'Loading...';
		if (followStatus === 'followed') return 'Unfollow';
		if (followStatus === 'requested') return 'Cancel Request';
		return 'Follow';
	};

	return (
		<button
			onClick={handleToggle}
			disabled={isPending}
			aria-label={getButtonText()}
			className={`md:px-4 md:py-2 px-2 py-1 rounded-lg text-sm font-medium transition-all 
				${
					followStatus === 'followed'
						? 'bg-lightMode-section dark:bg-darkMode-section text-lightMode-textPrimary dark:text-darkMode-textPrimary hover:bg-lightMode-accent hover:text-white dark:hover:bg-darkMode-accent'
						: 'bg-lightMode-accent dark:bg-darkMode-accent text-white hover:opacity-90'
				}
				${isPending ? 'cursor-not-allowed opacity-50' : ''}`}>
			{getButtonText()}
		</button>
	);
}

export default FollowButton;
