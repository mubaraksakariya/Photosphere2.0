// Signup.js
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useSignupLogic } from './useSignupLogic';

function Signup() {
	const {
		isLoading,
		email,
		setEmail,
		first_name,
		setFirst_name,
		last_name,
		setLastname,
		username,
		setUsername,
		password,
		setPassword,
		dob,
		setDob,
		handleGoogleSignup,
		handleSubmit,
	} = useSignupLogic();

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100'>
			<div className='w-full max-w-md bg-white shadow-md rounded-lg p-8'>
				<h3 className='text-center text-2xl font-bold text-gray-800 mb-4'>
					PHOTOSPHERE
				</h3>
				<p className='text-center text-gray-600 mb-6'>
					Sign up to see photos and videos from your friends.
				</p>
				<div className='flex justify-center mb-4'>
					<GoogleLogin
						onSuccess={handleGoogleSignup}
						onError={() => console.log('Login Failed')}
					/>
				</div>
				<p className='text-center text-gray-500 my-4'>OR</p>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='relative'>
						<input
							type='text'
							className='form-input block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							placeholder='Email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className='relative'>
						<input
							type='text'
							className='form-input block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							placeholder='First Name'
							value={first_name}
							onChange={(e) => setFirst_name(e.target.value)}
							required
						/>
					</div>
					<div className='relative'>
						<input
							type='text'
							className='form-input block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							placeholder='Last Name'
							value={last_name}
							onChange={(e) => setLastname(e.target.value)}
							required
						/>
					</div>
					<div className='relative'>
						<input
							type='text'
							className='form-input block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							placeholder='Username'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</div>
					<div className='relative'>
						<input
							type='password'
							className='form-input block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							placeholder='Password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<div className='relative'>
						<input
							type='date'
							className='form-input block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							placeholder='Date of Birth'
							value={dob}
							onChange={(e) => setDob(e.target.value)}
							required
						/>
					</div>
					<button
						type='submit'
						className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md font-bold transition hover:bg-blue-600 ${
							isLoading ? 'opacity-50 cursor-not-allowed' : ''
						}`}
						disabled={isLoading}>
						{isLoading ? 'Please Wait' : 'Sign Up'}
					</button>
				</form>
				<p className='text-center text-gray-500 text-sm mt-4'>
					By signing up, you agree to our Terms, Data Policy, and
					Cookies Policy.
				</p>
				<div className='mt-4 text-center'>
					<p>
						Have an account?{' '}
						<span
							onClick={() => navigate('/login')}
							className='text-blue-500 cursor-pointer'>
							Log in
						</span>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Signup;
