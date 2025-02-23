const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+91|0|91)?\d{10}$/;

function validateEmailOrPhone(input) {
	if (!input) {
		return 'Email or phone number is required.';
	}
	if (!emailRegex.test(input) && !phoneRegex.test(input)) {
		return 'Please enter a valid email or phone number.';
	}
	return null; // No error
}

function calculateAge(dob) {
	const birthDate = new Date(dob);
	const today = new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDifference = today.getMonth() - birthDate.getMonth();

	if (
		monthDifference < 0 ||
		(monthDifference === 0 && today.getDate() < birthDate.getDate())
	) {
		age--;
	}

	return age;
}

function validateSignupData(data) {
	const {
		email,
		first_name,
		last_name,
		username,
		password,
		repassword,
		date_of_birth,
	} = data;
	const errors = {};

	// Validate email or phone
	const emailError = validateEmailOrPhone(email);
	if (emailError) errors.email = emailError;

	// Validate required fields
	if (!first_name) errors.first_name = 'First name is required.';
	if (!last_name) errors.last_name = 'Last name is required.';
	if (!username) errors.username = 'Username is required.';
	if (!password) errors.password = 'Password is required.';
	if (password !== repassword) {
		errors.password = 'Passwords do not match.';
	}
	if (!date_of_birth) {
		errors.dob = 'Date of birth is required.';
	} else if (calculateAge(date_of_birth) < 18) {
		errors.dob = 'You must be at least 18 years old to sign up.';
	}

	return errors; // Return errors object
}

export { validateSignupData };
