import React from 'react';
import { useParams, useNavigate } from 'react-router';
import PostContent from '../../Components/Posts/ViewPost/PostContent';
import PostActions from '../../Components/Posts/ViewPost/PostActions';
import CommentsSection from '../../Components/Posts/ViewPost/CommentsSection';
import usePost from '../../CustomHooks/usePost';
import PostOwner from '../../Components/Posts/ViewPost/PostOwner';
import { X } from 'lucide-react';
import LoadingRing from '../../Components/Loading/LoadingRing';
import Hashtags from '../../Components/Posts/ViewPost/Hashtags';

function PostPage() {
	const { postId } = useParams();

	const navigate = useNavigate();
	const { data: post, isLoading, error } = usePost(postId);

	// Handle loading and errors
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

	// Extract post details
	const { user, description, hashtags } = post;
	const handleClose = () => navigate(-1);

	return (
		<div className='h-screen w-screen bg-lightMode-background dark:bg-darkMode-background flex items-center justify-center'>
			{/* Main Content */}
			<div className='flex justify-between max-w-5xl w-full h-[90dvh] bg-lightMode-section dark:bg-darkMode-section shadow-light dark:shadow-dark rounded-lg'>
				{/* Media Section */}
				<div className='flex-1 w-1/2 p-5'>
					<PostContent post={post} />
				</div>

				{/* Post Details Section */}
				<div className='flex flex-col p-5'>
					{/* Close Button */}
					<div className='flex justify-end pb-2'>
						<button
							onClick={handleClose}
							className='text-lightMode-textPrimary dark:text-darkMode-textPrimary hover:text-red-500 transition'>
							<X size={24} />
						</button>
					</div>

					{/* Owner */}
					<PostOwner user={user} />

					{/* Description */}
					<div className='my-3'>
						<p className='text-sm text-lightMode-textPrimary dark:text-darkMode-textPrimary  leading-relaxed'>
							{description}
						</p>
						<Hashtags hashtags={hashtags} />
					</div>
					{/* Post Actions */}
					<PostActions post={post} />

					{/* Comments Section */}

					<CommentsSection post={post} />
				</div>
			</div>
		</div>
	);
}

export default PostPage;
