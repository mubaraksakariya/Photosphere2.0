import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import GoogleSignin from '../../Components/GoogleSignin/GoogleSignin';
import useSignin from '../../CustomHooks/useSignin';

function Signin() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {
		mutate: signinUser,
		isLoading: isMutating,
		isSuccess,
		isError,
		error,
	} = useSignin();

	const handleSubmit = (e) => {
		e.preventDefault();
		setIsLoading(true);
		setErrorMessage(''); // Clear previous errors
		const data = {
			username: email,
			password,
		};
		signinUser(data, {
			onSuccess: (response) => {
				console.log('User signed in successfully');
				console.log(response);
				// You may want to store the token or session information here, for example:
				// localStorage.setItem('authToken', response.data.token);
			},
			onError: (error) => {
				// Set a meaningful error message
				setErrorMessage(
					error.response?.data?.detail ||
						'An error occurred while signing in. Please try again later.'
				);
			},
		});
		setTimeout(() => setIsLoading(false), 1000); // Mock loading state
	};

	return (
		<div className='flex justify-center items-center min-h-screen bg-gray-100'>
			<div className='w-full max-w-md bg-white shadow-lg rounded-lg p-8'>
				<div className='text-center mb-6'>
					<h3 className='text-3xl font-semibold text-gray-800'>
						PHOTOSPHERE
					</h3>
				</div>
				<form onSubmit={handleSubmit} className='space-y-6'>
					<div className='space-y-4 pb-6 relative'>
						<div>
							<label className='block text-sm font-medium text-gray-600'>
								Email or Phone
							</label>
							<input
								type='text'
								placeholder='Enter your email'
								className='mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-600'>
								Password
							</label>
							<input
								type='password'
								placeholder='Enter your password'
								className='mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						{/* Error message display */}
						{isError && errorMessage && (
							<div className='text-red-500 text-sm mt-1 absolute bottom-0 left-0'>
								{errorMessage}
							</div>
						)}
					</div>

					<div>
						<button
							type='submit'
							className={`w-full py-2 px-4 text-white font-semibold rounded-md ${
								isLoading
									? 'bg-gray-500 cursor-not-allowed'
									: 'bg-blue-500 hover:bg-blue-600'
							}`}
							disabled={isLoading}>
							{isLoading ? 'Please Wait...' : 'Sign In'}
						</button>
					</div>
				</form>

				{/* Google Sign-in Component */}
				<div className='mt-6 text-center'>
					<GoogleSignin />
				</div>

				{/* Sign Up Link */}
				<div className='mt-4 text-center'>
					<p>
						Don't have an account?{' '}
						<a
							href='#'
							className='text-blue-500 hover:underline'
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
