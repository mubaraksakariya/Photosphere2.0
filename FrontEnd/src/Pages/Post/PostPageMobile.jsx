import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import PostActions from '../../Components/Posts/ViewPost/PostActions';
import usePost from '../../CustomHooks/usePost';
import LoadingRing from '../../Components/Loading/LoadingRing';
import PostDetails from '../../Components/Posts/ViewPost/PostDetails';
import ClosBtn from '../../Components/Posts/ViewPost/ClosBtn';
import PostOwner from '../../Components/Posts/ViewPost/PostOwner';
import PostContent from '../../Components/Posts/ViewPost/PostContent';

function PostPageMobile() {
	const { postId } = useParams();
	const [showComments, setShowComments] = useState(false);
	const navigate = useNavigate();
	const { data: post, isLoading, error } = usePost(postId);

	if (isLoading)
		return (
			<div className='flex justify-center items-center h-full'>
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
		<div className='min-h-screen w-full flex items-center justify-center p-1 bg-lightMode-background dark:bg-darkMode-background'>
			{/* Mobile Layout */}
			<div className='flex flex-col w-full max-h-[98dvh] bg-lightMode-section dark:bg-darkMode-section rounded-lg overflow-hidden relative'>
				<div className='absolute top-2 right-2'>
					<ClosBtn handleClose={handleClose} />
				</div>

				{/* Post Owner */}
				<PostOwner user={post?.user} />

				{/* Post Content */}
				<div className='h-[83dvh] flex justify-center items-center'>
					<PostContent post={post} />
				</div>

				{/* Actions */}
				<PostActions post={post} onComment={handleComments} />
			</div>
			{/* Comments Section */}
			{showComments && (
				<div className='fixed inset-0 bg-lightMode-section dark:bg-darkMode-section p-3 flex flex-col z-50'>
					<div className='absolute top-4 right-4'>
						<ClosBtn handleClose={() => setShowComments(false)} />
					</div>
					<PostDetails post={post} />
				</div>
			)}
		</div>
	);
}

export default PostPageMobile;
