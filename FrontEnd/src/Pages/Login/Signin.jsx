import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import GoogleSignin from '../../Components/GoogleSignin/GoogleSignin';

function Signin() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle form submission logic
		setIsLoading(true);
		// Add your login logic here
		setTimeout(() => setIsLoading(false), 2000); // Mock loading state
	};

	return (
		<div className='flex justify-center items-center min-h-screen bg-gray-100'>
			<div className='w-full max-w-md bg-white shadow-md rounded-lg p-8'>
				<div className='text-center mb-6'>
					<h3 className='text-2xl font-bold text-gray-800'>
						PHOTOSPHERE
					</h3>
				</div>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label className='block text-sm font-medium text-gray-600'>
							Mobile Number or Email
						</label>
						<input
							type='email'
							placeholder='Mobile Number or Email'
							className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
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
							placeholder='Password'
							className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<div>
						<button
							type='submit'
							className={`w-full py-2 px-4 text-white font-bold rounded-md ${
								isLoading
									? 'bg-gray-500 cursor-not-allowed'
									: 'bg-blue-500 hover:bg-blue-600'
							}`}
							disabled={isLoading}>
							{isLoading ? 'Please Wait' : 'Sign In'}
						</button>
					</div>
				</form>
				<div className='mt-6 text-center'>
					<GoogleSignin />
				</div>
				<div className='mt-4 text-center'>
					<p>
						Don't Have an account?{' '}
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
