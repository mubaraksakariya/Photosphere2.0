import MediaPreview from './MediaPreview';
import PostActions from './PostActions';
import PostDescription from './PostDescription';
import UserInfo from './UserInfo';
import { useChat } from '../../../../Contexts/ChatContext';
import { Link } from 'react-router';

function SharedPostBubble({ message }) {
	const { currentChat } = useChat();
	const chatUserEmail = currentChat?.members[0]?.email;
	const align =
		message.sender.email === chatUserEmail
			? 'justify-start'
			: 'justify-end';

	const { content } = message;
	const {
		id,
		media,
		media_type,
		description,
		hashtags,
		comments_count,
		is_liked,
		likes_count,
		user,
	} = content.shared_post || {};

	if (!id || !user) return <div>shared post unable to show now</div>;

	return (
		<div className={`flex ${align} my-2`}>
			<div
				className='bg-lightMode-highlight dark:bg-darkMode-highlight text-lightMode-textPrimary dark:text-darkMode-textPrimary 
                p-3 rounded-lg shadow-light dark:shadow-dark 
                w-full sm:w-72 md:w-80 min-h-[24rem] flex flex-col justify-between'
				onClick={() => console.log(message)}>
				{/* User Info */}
				<UserInfo user={user} />

				{/* Media Preview */}
				<MediaPreview media={media} media_type={media_type} />

				{/* Post Content */}
				<PostDescription
					description={description}
					hashtags={hashtags}
				/>

				{/* Like & Comment Count */}
				<PostActions
					is_liked={is_liked}
					likes_count={likes_count}
					comments_count={comments_count}
				/>

				{/* Link to Full Post */}
				<Link
					to={`/post/${id}`}
					className='block mt-2 text-xs text-blue-500 hover:underline'>
					View Full Post
				</Link>
			</div>
		</div>
	);
}

export default SharedPostBubble;
