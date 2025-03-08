import { memo } from 'react';

const PostDescription = memo(({ description, hashtags }) => (
	<div className='mt-2'>
		<p className='text-sm line-clamp-2'>
			{description || 'No description'}
		</p>
		{hashtags?.length > 0 && (
			<p className='text-xs text-blue-500 mt-1'>
				{hashtags.map((tag, index) => (
					<span key={index} className='mr-1'>
						#{tag.tag}
					</span>
				))}
			</p>
		)}
	</div>
));

export default PostDescription;
