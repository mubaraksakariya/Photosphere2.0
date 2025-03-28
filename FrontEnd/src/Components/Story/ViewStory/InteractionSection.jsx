import React from 'react';
import CommentSection from './CommentSection';
import ReactionSection from './ReactionSection';

const InteractionSection = ({ story }) => (
	<div className='w-full overflow-hidden flex items-center gap-2'>
		<CommentSection story={story} />
		<ReactionSection story={story} />
	</div>
);

export default InteractionSection;
