import { useNavigate } from 'react-router';

const MediaContent = ({ post }) => {
	const { media, media_type: mediaType } = post;
	const navigate = useNavigate();
	const managePostOpen = (e) => {
		e.stopPropagation();
		navigate(`/post/${post.id}`);
	};

	return (
		<div className='w-full flex justify-center h-96 bg-lightMode-section dark:bg-darkMode-section'>
			{mediaType === 'image' ? (
				<img
					src={media}
					alt='Post'
					className='h-full object-contain cursor-pointer'
					onClick={managePostOpen}
				/>
			) : (
				<video
					controls
					className='h-full object-contain cursor-pointer'
					onClick={managePostOpen}>
					<source src={media} type='video/mp4' />
				</video>
			)}
		</div>
	);
};

export default MediaContent;
