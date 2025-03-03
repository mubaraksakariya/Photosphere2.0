import React, { useEffect, useState } from 'react';
import useToggleFollow from '../../../CustomHooks/useToggleFollow';
import useCheckFollow from '../../../CustomHooks/useCheckFollow';
import { Hourglass, Loader, Plus, UserMinus, UserPlus } from 'lucide-react';

function FollowButton({ user }) {
	const { data, isLoading, error } = useCheckFollow(user.id);
	const { mutate: toggleFollow, isLoading: toggleLoading } =
		useToggleFollow();
	const [followState, setFollowState] = useState(null);

	// Sync initial following state
	useEffect(() => {
		if (data?.follow_status) setFollowState(data.follow_status);
	}, [data]);
	console.log(followState);

	const handleToggleFollow = () => {
		toggleFollow(user.id, {
			onSuccess: (response) =>
				setFollowState(response.data.follow_data.status),
			onError: (error) => console.error('Error toggling follow:', error),
		});
	};

	if (isLoading) return <Loader className='w-5 h-5 animate-spin' />;
	if (error) return null;

	const iconMap = {
		none: <UserPlus className='w-5 h-5' />,
		requested: <Hourglass className='w-5 h-5' />,
		followed: <UserMinus className='w-5 h-5' />,
	};

	return (
		<div
			onClick={handleToggleFollow}
			className='flex cursor-pointer text-lightMode-accent dark:text-darkMode-accent hover:text-lightMode-textPrimary dark:hover:text-darkMode-textPrimary transition-colors'>
			{toggleLoading ? (
				<Loader className='w-5 h-5 animate-spin' />
			) : (
				iconMap[followState] || <Plus className='w-5 h-5' />
			)}
		</div>
	);
}

export default FollowButton;
