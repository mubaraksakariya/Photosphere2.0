import React, { useState, useEffect } from 'react';
import useUserDetails from '../../../CustomHooks/useUserDetails';
import useUpdateUserDetails from '../../../CustomHooks/useUpdateUserDetails';
import LoadingRing from '../../Loading/LoadingRing';
import { validateProfileForm } from './validateProfileForm';
import { useAlert } from '../../../Contexts/AlertContext';

/**
 * Component for editing user profile details
 * @param {Object} props
 * @param {Object} props.user - The user object containing basic user information
 *
 * Features:
 * - Edit first name, last name, profile image, bio, and date of birth
 * - Image preview and removal
 * - Form validation
 * - Loading states
 * - Success/error alerts
 */
const UserDetailsEdit = ({ user }) => {
	// State for form validation errors
	const [errors, setErrors] = useState({});

	// Fetch user details using custom hook
	const { data: userDetails, isLoading, error } = useUserDetails(user?.id);

	// Mutation hook for updating user details
	const { mutate: updateUserDetails, isLoading: isUpdating } =
		useUpdateUserDetails(user?.id);

	// Alert context for showing notifications
	const { showSuccessAlert, showErrorAlert, showError } = useAlert();

	// Form state management
	const [formState, setFormState] = useState({
		first_name: '',
		last_name: '',
		profile_image: '',
		bio: '',
		date_of_birth: '',
	});

	// Track initial form state to detect changes
	const [initialFormState, setInitialFormState] = useState(null);

	// State for handling image upload
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState('');

	// Initialize form with user data when available
	useEffect(() => {
		if (userDetails) {
			const { profile } = userDetails.user;
			const initialState = {
				first_name: profile?.first_name || '',
				last_name: profile?.last_name || '',
				profile_image: profile?.profile_image || '',
				bio: profile?.bio || '',
				date_of_birth: profile?.date_of_birth || '',
			};
			setFormState(initialState);
			setInitialFormState(initialState);
			setImagePreview(profile?.profile_image || '');
		}
	}, [userDetails]);

	/**
	 * Handle form input changes
	 * @param {Event} e - The change event
	 */
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormState((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	/**
	 * Handle profile image file selection
	 * @param {Event} e - The file input change event
	 */
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setImageFile(file);
			setImagePreview(imageUrl);
			setErrors((prevErrors) => ({ ...prevErrors, profile_image: [] }));
		}
	};

	/**
	 * Remove the selected profile image
	 */
	const handleRemoveImage = () => {
		setImageFile(null);
		setImagePreview('');
		setFormState((prevState) => ({
			...prevState,
			profile_image: '',
		}));
		setErrors((prevErrors) => ({ ...prevErrors, profile_image: [] }));
	};

	/**
	 * Handle form submission
	 * @param {Event} e - The submit event
	 */
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Check if form has any changes
		if (
			JSON.stringify(formState) === JSON.stringify(initialFormState) &&
			!imageFile
		) {
			showErrorAlert('No changes detected');
			return;
		}

		// Validate form
		const result = await validateProfileForm(formState, imageFile);

		if (result.errors) {
			setErrors(result.errors);
			return;
		}
		setErrors({});

		// Handle image removal
		if (formState.profile_image === '') {
			result.append('remove_image', 'true');
		}

		// Submit form data
		updateUserDetails(result, {
			onSuccess: () => {
				showSuccessAlert('Profile updated successfully');
			},
			onError: (error) => {
				console.log(error);

				showError(
					error?.response?.data?.detail ||
						'Something went wrong, try again later.'
				);
			},
		});
	};

	// Render loading state
	if (isLoading || isUpdating) {
		return (
			<div className='flex justify-center items-center h-full'>
				<LoadingRing />
			</div>
		);
	}

	// Render error state
	if (error) {
		return (
			<div className='text-center text-lg text-red-500 flex justify-center items-center h-full'>
				Error loading user details: {error.message}
			</div>
		);
	}

	// Render form
	return (
		<div className='bg-lightMode-section dark:bg-darkMode-section rounded-2xl p-5'>
			<h2 className='text-xl font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-4 text-center'>
				User Details
			</h2>
			<div className='w-full max-w-md mx-auto'>
				<form onSubmit={handleSubmit}>
					<div className='mb-4'>
						<label className='block text-gray-700 dark:text-gray-300'>
							First Name
						</label>
						<input
							type='text'
							name='first_name'
							value={formState.first_name}
							onChange={handleChange}
							className='w-full p-2 border border-gray-300 rounded-md'
						/>
						{errors.first_name && (
							<p className='text-red-500 text-sm'>
								{errors.first_name}
							</p>
						)}
					</div>
					<div className='mb-4'>
						<label className='block text-gray-700 dark:text-gray-300'>
							Last Name
						</label>
						<input
							type='text'
							name='last_name'
							value={formState.last_name}
							onChange={handleChange}
							className='w-full p-2 border border-gray-300 rounded-md'
						/>
						{errors.last_name && (
							<p className='text-red-500 text-sm'>
								{errors.last_name}
							</p>
						)}
					</div>
					<div className='mb-4'>
						<label className='block text-gray-700 dark:text-gray-300'>
							Profile Image
						</label>
						<div className='flex justify-center items-center'>
							{imagePreview && (
								<div className='relative w-32 h-32 mb-2'>
									<img
										src={imagePreview}
										alt='Profile'
										className='w-full h-full object-cover rounded-md'
									/>
									<button
										type='button'
										onClick={handleRemoveImage}
										className='absolute top-0 right-0 flex justify-center items-center size-6 bg-red-500 text-white px-2 py-1 text-sm rounded-full'>
										X
									</button>
								</div>
							)}
						</div>
						<input
							type='file'
							accept='image/*'
							onChange={handleImageChange}
							className='w-full p-2 border border-gray-300 rounded-md'
						/>
						{errors.profile_image && (
							<p className='text-red-500 text-sm'>
								{errors.profile_image.join('\n')}
							</p>
						)}
					</div>
					<div className='mb-4'>
						<label className='block text-gray-700 dark:text-gray-300'>
							Bio
						</label>
						<textarea
							name='bio'
							value={formState.bio}
							onChange={handleChange}
							className='w-full p-2 border border-gray-300 rounded-md'
						/>
						{errors.bio && (
							<p className='text-red-500 text-sm'>{errors.bio}</p>
						)}
					</div>
					<div className='mb-4'>
						<label className='block text-gray-700 dark:text-gray-300'>
							Date of Birth
						</label>
						<input
							type='date'
							name='date_of_birth'
							value={formState.date_of_birth}
							onChange={handleChange}
							className='w-full p-2 border border-gray-300 rounded-md'
						/>
						{errors.date_of_birth && (
							<p className='text-red-500 text-sm'>
								{errors.date_of_birth}
							</p>
						)}
					</div>
					<button
						type='submit'
						className='bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition'>
						Save
					</button>
				</form>
			</div>
		</div>
	);
};

export default UserDetailsEdit;
