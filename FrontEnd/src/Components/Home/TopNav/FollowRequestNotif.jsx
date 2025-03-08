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
			className={`flex items-center cursor-pointer p-3 rounded-lg shadow-sm transition border-l-4
				${
					!is_read
						? 'bg-lightMode-highlight dark:bg-[#5C4B42] font-semibold border-lightMode-accent dark:border-darkMode-accent'
						: 'bg-lightMode-background dark:bg-darkMode-background text-lightMode-textSecondary dark:text-darkMode-textSecondary opacity-80 border-transparent'
				}
				hover:bg-lightMode-highlight dark:hover:bg-[#5C4B42]`}
			onClick={manageOpenProfile}>
			{/* Notification Content */}
			<div className='flex-1'>
				<p className='font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
					{profile?.first_name} {profile?.last_name}
				</p>
				<p className='text-lightMode-textPrimary dark:text-darkMode-textPrimary text-xs opacity-80'>
					{message}
				</p>
				<p className='text-xs text-lightMode-textPrimary dark:text-darkMode-textPrimary opacity-60'>
					{new Date(created_at).toLocaleString()}
				</p>

				{/* Action Buttons */}
				{!is_read && !isHandled && (
					<div className='flex space-x-2 mt-2'>
						<button
							onClick={onAccept}
							className='px-3 py-1 text-xs text-white bg-lightMode-accent dark:bg-darkMode-accent rounded-md font-medium transition 
									 hover:bg-[#705A4A] dark:hover:bg-[#927D6C]'>
							Accept
						</button>
						<button
							onClick={onDecline}
							className='px-3 py-1 text-xs text-white bg-red-500 dark:bg-red-600 rounded-md font-medium transition 
									 hover:bg-red-600 dark:hover:bg-red-700'>
							Decline
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default FollowRequestNotif;
