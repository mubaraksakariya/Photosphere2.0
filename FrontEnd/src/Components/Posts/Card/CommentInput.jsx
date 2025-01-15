import { useState } from 'react';
import useCreateComment from '../../../CustomHooks/useCreateComment';

const CommentInput = ({ post, setComments }) => {
	const [comment, setComment] = useState('');
	const { mutate, isPending } = useCreateComment();

	const handleSubmit = (e) => {
		e.preventDefault();
		if (comment.trim()) {
			const data = {
				post_id: post.id,
				comment,
			};

			mutate(data, {
				onSuccess: (response) => {
					console.log(response);
					setComments((oldComments) => [
						response.data.new_comment,
						...oldComments,
					]);
				},
				onError: (error) => {
					console.log(error);
				},
			});

			setComment('');
		}
	};

	return (
		<form onSubmit={handleSubmit} className='flex items-center gap-2 p-4'>
			<input
				type='text'
				value={comment}
				onChange={(e) => setComment(e.target.value)}
				placeholder='Write a comment...'
				className='flex-1 p-2 border border-lightMode-textPrimary dark:border-darkMode-textPrimary rounded-md bg-lightMode-background dark:bg-darkMode-background text-lightMode-textPrimary dark:text-darkMode-textPrimary'
			/>
			<button
				type='submit'
				className='px-4 py-2 bg-lightMode-accent dark:bg-darkMode-accent text-lightMode-background dark:text-darkMode-background rounded-md hover:bg-lightMode-accentHover dark:hover:bg-darkMode-accentHover transition'
				disabled={isPending}>
				{isPending ? 'Posting...' : 'Post'}
			</button>
		</form>
	);
};

export default CommentInput;
