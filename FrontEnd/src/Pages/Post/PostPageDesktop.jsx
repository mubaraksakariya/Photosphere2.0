import React from 'react';
import { useParams, useNavigate } from 'react-router';
import usePost from '../../CustomHooks/usePost';
import LoadingRing from '../../Components/Loading/LoadingRing';
import PostDetails from '../../Components/Posts/ViewPost/PostDetails';
import ClosBtn from '../../Components/Posts/ViewPost/ClosBtn';
import PostContent from '../../Components/Posts/ViewPost/PostContent';

function PostPageDesktop() {
	const { postId } = useParams();
	const navigate = useNavigate();
	const { data: post, isLoading, error } = usePost(postId);

	if (isLoading)
		return (
			<div className='flex justify-center items-center h-dvh'>
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

	const handleClose = () => navigate(-1);

	return (
		<div className='min-h-screen w-full flex items-center justify-center p-4 bg-lightMode-background dark:bg-darkMode-background'>
			{/* Desktop Layout */}
			<div className='flex flex-row max-w-5xl w-full h-[90dvh] bg-lightMode-section dark:bg-darkMode-section rounded-lg shadow-lg overflow-hidden'>
				{/* Media Section */}
				<div className='w-1/2 flex items-center justify-center'>
					<PostContent post={post} />
				</div>

				{/* Post Details */}
				<div className='w-1/2 flex flex-col p-5'>
					{/* Close Button */}
					<div className='flex justify-end'>
						<ClosBtn handleClose={handleClose} />
					</div>
					<PostDetails post={post} />
				</div>
			</div>
		</div>
	);
}

export default PostPageDesktop;
