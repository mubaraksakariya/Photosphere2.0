const SuccessAlert = ({ message }) => {
	return (
		<div className='fixed z-50 top-5 right-5 px-4 py-2 rounded-lg text-white bg-green-500 shadow-lg'>
			{message}
		</div>
	);
};

export default SuccessAlert;
