import React from 'react';

function PostContent({ post }) {
	const { media } = post;
	return (
		<div className='h-full bg-black'>
			{media && (
				<img
					src={media}
					alt='Post'
					className='w-full h-full object-contain'
				/>
			)}
		</div>
	);
}

export default PostContent;
