import React, { useEffect } from 'react';
import Comment from './Comment';
import useInfinitePostComments from '../../../CustomHooks/useInfinitePostComments';
import { useInView } from 'react-intersection-observer';
import LoadingRing from '../../Loading/LoadingRing';
import CommentInput from './CommentInput';

function CommentsSection({ post }) {
	const { ref, inView } = useInView();

	const {
		data,
		isLoading,
		isError,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
		error,
	} = useInfinitePostComments(post?.id);

	useEffect(() => {
		if (inView && hasNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, fetchNextPage]);

	// Extract all comments
	const comments = data?.pages.flatMap((page) => page.results) || [];

	return (
		<>
			<div className='flex flex-1 mt-4 flex-col overflow-y-auto rounded-lg'>
				<div className='flex flex-1 flex-col-reverse overflow-y-auto p-3'>
					{/* Show loading state initially */}
					{isLoading && (
						<div className='flex justify-center items-center h-full'>
							<LoadingRing />
						</div>
					)}
					{/* Show error if something goes wrong */}
					{isError && (
						<div className='flex justify-center py-4 text-red-500'>
							Error loading comments. Please try again.
						</div>
					)}
					{/* If no comments exist, show a message */}
					{!isLoading && !isError && comments.length === 0 && (
						<div className='flex justify-center py-4 text-gray-500'>
							No comments yet. Be the first to comment!
						</div>
					)}
					{/* Render comments if available */}
					{!isLoading &&
						!isError &&
						comments.map((comment) => (
							<Comment key={comment.id} comment={comment} />
						))}
					{/* Show loading when fetching more */}
					{isFetchingNextPage && (
						<div className='flex justify-center py-4 text-lightMode-textSecondary dark:text-darkMode-textSecondary'>
							<LoadingRing />
						</div>
					)}
					{/* Infinite Scroll Trigger */}
					<div ref={ref} className='h-5'></div>
				</div>
			</div>
			{/* Comment Input */}
			<CommentInput post={post} />
		</>
	);
}

export default CommentsSection;
