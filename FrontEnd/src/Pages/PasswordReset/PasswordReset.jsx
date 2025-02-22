import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import Input from '../../Components/Ui/Input';
import Button from '../../Components/Ui/Button';
import usePasswordResetConfirmMutation from '../../CustomHooks/usePasswordResetConfirmMutation';
import { useAlert } from '../../Contexts/AlertContext';
import { useDispatch } from 'react-redux';
import { logout } from '../../Store/Slices/AuthSlice';

const PasswordReset = () => {
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const mutation = usePasswordResetConfirmMutation();
	const navigate = useNavigate();
	const { showSuccess } = useAlert();
	const dispatch = useDispatch();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!password || !confirmPassword) {
			setError('Please fill in all fields.');
			return;
		}
		if (password !== confirmPassword) {
			setError('Passwords do not match.');
			return;
		}

		mutation.mutate(
			{ token, new_password: password },
			{
				onError: (err) => {
					console.log(err);
					setError(err.response.data || 'Failed to reset password.');
				},
				onSuccess: (response) => {
					showSuccess('Your password reset was succesfull', () => {
						navigate('/');
						dispatch(logout());
					});
				},
			}
		);
	};

	return (
		<div className=' min-h-screen flex justify-center items-center'>
			<section className='p-6 bg-lightMode-section dark:bg-darkMode-section rounded-2xl shadow-lg max-w-md mx-auto border border-lightMode-border dark:border-darkMode-border'>
				<h2 className='text-xl font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary text-center mb-6'>
					Reset Your Password
				</h2>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<Input
						type='password'
						placeholder='New Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Input
						type='password'
						placeholder='Confirm New Password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
					{error && <p className='text-sm text-red-500'>{error}</p>}
					<Button type='submit' className='w-full'>
						Reset Password
					</Button>
				</form>
			</section>
		</div>
	);
};

export default PasswordReset;
