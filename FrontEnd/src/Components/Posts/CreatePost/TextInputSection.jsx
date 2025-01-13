import React from 'react';

const TextInputSection = ({
	label,
	value,
	onChange,
	placeholder,
	isTextArea = false,
}) => {
	return (
		<div className='mb-4'>
			<label className='block text-lg font-medium text-gray-700'>
				{label}
			</label>
			{isTextArea ? (
				<textarea
					value={value}
					onChange={onChange}
					className='mt-2 block w-full p-2 border rounded border-gray-300 h-[120px]'
					placeholder={placeholder}
				/>
			) : (
				<input
					type='text'
					value={value}
					onChange={onChange}
					className='mt-2 block w-full p-2 border rounded border-gray-300 h-[40px]'
					placeholder={placeholder}
				/>
			)}
		</div>
	);
};

export default TextInputSection;
