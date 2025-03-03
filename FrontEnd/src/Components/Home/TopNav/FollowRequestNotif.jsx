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

	const [isHandled, setIsHandled] = useState(false);
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
			onSuccess: () => {
				setIsHandled(true);
				queryClient.invalidateQueries(['followers']);
				showSuccessAlert(`${sender.email} follows you now`);
			},
		});
	};

	const onDecline = (e) => {
		e.stopPropagation();
		rejectFollowRequest.mutate(action_object_id, {
			onSuccess: () => {
				setIsHandled(true);
				queryClient.invalidateQueries(['follow-requests']);
				showErrorAlert('Rejected follow request');
			},
		});
	};

	const isUnread = !is_read;

	return (
		<div
			className={`cursor-pointer p-3 rounded-lg shadow-light dark:shadow-dark border-l-4 transition
			${
				isUnread
					? 'bg-lightMode-highlight dark:bg-darkMode-highlight font-semibold border-lightMode-accent dark:border-darkMode-accent'
					: 'bg-lightMode-background dark:bg-darkMode-background text-lightMode-textSecondary dark:text-darkMode-textSecondary opacity-80 border-transparent hover:border-lightMode-accent dark:hover:border-darkMode-accent'
			}
			hover:bg-lightMode-accent dark:hover:bg-darkMode-accent hover:text-lightMode-background dark:hover:text-darkMode-background`}
			onClick={manageOpenProfile}>
			{/* Notification Content */}
			<p className='text-sm text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
				<b>
					{sender.first_name} {sender.last_name}
				</b>{' '}
				{message}
			</p>
			<p className='text-xs text-lightMode-textPrimary dark:text-darkMode-textPrimary opacity-60'>
				{new Date(created_at).toLocaleString()}
			</p>

			{/* Action Buttons */}
			{isUnread && !isHandled && (
				<div className='flex space-x-2 mt-2'>
					<button
						onClick={onAccept}
						className='px-3 py-1 text-xs text-lightMode-background dark:text-darkMode-background bg-lightMode-accent dark:bg-darkMode-accent rounded-md font-medium transition hover:opacity-80'>
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
	);
}

export default FollowRequestNotif;
