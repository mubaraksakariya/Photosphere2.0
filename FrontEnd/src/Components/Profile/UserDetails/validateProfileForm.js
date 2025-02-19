export const validateProfileForm = (formState, imageFile) => {
	const formData = new FormData();
	const errors = {};

	// Helper function to append non-empty values
	const addToFormData = (key, value) => {
		if (value && value.trim() !== '') {
			formData.append(key, value);
		}
	};

	addToFormData('first_name', formState.first_name);
	addToFormData('last_name', formState.last_name);
	addToFormData('bio', formState.bio);

	// Validate date_of_birth (YYYY-MM-DD format)
	if (formState.date_of_birth) {
		const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
		if (!dateRegex.test(formState.date_of_birth)) {
			errors.date_of_birth = 'Invalid date format. Use YYYY-MM-DD.';
		} else {
			formData.append('date_of_birth', formState.date_of_birth);
		}
	}

	// Validate image file (MIME type & size limit)
	if (imageFile) {
		const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
		const maxSize = 2 * 1024 * 1024; // 2MB

		if (!validImageTypes.includes(imageFile.type)) {
			errors.profile_image =
				'Invalid image format. Only JPEG, PNG, and WEBP allowed.';
		}

		if (imageFile.size > maxSize) {
			errors.profile_image = 'Image size exceeds 2MB.';
		}

		if (!errors.profile_image) {
			formData.append('profile_image', imageFile);
		}
	}

	// Return FormData if no errors, else return errors
	return Object.keys(errors).length === 0 ? formData : { errors };
};
