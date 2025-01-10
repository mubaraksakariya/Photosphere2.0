import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { useSubmitOtp } from '../../CustomHooks/useSubmitOtp';
import { useResendOtp } from '../../CustomHooks/useResendOtp';
import maskEmail from '../../Utitlities/maskEmail';

function VerifyOtp() {
	const [otp, setOtp] = useState('');
	const [error, setError] = useState('');
	const dispatch = useDispatch();
	const email = useLocation().state?.email || null;
	const navigate = useNavigate();

	const { mutate: submitOtp, isLoading: submitLoading } = useSubmitOtp();
	const { mutate: resendOtp, isLoading: resendLoading } = useResendOtp();

	useEffect(() => {
		if (!email) {
			setError('Email not found');
			navigate('/signin');
		}
	}, [email, navigate]);

	const manageSubmit = (event) => {
		event.preventDefault();
		setError('');

		const data = { otp, email };
		console.log(data);

		submitOtp(data, {
			onSuccess: () => {
				console.log('OTP verified successfully');
				navigate('/signin');
			},
			onError: (error) => {
				console.error('Error verifying OTP:', error?.detail || error);
				setError('Failed to verify OTP');
			},
		});
	};

	const manageResend = (event) => {
		event.preventDefault();
		const data = { email };
		resendOtp(email, {
			onSuccess: () => {
				console.log('OTP resent successfully');
			},
			onError: (error) => {
				console.log(
					'Error resending OTP:',
					error?.detail || error.error
				);
				setError(error.error);
			},
		});
	};

	return (
		<div className='flex justify-center items-center min-h-screen bg-gray-100 p-4 sm:p-8'>
			<div className='w-full max-w-md bg-white shadow-md rounded-lg p-6 sm:p-8'>
				<h2 className='text-2xl font-bold text-center mb-6 sm:mb-8'>
					Verify OTP
				</h2>
				<p className='text-center mb-4'>
					OTP sent to{' '}
					<span className='font-medium'>{maskEmail(email)}</span>
				</p>
				<form
					onSubmit={manageSubmit}
					className='flex flex-col space-y-4'>
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
				{error && (
					<div className='mt-2 text-red-500 text-center'>{error}</div>
				)}
				<div className='mt-4 text-center'>
					<button
						onClick={manageResend}
						disabled={resendLoading}
						className='text-blue-500 hover:underline'>
						{resendLoading ? 'Resending...' : 'Resend OTP'}
					</button>
				</div>
			</div>
		</div>
	);
}

export default VerifyOtp;
