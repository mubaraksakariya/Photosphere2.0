import React, { useState } from 'react';
import { useSubmitOtp } from '../../CustomHooks/useSubmitOtp';

const SubmitOtp = ({ email, setError, onSuccess }) => {
	const [otp, setOtp] = useState('');
	const [submitLoading, setSubmitLoading] = useState(false);
	const { mutate: submitOtp } = useSubmitOtp();

	const manageSubmit = (event) => {
		event.preventDefault();
		setError('');

		const data = { otp, email };

		setSubmitLoading(true);
		submitOtp(data, {
			onSuccess: () => {
				console.log('OTP verified successfully');
				onSuccess();
			},
			onError: (error) => {
				console.log('Error verifying OTP:', error);
				const errorMessage =
					error?.detail || error.error || 'Failed to verify OTP';
				setError(errorMessage);
				setSubmitLoading(false);
			},
			onFinally: () => {
				setSubmitLoading(false);
			},
		});
	};

	return (
		<form onSubmit={manageSubmit} className='flex flex-col space-y-4'>
			<div className='relative'>
				<input
					type='text'
					name='otp'
					placeholder='Enter OTP'
					className='w-full border rounded-md px-4 py-2 bg-lightMode-section dark:bg-darkMode-section text-lightMode-textPrimary dark:text-darkMode-textPrimary border-lightMode-accent dark:border-darkMode-accent focus:ring-lightMode-accent dark:focus:ring-darkMode-accent focus:outline-none'
					value={otp}
					onChange={(e) => setOtp(e.target.value)}
					required
				/>
				<label className='absolute left-4 -top-3.5 text-xs text-lightMode-textPrimary dark:text-darkMode-textPrimary bg-lightMode-section dark:bg-darkMode-section px-1'>
					Enter OTP
				</label>
			</div>
			<button
				type='submit'
				disabled={submitLoading}
				className={`w-full py-2 rounded-md font-bold text-white bg-lightMode-accent dark:bg-darkMode-accent transition hover:opacity-80 ${
					submitLoading ? 'opacity-50 cursor-not-allowed' : ''
				}`}>
				{submitLoading ? 'Verifying...' : 'Verify'}
			</button>
		</form>
	);
};

export default SubmitOtp;
