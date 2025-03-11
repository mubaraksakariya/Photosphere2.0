import React from 'react';
import { Link } from 'react-router';

function Hashtags({ hashtags }) {
	if (!hashtags || hashtags.length === 0) return null;

	return (
		<div className='mt-2 flex flex-wrap gap-2'>
			{hashtags.map((tag) => (
				<Link
					to={`/tags/#${tag.tag}`}
					key={tag.id}
					className='relative text-sm text-lightMode-textPrimary dark:text-darkMode-textPrimary 
                    hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200
                    before:absolute before:-bottom-1 before:left-0 before:w-full before:h-0.5 
                    before:bg-blue-500 before:scale-x-0 before:origin-left before:transition-transform 
                    before:duration-200 hover:before:scale-x-100'>
					#{tag.tag}
				</Link>
			))}
		</div>
	);
}

export default Hashtags;
