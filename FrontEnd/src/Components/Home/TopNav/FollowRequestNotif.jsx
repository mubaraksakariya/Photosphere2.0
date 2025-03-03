import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
	useAcceptFollowRequest,
	useRejectFollowRequest,
} from '../../../CustomHooks/useFollowRequest';
import { useQueryClient } from '@tanstack/react-query';
import { useAlert } from '../../../Contexts/AlertContext';

function FollowRequestNotif({ notification }) {
	if (!notification) return null;

	const { sender, message, created_at, is_read, action_object_id } =
		notification;
	const { profile } = sender;

	const [isHandled, setIsHandled] = useState(false); // Track UI changes
	const queryClient = useQueryClient();
	const acceptFollowRequest = useAcceptFollowRequest();
	const rejectFollowRequest = useRejectFollowRequest();
	const navigate = useNavigate();
	const { showSuccessAlert, showErrorAlert } = useAlert();

	const manageOpenProfile = () => {
		navigate(`/profile/${sender.id}`);
	};

	const onAccept = (e) => {
		e.stopPropagation();
		acceptFollowRequest.mutate(action_object_id, {
			onSuccess: (response) => {
				console.log(response);
				setIsHandled(true); // Hide buttons
				queryClient.invalidateQueries(['followers']); // Refresh followers list
				showSuccessAlert(`${sender.email} follows you now`);
			},
		});
	};

	const onDecline = (e) => {
		e.stopPropagation();
		rejectFollowRequest.mutate(action_object_id, {
			onSuccess: () => {
				setIsHandled(true); // Hide notification
				queryClient.invalidateQueries(['follow-requests']); // Refresh pending requests
				showErrorAlert('Rejected follow request');
			},
		});
	};

	return (
		<div
			className='flex items-center cursor-pointer p-3 bg-lightMode-background dark:bg-darkMode-background rounded-lg shadow-sm hover:bg-lightMode-highlight dark:hover:bg-darkMode-highlight transition'
			onClick={manageOpenProfile}>
			{/* Profile Image */}
			<img
				src={profile?.profile_image || '/default-profile.png'}
				alt='Profile'
				className='w-10 h-10 rounded-full border-2 border-lightMode-accent dark:border-darkMode-accent'
			/>

			<div className='flex-1 ml-3'>
				{/* Notification Content */}
				<div className='text-sm'>
					<p className='font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
						{profile?.first_name} {profile?.last_name}
					</p>
					<p className='text-lightMode-textPrimary dark:text-darkMode-textPrimary text-xs opacity-80'>
						{message}
					</p>
					<p className='text-xs text-lightMode-textPrimary dark:text-darkMode-textPrimary opacity-60'>
						{new Date(created_at).toLocaleString()}
					</p>
				</div>

				{/* Action Buttons */}
				{!is_read && !isHandled && (
					<div className='flex space-x-2 mt-2'>
						<button
							onClick={onAccept}
							className='px-3 py-1 text-xs text-white bg-lightMode-accent dark:bg-darkMode-accent rounded-md font-medium transition hover:opacity-80'>
							Accept
						</button>
						<button
							onClick={onDecline}
							className='px-3 py-1 text-xs text-white bg-red-500 dark:bg-red-600 rounded-md font-medium transition hover:opacity-80'>
							Decline
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default FollowRequestNotif;
