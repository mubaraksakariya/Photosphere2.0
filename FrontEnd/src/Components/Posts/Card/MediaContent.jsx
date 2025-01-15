const MediaContent = ({ media, mediaType }) => {
	return (
		<div className='w-full h-[30vh] sm:h-[40vh] bg-lightMode-section dark:bg-darkMode-section'>
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
