import React from 'react';
import { useSignupLogic } from './useSignupLogic';
import { useNavigate } from 'react-router';
import GoogleSignin from '../../Components/GoogleSignin/GoogleSignin';

function Signup() {
	const navigate = useNavigate();
	const {
		isLoading,
		email,
		first_name,
		last_name,
		username,
		password,
		repassword,
		dob,
		errors,
		handleSubmit,
		manageOnChange,
	} = useSignupLogic();

	return (
		<div className='min-h-screen flex items-center justify-center bg-lightMode-background dark:bg-darkMode-background px-4'>
			<div className='w-full max-w-sm bg-lightMode-section dark:bg-darkMode-section shadow-light dark:shadow-dark rounded-xl p-6 space-y-4'>
				<h3 className='text-center text-xl font-bold text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
					PHOTOSPHERE
				</h3>
				<p className='text-center text-lightMode-textPrimary dark:text-darkMode-textPrimary text-sm'>
					Sign up to see photos and videos from your friends.
				</p>
				<div className='flex justify-center'>
					<GoogleSignin />
				</div>
				<p className='text-center text-lightMode-textPrimary dark:text-darkMode-textPrimary text-xs'>
					OR
				</p>
				<form onSubmit={handleSubmit} className='space-y-3'>
					{[
						'username',
						'email',
						'first_name',
						'last_name',
						'password',
						'repassword',
						'dob',
					].map((field) => (
						<div key={field} className='relative'>
							<input
								type={
									field.includes('password')
										? 'password'
										: field === 'dob'
										? 'date'
										: 'text'
								}
								className={`form-input block w-full px-3 py-2 border rounded-md bg-lightMode-section dark:bg-darkMode-section text-lightMode-textPrimary dark:text-darkMode-textPrimary border-lightMode-accent dark:border-darkMode-accent focus:ring-lightMode-accent dark:focus:ring-darkMode-accent ${
									errors[field]
										? 'border-red-500 focus:ring-red-500'
										: ''
								}`}
								placeholder={field
									.replace('_', ' ')
									.replace('repassword', 'Confirm Password')}
								name={field}
								value={eval(field)}
								onChange={(e) =>
									manageOnChange(
										e.target.name,
										e.target.value
									)
								}
							/>
							{errors[field] && (
								<p className='text-red-500 text-xs mt-1'>
									{errors[field]}
								</p>
							)}
						</div>
					))}
					<button
						type='submit'
						className={`w-full bg-lightMode-accent dark:bg-darkMode-accent text-white py-2 rounded-md font-bold text-sm transition hover:opacity-80 ${
							isLoading ? 'opacity-50 cursor-not-allowed' : ''
						}`}
						disabled={isLoading}>
						{isLoading ? 'Please Wait' : 'Sign Up'}
					</button>
				</form>
				<p className='text-center text-lightMode-textPrimary dark:text-darkMode-textPrimary text-xs'>
					By signing up, you agree to our Terms, Data Policy, and
					Cookies Policy.
				</p>
				<div className='text-center text-xs'>
					<p>
						Have an account?{' '}
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

export default Signup;
