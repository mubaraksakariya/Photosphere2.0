export const validateProfileForm = async (formState, imageFile) => {
	const formData = new FormData();
	const errors = {};

	// Helper function to append non-empty values to FormData.
	const addToFormData = (key, value) => {
		if (value?.trim()) {
			formData.append(key, value);
		}
	};

	// Append form fields
	['first_name', 'last_name', 'bio'].forEach((field) =>
		addToFormData(field, formState[field])
	);

	// Validate date_of_birth
	if (formState.date_of_birth) {
		const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
		if (!dateRegex.test(formState.date_of_birth)) {
			errors.date_of_birth = 'Invalid date format. Use YYYY-MM-DD.';
		} else {
			const birthDate = new Date(formState.date_of_birth);
			const today = new Date();
			let age = today.getFullYear() - birthDate.getFullYear();
			const monthDiff = today.getMonth() - birthDate.getMonth();
			if (
				monthDiff < 0 ||
				(monthDiff === 0 && today.getDate() < birthDate.getDate())
			) {
				age--;
			}
			if (age < 18) {
				errors.date_of_birth = 'You must be at least 18 years old.';
			} else {
				formData.append('date_of_birth', formState.date_of_birth);
			}
		}
	}

	// Validate Image (if provided)
	if (imageFile) {
		const imageErrors = await validateImage(imageFile);
		if (imageErrors.length) {
			errors.profile_image = imageErrors;
		} else {
			formData.append('profile_image', imageFile);
		}
	}

	// Return FormData if no errors, otherwise return errors
	return Object.keys(errors).length === 0 ? formData : { errors };
};

// Separate function for image validation
const validateImage = async (imageFile) => {
	const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
	const maxSize = 10 * 1024 * 1024; // 10MB
	const maxWidth = 5000;
	const maxHeight = 5000;
	const errors = [];

	if (!validImageTypes.includes(imageFile.type)) {
		errors.push('Invalid format. Only JPEG, PNG, and WEBP are allowed.');
	}

	if (imageFile.size > maxSize) {
		errors.push('Image size exceeds 10MB. Try compressing it.');
	}

	// Check image dimensions
	await new Promise((resolve) => {
		const img = new Image();
		img.src = URL.createObjectURL(imageFile);
		img.onload = () => {
			if (img.width > maxWidth || img.height > maxHeight) {
				errors.push(
					`Image dimensions must be within ${maxWidth}x${maxHeight}px.`
				);
			}
			URL.revokeObjectURL(img.src);
			resolve();
		};
	});

	return errors;
};
