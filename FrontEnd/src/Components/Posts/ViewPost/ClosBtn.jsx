import React from 'react';
import { X } from 'lucide-react';

function ClosBtn({ handleClose }) {
	return (
		<div className='flex justify-end pb-2'>
			<button
				onClick={handleClose}
				className='text-lightMode-textPrimary dark:text-darkMode-textPrimary hover:text-red-500 transition'>
				<X size={24} />
			</button>
		</div>
	);
}

export default ClosBtn;
