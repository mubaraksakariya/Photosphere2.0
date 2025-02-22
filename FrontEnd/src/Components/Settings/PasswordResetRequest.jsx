import React, { useState } from 'react';
import Input from '../Ui/Input';
import Button from '../Ui/Button';
import Label from '../Ui/Label';
import { useAlert } from '../../Contexts/AlertContext';
import usePasswordResetMutation from '../../CustomHooks/usePasswordResetMutation ';

const PasswordResetRequest = () => {
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');
	const { mutate, isPending } = usePasswordResetMutation();
	const { showSuccess } = useAlert();

	const handleSubmit = (e) => {
		e.preventDefault();
		setError(''); // Clear previous errors

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError('Invalid email format.');
			return;
		}

		// Send request
		mutate(
			{ email },
			{
				onSuccess: () => {
					showSuccess('Reset link sent, check your email.');
					setEmail(''); // Clear input field on success
				},
				onError: (error) => {
					console.log(error);

					setError(
						error.response.data.error ||
							'Something went wrong. Please try again.'
					);
				},
			}
		);
	};

	return (
		<div className='space-y-4'>
			<h3 className='text-lg font-semibold text-center'>
				Reset Password
			</h3>
			<p className='text-center text-lightMode-textPrimary dark:text-darkMode-textPrimary text-sm'>
				Enter your email to receive a password reset link.
			</p>
			<form onSubmit={handleSubmit} className='grid gap-3'>
				<Label htmlFor='email'>Enter your email</Label>
				<Input
					type='email'
					id='email'
					placeholder='Enter your email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				{error && <p className='text-red-500 text-sm'>{error}</p>}{' '}
				{/* Display error message */}
				<Button type='submit' disabled={isPending}>
					{isPending ? 'Sending...' : 'Send Reset Link'}
				</Button>
			</form>
		</div>
	);
};

export default PasswordResetRequest;
