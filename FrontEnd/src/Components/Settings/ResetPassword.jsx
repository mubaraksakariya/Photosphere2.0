import React, { useState } from 'react';
import Input from '../Ui/Input';
import Button from '../Ui/Button';
import Label from '../Ui/Label';

const ResetPassword = () => {
	const [email, setEmail] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle sending reset email here (API call)
		console.log('Sending password reset email to:', email);
	};

	return (
		<div className='space-y-4'>
			<h3 className='text-lg font-semibold'>Reset Password</h3>
			<form onSubmit={handleSubmit} className='grid gap-3'>
				<Label htmlFor='email'>Enter your email</Label>
				<Input
					type='email'
					id='email'
					placeholder='Enter your email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				<Button type='submit'>Send Reset Link</Button>
			</form>
		</div>
	);
};

export default ResetPassword;
