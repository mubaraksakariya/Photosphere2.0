const ErrorAlert = ({ message }) => {
	return (
		<div className='fixed top-5 right-5 px-4 py-2 rounded-lg text-white bg-red-500 shadow-lg'>
			{message}
		</div>
	);
};

export default ErrorAlert;
