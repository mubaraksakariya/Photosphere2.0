import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import GoogleSignin from '../../Components/GoogleSignin/GoogleSignin';
import useSignin from '../../CustomHooks/useSignin';

function Signin() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {
		mutate: signinUser,
		isPending: isLoading,
		isSuccess,
		isError,
		error,
	} = useSignin();

	const handleSubmit = (e) => {
		e.preventDefault();
		setErrorMessage(''); // Clear previous errors
		const data = {
			username: email,
			password,
		};
		signinUser(data, {
			onSuccess: (response) => {
				console.log('User signed in successfully');
				console.log(response);
			},
			onError: (error) => {
				setErrorMessage(
					error.response?.data?.detail ||
						'An error occurred while signing in. Please try again later.'
				);
			},
		});
	};

	return (
		<div className='flex justify-center items-center min-h-screen bg-lightMode-background dark:bg-darkMode-background'>
			<div className='w-full max-w-md bg-lightMode-section dark:bg-darkMode-section shadow-light dark:shadow-dark rounded-lg p-8'>
				<div className='text-center mb-6'>
					<h3 className='text-3xl font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
						PHOTOSPHERE
					</h3>
				</div>
				<form onSubmit={handleSubmit} className='space-y-6'>
					<div className='space-y-4 pb-6 relative'>
						<div>
							<label className='block text-sm font-medium text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
								Email or Phone
							</label>
							<input
								type='text'
								placeholder='Enter your email'
								className='mt-2 block w-full px-4 py-2 border border-lightMode-accent dark:border-darkMode-accent rounded-md shadow-sm focus:outline-none focus:ring-lightMode-accent dark:focus:ring-darkMode-accent focus:border-lightMode-accent dark:focus:border-darkMode-accent bg-lightMode-background dark:bg-darkMode-background text-lightMode-textPrimary dark:text-darkMode-textPrimary'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div>
							<label className='block text-sm font-medium text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
								Password
							</label>
							<input
								type='password'
								placeholder='Enter your password'
								className='mt-2 block w-full px-4 py-2 border border-lightMode-accent dark:border-darkMode-accent rounded-md shadow-sm focus:outline-none focus:ring-lightMode-accent dark:focus:ring-darkMode-accent focus:border-lightMode-accent dark:focus:border-darkMode-accent bg-lightMode-background dark:bg-darkMode-background text-lightMode-textPrimary dark:text-darkMode-textPrimary'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						{isError && errorMessage && (
							<div className='text-red-500 text-sm mt-1 absolute bottom-0 left-0'>
								{errorMessage}
							</div>
						)}
					</div>
					<div className='flex justify-end'>
						<span
							className='cursor-pointer text-lightMode-accent dark:text-darkMode-accent'
							onClick={() => navigate('/password-reset-request')}>
							Forgot password?
						</span>
					</div>
					<div>
						<button
							type='submit'
							className={`w-full py-2 px-4 text-white font-semibold rounded-md ${
								isLoading
									? 'bg-gray-500 cursor-not-allowed'
									: 'bg-lightMode-accent dark:bg-darkMode-accent hover:bg-opacity-80'
							}`}
							disabled={isLoading}>
							{isLoading ? 'Please Wait...' : 'Sign In'}
						</button>
					</div>
				</form>
				<div className='mt-6 text-center'>
					<GoogleSignin />
				</div>
				<div className='mt-4 text-center'>
					<p>
						Don't have an account?{' '}
						<a
							className='text-lightMode-accent dark:text-darkMode-accent hover:underline cursor-pointer'
							onClick={() => navigate('/signup')}>
							Sign Up
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Signin;
