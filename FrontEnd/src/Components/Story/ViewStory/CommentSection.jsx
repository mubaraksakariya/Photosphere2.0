import React from 'react';
import useAddStoryComment from '../../../CustomHooks/useAddStoryComment';

const CommentSection = ({ story }) => {
	const {
		mutate: addComment,
		isLoading,
		isError,
		error,
	} = useAddStoryComment();

	const handleSubmit = (event) => {
		event.preventDefault();
		const comment = event.target.comment.value.trim();
		if (comment) {
			console.log(comment);
			addComment(
				{ story_id: story.id, comment: comment },
				{
					onSuccess: (response) => {
						console.log(response);
						event.target.comment.value = '';
					},
					onerror: (error) => {
						console.log(error);
					},
				}
			);
		}
	};

	return (
		<form
			className='flex-grow flex items-center gap-2'
			onSubmit={handleSubmit}>
			<input
				type='text'
				name='comment'
				placeholder='Add a comment...'
				className='flex-grow px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-lightMode-accent dark:focus:ring-darkMode-accent'
				aria-label='Add a comment'
			/>
			<button
				type='submit'
				className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg'
				aria-label='Post Comment'>
				Post
			</button>
		</form>
	);
};

export default CommentSection;
