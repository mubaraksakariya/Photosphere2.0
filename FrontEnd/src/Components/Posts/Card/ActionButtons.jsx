import LikeBtnHeart from '../ViewPost/Actions/LikeBtnHeart';
import CommentBtn from './ActionButtons/CommentBtn';
import ShareBtn from './ActionButtons/ShareBtn';

const ActionButtons = ({ post }) => {
	return (
		<div className='flex items-center p-2 ps-2 border-t border-lightMode-textPrimary dark:border-darkMode-textPrimary'>
			<LikeBtnHeart post={post} />
			<CommentBtn post={post} />
			<ShareBtn post={post} />
		</div>
	);
};

export default ActionButtons;
