import UserDetails from './UserDetails';
import MediaContent from './MediaContent';
import PostDescription from './PostDescription';
import Hashtags from './Hashtags';
import CommentInput from './CommentInput';
import RecentComments from './RecentComments';
import { useEffect, useState } from 'react';
import ActionButtons from './ActionButtons';
import usePostComments from '../../../CustomHooks/usePostComments';

const PostCard = ({ post }) => {
	const [comments, setComments] = useState([]);
	const { data, isLoading, isError, isFetched } = usePostComments(post?.id);
	useEffect(() => {
		if (data) {
			setComments(data.comments);
		}
	}, [data]);

	return (
		<div className='bg-lightMode-background dark:bg-darkMode-background border border-lightMode-textPrimary dark:border-darkMode-textPrimary rounded-lg shadow-light dark:shadow-dark overflow-hidden max-w-4xl mx-auto transition-colors'>
			<UserDetails user={post.user} />
			<MediaContent post={post} />
			<div className='p-4'>
				<PostDescription description={post.description} />
				<Hashtags hashtags={post.hashtags} />
			</div>
			<div>
				<ActionButtons post={post} />
			</div>
			<div>
				<CommentInput post={post} setComments={setComments} />
				<RecentComments comments={comments} />
			</div>
		</div>
	);
};

export default PostCard;
