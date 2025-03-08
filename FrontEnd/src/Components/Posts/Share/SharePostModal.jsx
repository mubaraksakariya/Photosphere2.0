import React, { useState } from 'react';
import UsersList from './UsersList';
import { useChatSocket } from '../../../Contexts/ChatSocketContext';
import { useDispatch } from 'react-redux';
import { closeSharePostModal } from '../../../Store/Slices/ModalSlice';

function SharePostModal({ sharedPost = {}, onShare, onClose }) {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedUsers, setSelectedUsers] = useState([]);
	const dispatch = useDispatch();

	const { sendChatMessage } = useChatSocket();

	const toggleUserSelection = (userId, chatRoomId) => {
		setSelectedUsers((prev) => {
			const newSelection = { ...prev };
			if (newSelection[userId]) {
				delete newSelection[userId];
			} else {
				newSelection[userId] = chatRoomId;
			}
			return newSelection;
		});
	};

	const handleShare = () => {
		if (Object.keys(selectedUsers).length === 0) return;

		Object.entries(selectedUsers).forEach(([userId, chatRoomId]) => {
			const message = {
				type: 'shared-post',
				data: sharedPost.id,
				chat_room_id: chatRoomId,
			};
			sendChatMessage(message);
		});

		if (onShare) onShare(sharedPost, selectedUsers);
		if (onClose) onClose();
		dispatch(closeSharePostModal());
	};

	const handleCopyLink = () => {
		navigator.clipboard.writeText(
			`${window.location.origin}/post/${sharedPost.id}`
		);
		alert('Link copied!');
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
			<div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96'>
				<h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
					Share Post
				</h2>
				<input
					type='text'
					placeholder='Search users...'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className='w-full p-2 border rounded-md text-gray-900 dark:text-white dark:bg-gray-700'
				/>
				<UsersList
					toggleUserSelection={toggleUserSelection}
					selectedUsers={selectedUsers}
					searchTerm={searchTerm}
				/>
				<div className='flex justify-between mt-4'>
					<button
						onClick={handleCopyLink}
						className='px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-md'>
						Copy Link
					</button>
					<button
						onClick={handleShare}
						disabled={selectedUsers.length === 0}
						className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:bg-gray-400'>
						Share
					</button>
					<button
						onClick={() => {
							onClose;
							dispatch(closeSharePostModal());
						}}
						className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md'>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}

export default SharePostModal;
