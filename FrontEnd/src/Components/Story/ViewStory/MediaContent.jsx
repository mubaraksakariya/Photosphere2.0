const MediaContent = ({ mediaFile, caption, type }) => {
	return (
		<div className='relative mb-4 max-h-[83%] md:max-h-[85%] h-full w-full flex-grow'>
			{type === 'image' ? (
				<img
					src={mediaFile}
					alt={caption}
					className='w-full h-full object-contain rounded-lg'
				/>
			) : type === 'video' ? (
				<video controls className='w-full h-[90%] object-contain'>
					<source src={mediaFile} type='video/mp4' />
					Your browser does not support the video tag.
				</video>
			) : null}
			{caption && (
				<div
					className={`${
						type == 'image'
							? 'absolute bottom-0 left-0 right-0'
							: ''
					} bg-black bg-opacity-70 text-white p-4 rounded-b-lg`}>
					<p className='text-sm mb-2 text-center'>{caption}</p>
				</div>
			)}
		</div>
	);
};

export default MediaContent;
