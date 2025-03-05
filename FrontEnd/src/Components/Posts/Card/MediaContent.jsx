import { useDispatch } from 'react-redux';
import { openViewPostModal } from '../../../Store/Slices/ModalSlice';
import { useNavigate } from 'react-router';

const MediaContent = ({ post }) => {
	const { media, media_type: mediaType } = post;
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const managePostOpen = () => {
		// dispatch(openViewPostModal({ post: post }));
		navigate(`/post/${post.id}`);
	};

	return (
		<div
			className='w-full h-96 bg-lightMode-section dark:bg-darkMode-section'
			onClick={managePostOpen}>
			{mediaType === 'image' ? (
				<img
					src={media}
					alt='Post'
					className='w-full h-full object-contain'
				/>
			) : (
				<video controls className='w-full h-full object-contain'>
					<source src={media} type='video/mp4' />
				</video>
			)}
		</div>
	);
};

export default MediaContent;
