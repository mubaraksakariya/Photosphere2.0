import React from 'react';
import useSuggestedUsers from '../../../CustomHooks/useSuggestedUsers';
import SuggestedUsers from './SuggestedUsers';

function RightNav() {
	return (
		<div className=' flex flex-col gap-3'>
			<SuggestedUsers />
		</div>
	);
}

export default RightNav;
