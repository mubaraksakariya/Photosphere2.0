import { memo } from 'react';

const MediaPreview = memo(({ media, media_type }) => {
	if (!media) return null;
	return (
		<div className='flex justify-center items-center bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden aspect-[16/9]'>
			{media_type === 'image' ? (
				<img
					src={media}
					alt='Shared Post'
					className='w-full h-full object-contain'
				/>
			) : media_type === 'video' ? (
				<video controls className='w-full h-full object-contain'>
					<source src={media} type='video/mp4' />
					Your browser does not support the video tag.
				</video>
			) : null}
		</div>
	);
});

export default MediaPreview;
