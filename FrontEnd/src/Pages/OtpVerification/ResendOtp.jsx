import React, { useState, useEffect } from 'react';
import { useResendOtp } from '../../CustomHooks/useResendOtp';

const ResendOtp = ({ email, setError }) => {
	const [isResendDisabled, setIsResendDisabled] = useState(false);
	const [countdown, setCountdown] = useState(0);
	const [resendLoading, setResendLoading] = useState(false);
	const { mutate: resendOtp } = useResendOtp();

	const manageResend = (event) => {
		event.preventDefault();

		if (isResendDisabled) {
			setError(`You can only resend OTP after ${countdown}s.`);
			return;
		}

		setResendLoading(true);
		resendOtp(email, {
			onSuccess: () => {
				console.log('OTP resent successfully');
				setIsResendDisabled(true);
				setCountdown(60); // Set countdown to 60 seconds
				setError('');
			},
			onError: (error) => {
				console.log('Error resending OTP:', error);
				const errorMessage =
					error?.detail || error.error || 'Failed to resend OTP';
				setError(errorMessage);
				setResendLoading(false);
			},
			onFinally: () => {
				setResendLoading(false);
			},
		});
	};

	// Handle the countdown timer
	useEffect(() => {
		if (isResendDisabled && countdown > 0) {
			const timer = setInterval(() => {
				setCountdown((prev) => {
					if (prev === 1) {
						setCountdown(0); // Reset countdown to 0 after it reaches 0
					}
					return prev - 1;
				});
			}, 1000); // Countdown every second

			return () => clearInterval(timer); // Clean up the timer on unmount
		}
	}, [isResendDisabled, countdown]);

	return (
		<div className='mt-4 text-center'>
			{!isResendDisabled ? (
				<button
					onClick={manageResend}
					disabled={resendLoading}
					className='text-blue-500 hover:underline'>
					{resendLoading ? 'Resending...' : 'Resend OTP'}
				</button>
			) : (
				<div>
					<p className='text-green-500'>OTP sent successfully</p>
					<p className='text-red-500 mt-2'>
						You can resend OTP after {countdown}s.
					</p>
				</div>
			)}
		</div>
	);
};

export default ResendOtp;
