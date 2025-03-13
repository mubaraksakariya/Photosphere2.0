import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import PostContent from '../../Components/Posts/ViewPost/PostContent';
import PostActions from '../../Components/Posts/ViewPost/PostActions';
import usePost from '../../CustomHooks/usePost';
import LoadingRing from '../../Components/Loading/LoadingRing';
import PostDetails from '../../Components/Posts/ViewPost/PostDetails';
import ClosBtn from '../../Components/Posts/ViewPost/ClosBtn';
import PostOwner from '../../Components/Posts/ViewPost/PostOwner';

function PostPage() {
	const { postId } = useParams();
	const [showComments, setShowComments] = useState(false);
	const navigate = useNavigate();
	const { data: post, isLoading, error } = usePost(postId);

	if (isLoading)
		return (
			<div className='text-center mt-10 text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
				<LoadingRing />
			</div>
		);
	if (error)
		return (
			<div className='text-center mt-10 text-red-500'>
				Error loading post
			</div>
		);
	if (!post)
		return (
			<div className='text-center mt-10 text-gray-500'>
				Post not found
			</div>
		);

	const handleComments = () => setShowComments(!showComments);
	const handleClose = () => navigate(-1);

	return (
		<div className='min-h-screen w-full flex items-center justify-center max-h-dvh bg-lightMode-background dark:bg-darkMode-background p-3 md:p-4'>
			{/* Main Container */}
			<div className='flex flex-col md:flex-row max-w-5xl w-full md:max-h-[95dvh] bg-lightMode-section dark:bg-darkMode-section shadow-light dark:shadow-dark rounded-lg overflow-hidden'>
				{/* Media Section (Mobile) */}
				<div className='w-full md:w-1/2 flex flex-col md:p-5 relative'>
					{/* Close Button (Mobile) */}
					<div className='absolute top-2 right-2 md:hidden'>
						<ClosBtn handleClose={handleClose} />
					</div>

					{/* Post Owner (Mobile) */}
					<div className='md:hidden mb-3'>
						<PostOwner user={post?.user} />
					</div>

					<PostContent post={post} />

					{/* Actions (Mobile) */}
					<div className='md:hidden mt-3'>
						<PostActions post={post} onComment={handleComments} />
					</div>
				</div>

				{/* Post Details (Desktop) */}
				<div className='hidden md:flex flex-col p-5 w-1/2'>
					{/* Close Button (Desktop) */}
					<div className='flex justify-end'>
						<ClosBtn handleClose={handleClose} />
					</div>
					{/* Post Details */}
					<PostDetails post={post} />
				</div>

				{/* Comments Section (Mobile) */}
				{showComments && (
					<div className='md:hidden fixed inset-0 bg-lightMode-section dark:bg-darkMode-section p-1 px-3 flex flex-col z-50'>
						{/* Close Button */}
						<div className='absolute top-4 right-4 md:hidden'>
							<ClosBtn
								handleClose={() => setShowComments(false)}
							/>
						</div>
						{/* Post Details */}
						<PostDetails post={post} />
					</div>
				)}
			</div>
		</div>
	);
}

export default PostPage;
