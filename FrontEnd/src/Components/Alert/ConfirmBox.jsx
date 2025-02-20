const ConfirmBox = ({ message, onConfirm, onCancel }) => {
	return (
		<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-30'>
			<div className='px-6 py-4 text-white bg-green-500 rounded-lg shadow-lg'>
				<p>{message}</p>
				<div className='flex justify-center gap-4 mt-4'>
					<button
						className='px-4 py-2 bg-white text-green-600 rounded'
						onClick={onConfirm}>
						OK
					</button>
					<button
						className='px-4 py-2 bg-gray-300 text-gray-800 rounded'
						onClick={onCancel}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmBox;
