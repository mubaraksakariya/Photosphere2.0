import { Heart, MessageCircle } from 'lucide-react';
import { memo } from 'react';

const PostActions = memo(({ is_liked, likes_count, comments_count }) => (
	<div className='flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400'>
		<div className='flex items-center'>
			<Heart size={14} className={is_liked ? 'text-red-500' : ''} />
			<span className='ml-1'>{likes_count}</span>
		</div>
		<div className='flex items-center'>
			<MessageCircle size={14} />
			<span className='ml-1'>{comments_count}</span>
		</div>
	</div>
));

export default PostActions;
