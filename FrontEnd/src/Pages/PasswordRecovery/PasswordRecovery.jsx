import React from 'react';
import { useNavigate } from 'react-router';
import PasswordResetRequest from '../../Components/Settings/PasswordResetRequest';

function PasswordRecovery() {
	const navigate = useNavigate();

	return (
		<div className='flex items-center justify-center min-h-screen bg-lightMode-background dark:bg-darkMode-background px-4'>
			<div className='w-full max-w-sm bg-lightMode-section dark:bg-darkMode-section shadow-light dark:shadow-dark rounded-xl p-6 space-y-4'>
				<PasswordResetRequest />
				<div className='text-center text-xs'>
					<p>
						Remember your password?{' '}
						<span
							onClick={() => navigate('/signin')}
							className='text-lightMode-accent dark:text-darkMode-accent cursor-pointer font-medium'>
							Log in
						</span>
					</p>
				</div>
			</div>
		</div>
	);
}

export default PasswordRecovery;
