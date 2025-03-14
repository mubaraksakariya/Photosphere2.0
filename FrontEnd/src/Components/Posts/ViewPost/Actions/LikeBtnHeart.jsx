import React from 'react';
import useToggleLike from '../../../../CustomHooks/useToggleLike';
import { Heart } from 'lucide-react';

function LikeBtnHeart({ post, onLike }) {
	const { is_liked: isLiked, likes_count: LikeCount } = post;
	const { mutate: toggleLike } = useToggleLike();
	const handleLike = () => {
		toggleLike(post?.id);
		if (onLike) onLike();
	};
	return (
		<span
			onClick={handleLike}
			className='flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer active:scale-95'>
			<Heart fill={isLiked ? 'red' : 'none'} size={20} />
			<span>{LikeCount}</span>
		</span>
	);
}

export default LikeBtnHeart;
