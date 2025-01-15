import CommentBtn from './ActionButtons/CommentBtn';
import Like from './ActionButtons/LikeBtn';
import ShareBtn from './ActionButtons/ShareBtn';

const ActionButtons = ({ post }) => {
	return (
		<div className='flex items-center gap-5 p-4 ps-7 border-t border-lightMode-textPrimary dark:border-darkMode-textPrimary'>
			<Like post={post} />
			<CommentBtn />
			<ShareBtn />
		</div>
	);
};

export default ActionButtons;
