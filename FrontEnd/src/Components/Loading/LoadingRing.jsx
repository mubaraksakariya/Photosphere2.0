import React from 'react';

function LoadingRing() {
	return (
		<div className='flex justify-center items-center h-10 w-10'>
			<div className='animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500'></div>
		</div>
	);
}

export default LoadingRing;
