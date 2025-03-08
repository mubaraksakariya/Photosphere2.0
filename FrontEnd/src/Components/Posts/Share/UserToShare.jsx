import React from 'react';
import useUserChatRoom from '../../../CustomHooks/useUserChatRoom';

function UserToShare({ user, selectedUsers, toggleUserSelection }) {
	const { mutate, isLoading } = useUserChatRoom(user?.id);

	const handleCheckboxChange = () => {
		// If user is already selected, simply toggle without calling mutate
		if (selectedUsers[user.id]) {
			toggleUserSelection(user.id, null);
			return;
		}

		// Otherwise, fetch the chat room ID
		mutate(
			{},
			{
				onSuccess: (data) => {
					if (data?.chat_room?.id) {
						toggleUserSelection(user.id, data.chat_room.id);
					}
				},
				onError: (error) => {
					console.error('Failed to fetch chat room:', error);
				},
			}
		);
	};

	return (
		<li
			key={user.id}
			className='flex items-center gap-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md'>
			<input
				type='checkbox'
				checked={selectedUsers[user.id] !== undefined}
				onChange={handleCheckboxChange}
				className='w-4 h-4'
				disabled={isLoading}
			/>
			<span className='text-gray-900 dark:text-white'>
				{user.username}
			</span>
		</li>
	);
}

export default UserToShare;
