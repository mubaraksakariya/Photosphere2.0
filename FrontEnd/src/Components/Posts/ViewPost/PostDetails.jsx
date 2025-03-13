import React from 'react';
import PostActions from './PostActions';
import CommentsSection from './CommentsSection';
import PostOwner from './PostOwner';
import PostDescription from '../Description/PostDescription';

function PostDetails({ post }) {
	const { user } = post;
	return (
		<>
			{/* Owner */}
			<PostOwner user={user} />

			{/* Description */}
			<PostDescription post={post} />

			{/* Post Actions */}
			<PostActions post={post} />

			{/* Comments Section */}
			<CommentsSection post={post} />
		</>
	);
}

export default PostDetails;
