import React, { useState } from 'react';
import { usePostComment } from '../Utils/usePostComment';

function CommentInput({ post }) {
	const [newComment, setNewComment] = useState('');
	const { postComment, isPending, error } = usePostComment();

	const handlePostComment = (e) => {
		e.preventDefault();
		if (newComment.trim() === '') return;
		postComment(post, newComment, () => setNewComment(''));
	};

	return (
		<form
			className='mt-2 flex items-center p-3 bg-lightMode-background dark:bg-darkMode-background rounded-lg'
			onSubmit={handlePostComment}>
			<input
				type='text'
				className='flex-1 outline-none bg-transparent text-sm text-lightMode-textPrimary dark:text-darkMode-textPrimary placeholder-lightMode-textSecondary dark:placeholder-darkMode-textSecondary'
				placeholder='Add a comment...'
				value={newComment}
				onChange={(e) => setNewComment(e.target.value)}
			/>
			<button
				type='submit'
				className={`text-sm font-semibold transition ${
					newComment.trim() === ''
						? 'text-gray-400 cursor-not-allowed'
						: 'text-lightMode-accent dark:text-darkMode-accent hover:opacity-80'
				}`}
				disabled={newComment.trim() === ''}>
				Post
			</button>
		</form>
	);
}

export default CommentInput;
