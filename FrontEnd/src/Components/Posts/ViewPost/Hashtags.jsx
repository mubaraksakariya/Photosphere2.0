import React from 'react';
import { Link } from 'react-router';

function Hashtags({ hashtags }) {
	if (!hashtags || hashtags.length === 0) return null;

	return (
		<div className='mt-2 flex flex-wrap gap-2'>
			{hashtags.map((tag) => (
				<Link
					to={`/tags/${tag.tag}`}
					key={tag.id}
					className='text-lightMode-accent dark:text-darkMode-accent text-sm font-semibold hover:underline'>
					#{tag.tag}
				</Link>
			))}
		</div>
	);
}

export default Hashtags;
