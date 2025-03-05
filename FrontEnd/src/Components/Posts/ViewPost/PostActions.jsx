import React from 'react';
import { Heart, MessageCircle, Share } from 'lucide-react';

function PostActions({ onLike, onComment, onShare, isLiked }) {
	return (
		<div className='p-3 bg-lightMode-background dark:bg-darkMode-background rounded-lg border border-lightMode-accent/30 dark:border-darkMode-accent/30 shadow-sm flex justify-around'>
			<button
				onClick={onLike}
				className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 ${
					isLiked
						? 'text-red-500'
						: 'text-lightMode-textPrimary dark:text-darkMode-textPrimary hover:text-lightMode-accent dark:hover:text-darkMode-accent'
				}`}>
				<Heart size={20} />
				<span>Like</span>
			</button>
			<button
				onClick={onComment}
				className='flex items-center gap-2 px-4 py-2 rounded-md text-lightMode-textPrimary dark:text-darkMode-textPrimary hover:text-lightMode-accent dark:hover:text-darkMode-accent transition-colors duration-200'>
				<MessageCircle size={20} />
				<span>Comment</span>
			</button>
			<button
				onClick={onShare}
				className='flex items-center gap-2 px-4 py-2 rounded-md text-lightMode-textPrimary dark:text-darkMode-textPrimary hover:text-lightMode-accent dark:hover:text-darkMode-accent transition-colors duration-200'>
				<Share size={20} />
				<span>Share</span>
			</button>
		</div>
	);
}

export default PostActions;
