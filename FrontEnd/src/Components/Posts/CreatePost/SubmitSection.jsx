import React from 'react';

const SubmitSection = ({ onSubmit, onCancel }) => {
	return (
		<div className='mt-4 flex justify-end'>
			<button
				onClick={onSubmit}
				className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none'>
				Submit
			</button>
			<button
				onClick={onCancel}
				className='ml-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none'>
				Cancel
			</button>
		</div>
	);
};

export default SubmitSection;
