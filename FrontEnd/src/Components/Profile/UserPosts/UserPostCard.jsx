import React from 'react';
import MediaContent from '../../Posts/Card/MediaContent';
import PostDescription from '../../Posts/Card/PostDescription';
import Hashtags from '../../Posts/Card/Hashtags';
import ActionButtons from '../../Posts/Card/ActionButtons';

function UserPostCard({ post }) {
	return (
		<div className='w-full sm:w-96 bg-lightMode-background dark:bg-darkMode-background border border-lightMode-textPrimary dark:border-darkMode-textPrimary rounded-lg shadow-light dark:shadow-dark overflow-hidden max-w-4xl mx-auto transition-colors'>
			<MediaContent media={post.media} mediaType={post.media_type} />
			<div>
				<ActionButtons post={post} />
			</div>
			<div className='p-4'>
				<PostDescription description={post.description} />
				<Hashtags hashtags={post.hashtags} />
			</div>
		</div>
	);
}

export default UserPostCard;
