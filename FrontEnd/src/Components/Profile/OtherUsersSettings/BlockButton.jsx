import React, { useEffect, useState } from 'react';
import {
	useBlockUser,
	useUnblockUser,
} from '../../../CustomHooks/useBlockUsers';
import LoadingRing from '../../Loading/LoadingRing';
import { useAlert } from '../../../Contexts/AlertContext';

function BlockButton({ user }) {
	// Extract userId from the user prop
	const userId = user?.id;
	const { showConfirm, showSuccessAlert } = useAlert();
	// State to track if the user is blocked
	const [isBlocked, setIsBlocked] = useState();

	// Mutation hooks for blocking and unblocking users
	const {
		mutate: blockUser,
		isLoading: isBlocking,
		error: blockError,
	} = useBlockUser();
	const {
		mutate: unblockUser,
		isLoading: isUnblocking,
		error: unblockError,
	} = useUnblockUser();

	// Handler to block the user
	const handleBlock = () => {
		showConfirm('Are you sure you want to block this user?', () => {
			blockUser(userId, {
				onSuccess: (response) => {
					setIsBlocked(true);
					showSuccessAlert('User blocked successfully');
				},
			});
		});
	};

	// Handler to unblock the user
	const handleUnblock = () => {
		showConfirm('Are you sure you want to unblock this user?', () => {
			unblockUser(userId, {
				onSuccess: (response) => {
					setIsBlocked(false);
					showSuccessAlert('User unblocked successfully');
				},
			});
		});
	};

	// Update the blocked state when the user prop changes
	useEffect(() => {
		if (user) setIsBlocked(user.is_blocked_by_current_user);
	}, [user]);

	// Show loading indicator while performing mutations
	if (isBlocking || isUnblocking) {
		return <LoadingRing />;
	}

	// Show error message if there is an error
	if (blockError || unblockError) {
		return (
			<div className='text-center text-lg text-red-500'>
				Error: {blockError?.message || unblockError?.message}
			</div>
		);
	}

	return (
		<button
			onClick={isBlocked ? handleUnblock : handleBlock}
			className={`p-2 rounded-md ${
				isBlocked ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
			} hover:bg-opacity-80 transition`}>
			{isBlocked ? 'Unblock' : 'Block'}
		</button>
	);
}

export default BlockButton;
