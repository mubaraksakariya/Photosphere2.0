import React, { useState } from 'react';

function CommentInput() {
	const [newComment, setNewComment] = useState('');
	const handlePostComment = () => {
		if (newComment.trim() === '') return;
		console.log('Posting comment:', newComment);
		setNewComment('');
	};

	return (
		<div className='mt-2 flex items-center p-3 bg-lightMode-background dark:bg-darkMode-background rounded-lg'>
			<input
				type='text'
				className='flex-1 outline-none bg-transparent text-sm text-lightMode-textPrimary dark:text-darkMode-textPrimary placeholder-lightMode-textSecondary dark:placeholder-darkMode-textSecondary'
				placeholder='Add a comment...'
				value={newComment}
				onChange={(e) => setNewComment(e.target.value)}
			/>
			<button
				onClick={handlePostComment}
				className={`text-sm font-semibold transition ${
					newComment.trim() === ''
						? 'text-gray-400 cursor-not-allowed'
						: 'text-lightMode-accent dark:text-darkMode-accent hover:opacity-80'
				}`}
				disabled={newComment.trim() === ''}>
				Post
			</button>
		</div>
	);
}

export default CommentInput;
