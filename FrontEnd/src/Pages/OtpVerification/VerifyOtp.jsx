import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import maskEmail from '../../Utitlities/maskEmail';
import ResendOtp from './ResendOtp';
import SubmitOtp from './SubmitOtp';

function VerifyOtp() {
	const [error, setError] = useState('');
	const email = useLocation().state?.email || null;
	const navigate = useNavigate();

	useEffect(() => {
		if (!email) {
			setError('Email not found');
			navigate('/signin');
		}
	}, [email, navigate]);

	const handleSuccess = () => {
		console.log('OTP verified successfully');
		alert('OTP verified successfully');
		navigate('/signin', { state: null, replace: true });
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
				<SubmitOtp
					email={email}
					setError={setError}
					onSuccess={handleSuccess}
				/>
				{error && (
					<div className='mt-2 text-red-500 text-center'>{error}</div>
				)}
				<ResendOtp email={email} setError={setError} />
			</div>
		</div>
	);
}

export default VerifyOtp;
