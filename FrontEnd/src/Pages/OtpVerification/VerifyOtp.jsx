import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import maskEmail from '../../Utilities/maskEmail';
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
		<div className='flex justify-center items-center min-h-screen bg-lightMode-background dark:bg-darkMode-background px-4'>
			<div className='w-full max-w-sm bg-lightMode-section dark:bg-darkMode-section shadow-light dark:shadow-dark rounded-xl p-6 space-y-4'>
				<h2 className='text-center text-xl font-bold text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
					Verify OTP
				</h2>
				<p className='text-center text-lightMode-textPrimary dark:text-darkMode-textPrimary text-sm'>
					OTP sent to{' '}
					<span className='font-medium'>{maskEmail(email)}</span>
				</p>
				<SubmitOtp
					email={email}
					setError={setError}
					onSuccess={handleSuccess}
				/>
				{error && (
					<p className='text-center text-red-500 text-xs'>{error}</p>
				)}
				<ResendOtp email={email} setError={setError} />
				<div className='text-center text-xs'>
					<p>
						Wrong email?{' '}
						<span
							onClick={() => navigate('/signup')}
							className='text-lightMode-accent dark:text-darkMode-accent cursor-pointer font-medium'>
							Sign up again
						</span>
					</p>
				</div>
			</div>
		</div>
	);
}

export default VerifyOtp;
