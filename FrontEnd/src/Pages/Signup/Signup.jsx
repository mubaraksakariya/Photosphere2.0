import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
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
		handleGoogleSignup,
		handleSubmit,
		manageOnChange,
	} = useSignupLogic();

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100'>
			<div className='w-full max-w-lg sm:max-w-md md:max-w-sm bg-white shadow-md rounded-lg p-8'>
				<h3 className='text-center text-2xl font-bold text-gray-800 mb-4'>
					PHOTOSPHERE
				</h3>
				<p className='text-center text-gray-600 mb-6'>
					Sign up to see photos and videos from your friends.
				</p>
				<div className='flex justify-center mb-4'>
					<GoogleSignin />
				</div>
				<p className='text-center text-gray-500 my-4'>OR</p>
				<form onSubmit={handleSubmit} className='space-y-4'>
					{/* Username */}
					<div className='relative'>
						<input
							type='text'
							className={`form-input block w-full px-4 py-2 border rounded-md ${
								errors.username
									? 'border-red-500 focus:ring-red-500'
									: 'focus:ring-blue-500'
							}`}
							placeholder='Username'
							name='username'
							value={username}
							onChange={(e) =>
								manageOnChange(e.target.name, e.target.value)
							}
						/>
						<div className='min-h-[1.25rem]'>
							{errors.username && (
								<p className='text-red-500 text-sm'>
									{errors.username}
								</p>
							)}
						</div>
					</div>
					{/* Email Field */}
					<div className='relative'>
						<input
							type='email'
							className={`form-input block w-full px-4 py-2 border rounded-md ${
								errors.email
									? 'border-red-500 focus:ring-red-500'
									: 'focus:ring-blue-500'
							}`}
							placeholder='Email'
							name='email'
							value={email}
							onChange={(e) =>
								manageOnChange(e.target.name, e.target.value)
							}
						/>
						<div className='min-h-[1.25rem]'>
							{errors.email && (
								<p className='text-red-500 text-sm'>
									{errors.email}
								</p>
							)}
						</div>
					</div>

					{/* First Name Field */}
					<div className='relative'>
						<input
							type='text'
							className={`form-input block w-full px-4 py-2 border rounded-md ${
								errors.first_name
									? 'border-red-500 focus:ring-red-500'
									: 'focus:ring-blue-500'
							}`}
							placeholder='First Name'
							name='first_name'
							value={first_name}
							onChange={(e) =>
								manageOnChange(e.target.name, e.target.value)
							}
						/>
						<div className='min-h-[1.25rem]'>
							{errors.first_name && (
								<p className='text-red-500 text-sm'>
									{errors.first_name}
								</p>
							)}
						</div>
					</div>

					{/* Last Name */}
					<div className='relative'>
						<input
							type='text'
							className={`form-input block w-full px-4 py-2 border rounded-md ${
								errors.last_name
									? 'border-red-500 focus:ring-red-500'
									: 'focus:ring-blue-500'
							}`}
							placeholder='Last Name'
							name='last_name'
							value={last_name}
							onChange={(e) =>
								manageOnChange(e.target.name, e.target.value)
							}
						/>
						<div className='min-h-[1.25rem]'>
							{errors.last_name && (
								<p className='text-red-500 text-sm'>
									{errors.last_name}
								</p>
							)}
						</div>
					</div>

					{/* Password */}
					<div className='relative'>
						<input
							type='password'
							className={`form-input block w-full px-4 py-2 border rounded-md ${
								errors.password
									? 'border-red-500 focus:ring-red-500'
									: 'focus:ring-blue-500'
							}`}
							placeholder='Password'
							name='password'
							value={password}
							onChange={(e) =>
								manageOnChange(e.target.name, e.target.value)
							}
						/>
					</div>
					<div className='relative'>
						<input
							type='password'
							className={`form-input block w-full px-4 py-2 border rounded-md ${
								errors.password
									? 'border-red-500 focus:ring-red-500'
									: 'focus:ring-blue-500'
							}`}
							placeholder='Password'
							name='repassword'
							value={repassword}
							onChange={(e) =>
								manageOnChange(e.target.name, e.target.value)
							}
						/>
						<div className='min-h-[1.25rem]'>
							{errors.password && (
								<p className='text-red-500 text-sm'>
									{errors.password}
								</p>
							)}
						</div>
					</div>

					{/* Date of Birth */}
					<div className='relative'>
						<input
							type='date'
							className={`form-input block w-full px-4 py-2 border rounded-md ${
								errors.dob
									? 'border-red-500 focus:ring-red-500'
									: 'focus:ring-blue-500'
							}`}
							placeholder='Date of Birth'
							name='dob'
							value={dob}
							onChange={(e) =>
								manageOnChange(e.target.name, e.target.value)
							}
						/>
						<div className='min-h-[1.25rem]'>
							{errors.dob && (
								<p className='text-red-500 text-sm'>
									{errors.dob}
								</p>
							)}
						</div>
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
							onClick={() => navigate('/signin')}
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
