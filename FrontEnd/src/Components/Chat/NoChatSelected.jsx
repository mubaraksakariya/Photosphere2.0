import React from 'react';

const NoChatSelected = () => {
	return (
		<div className='flex flex-col items-center justify-center h-full text-center'>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				fill='none'
				viewBox='0 0 24 24'
				strokeWidth={1.5}
				stroke='currentColor'
				className='size-40'>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					d='M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z'
				/>
			</svg>

			<h2 className='mt-4 text-xl font-semibold text-gray-600'>
				No Chat Selected
			</h2>
			<p className='mt-2 text-gray-500'>
				Select a chat from the list to start messaging.
			</p>
		</div>
	);
};

export default NoChatSelected;
