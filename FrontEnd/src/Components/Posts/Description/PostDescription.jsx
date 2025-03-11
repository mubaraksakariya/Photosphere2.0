import React from 'react';
import Hashtags from '../ViewPost/Hashtags';

function PostDescription({ post }) {
	const { description, hashtags } = post;
	return (
		<div className='my-3'>
			<p className='text-lightMode-accent dark:text-darkMode-accent text-sm font-semibold leading-relaxed'>
				{description}
			</p>
			<Hashtags hashtags={hashtags} />
		</div>
	);
}

export default PostDescription;
