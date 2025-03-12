import React, { useState } from 'react';
import UsersList from '../Posts/Share/UsersList';
import { useChatSocket } from '../../Contexts/ChatSocketContext';
import { useDispatch } from 'react-redux';
import { closeSharePostModal } from '../../Store/Slices/ModalSlice';
import { X } from 'lucide-react';
import { useAlert } from '../../Contexts/AlertContext';

function SharePostModal({ sharedPost = {}, onShare, onClose }) {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedUsers, setSelectedUsers] = useState({});
	const dispatch = useDispatch();
	const { showSuccessAlert } = useAlert();
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
		showSuccessAlert('Post shared successfully!');
	};

	const handleCopyLink = () => {
		navigator.clipboard.writeText(
			`${window.location.origin}/post/${sharedPost.id}`
		);
		showSuccessAlert('Link copied to clipboard!');
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm'>
			<div className='bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-96 relative'>
				<button
					onClick={() => {
						onClose?.();
						dispatch(closeSharePostModal());
					}}
					className='absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'>
					<X size={20} />
				</button>

				<h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center'>
					Share Post
				</h2>

				<input
					type='text'
					placeholder='Search users...'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className='w-full p-3 border border-gray-300 rounded-lg text-gray-900 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all'
				/>

				<div className='mt-3 max-h-40 overflow-y-auto custom-scrollbar'>
					<UsersList
						toggleUserSelection={toggleUserSelection}
						selectedUsers={selectedUsers}
						searchTerm={searchTerm}
					/>
				</div>

				<div className='flex justify-between items-center mt-5 space-x-2'>
					<button
						onClick={handleCopyLink}
						className='flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-all'>
						Copy Link
					</button>

					<button
						onClick={handleShare}
						disabled={Object.keys(selectedUsers).length === 0}
						className='flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed'>
						Share
					</button>
				</div>
			</div>
		</div>
	);
}

export default SharePostModal;
