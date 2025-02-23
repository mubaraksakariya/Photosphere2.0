import React from 'react';
import SuggestedUsers from './SuggestedUsers';

function RightNav() {
	return (
		<div className='flex flex-col gap-3 p-3'>
			<div>
				<SuggestedUsers />
			</div>
		</div>
	);
}

export default RightNav;
