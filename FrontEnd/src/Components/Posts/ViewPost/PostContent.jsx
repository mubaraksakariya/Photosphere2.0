import React from 'react';

function PostContent({ post }) {
	const { media, media_type } = post;
	return (
		<div className='h-full bg-black flex justify-center items-center w-full'>
			{media &&
				(media_type === 'image' ? (
					<img
						src={media}
						alt='Post'
						className='w-full h-full object-contain'
					/>
				) : media_type === 'video' ? (
					<video controls className='w-full h-full object-contain'>
						<source src={media} type='video/mp4' />
						Your browser does not support the video tag.
					</video>
				) : null)}
		</div>
	);
}

export default PostContent;
