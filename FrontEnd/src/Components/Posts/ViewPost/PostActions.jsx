import React from 'react';
import LikeBtnHeart from './Actions/LikeBtnHeart';
import ShareBtn from '../Card/ActionButtons/ShareBtn';
import CommentBtn from '../Card/ActionButtons/CommentBtn';

function PostActions({ post, onLike, onComment, onShare }) {
	return (
		<div className='px-3 bg-lightMode-background dark:bg-darkMode-background rounded-lg border border-lightMode-accent/30 dark:border-darkMode-accent/30 shadow-sm flex justify-between'>
			<LikeBtnHeart post={post} onLike={onLike} />
			<CommentBtn post={post} onComment={onComment} />
			<ShareBtn post={post} onShare={onShare} />
		</div>
	);
}

export default PostActions;
