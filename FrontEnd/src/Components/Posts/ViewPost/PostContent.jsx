function PostContent({ post }) {
	const { media, media_type } = post;

	return (
		<div className='flex-1 flex justify-center items-center bg-black h-full w-full'>
			{media &&
				(media_type === 'image' ? (
					<img
						src={media}
						alt='Post'
						className='h-full w-full object-contain'
					/>
				) : media_type === 'video' ? (
					<video controls className='h-full w-full object-contain'>
						<source src={media} type='video/mp4' />
						Your browser does not support the video tag.
					</video>
				) : null)}
		</div>
	);
}
export default PostContent;
