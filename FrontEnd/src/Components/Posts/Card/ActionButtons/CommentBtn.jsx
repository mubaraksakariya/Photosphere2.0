import { MessageCircle } from 'lucide-react';
import React from 'react';

function CommentBtn({ post }) {
	const { comments_count: commentCount } = post;
	const handleComment = () => console.log('Commenting...');
	return (
		<span
			onClick={handleComment}
			className='flex items-center gap-2 px-4 py-2 rounded-md text-lightMode-textPrimary dark:text-darkMode-textPrimary hover:text-lightMode-accent dark:hover:text-darkMode-accent transition-colors duration-200 cursor-pointer active:scale-95'>
			<MessageCircle size={20} />
			<span>{commentCount}</span>
		</span>
	);
}

export default CommentBtn;
