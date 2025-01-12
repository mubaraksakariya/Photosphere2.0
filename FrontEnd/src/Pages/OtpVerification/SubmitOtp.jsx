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
					className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
					value={otp}
					onChange={(e) => setOtp(e.target.value)}
					required
				/>
				<label className='absolute left-4 -top-3.5 text-sm text-gray-500 bg-white px-1'>
					Enter OTP
				</label>
			</div>
			<button
				type='submit'
				disabled={submitLoading}
				className='w-full bg-blue-500 text-white py-2 rounded-md font-bold hover:bg-blue-600'>
				{submitLoading ? 'Verifying...' : 'Verify'}
			</button>
		</form>
	);
};

export default SubmitOtp;
