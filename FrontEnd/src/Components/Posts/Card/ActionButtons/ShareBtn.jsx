import React from 'react';

function ShareBtn() {
	const onShare = () => {
		console.log('Share button clicked');
		// Add share functionality (e.g., copy link or open share modal)
	};
	return (
		<button
			onClick={onShare}
			className='flex items-center gap-2 text-lightMode-textPrimary dark:text-darkMode-textPrimary hover:text-lightMode-accent dark:hover:text-darkMode-accent transition'>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				fill='none'
				viewBox='0 0 24 24'
				strokeWidth={1.5}
				stroke='currentColor'
				className='size-6'>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					d='M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z'
				/>
			</svg>
		</button>
	);
}

export default ShareBtn;
