import React, { useEffect } from 'react';
import { Heart, MessageCircle, Share } from 'lucide-react';
import useToggleLike from '../../../CustomHooks/useToggleLike';
import LikeBtnHeart from './Actions/LikeBtnHeart';
import ShareBtn from '../Card/ActionButtons/ShareBtn';

function PostActions({ post }) {
	const { comments_count: commentCount, share_count: shareCount } = post;
	const handleComment = () => console.log('Commenting...');
	const handleShare = () => console.log('Sharing...');

	return (
		<div className='px-3 bg-lightMode-background dark:bg-darkMode-background rounded-lg border border-lightMode-accent/30 dark:border-darkMode-accent/30 shadow-sm flex justify-between'>
			<LikeBtnHeart post={post} />
			<span
				onClick={handleComment}
				className='flex items-center gap-2 px-4 py-2 rounded-md text-lightMode-textPrimary dark:text-darkMode-textPrimary hover:text-lightMode-accent dark:hover:text-darkMode-accent transition-colors duration-200 cursor-pointer active:scale-95'>
				<MessageCircle size={20} />
				<span>{commentCount}</span>
			</span>
			<ShareBtn post={post} />
		</div>
	);
}

export default PostActions;
