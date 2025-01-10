import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useApi } from '../../Contexts/ApiContext';
import { useNavigate } from 'react-router';
import { useSignupMutation } from '../../CustomHooks/useSignupMutation';
import { validateSignupData } from './Validators';

export const useSignupLogic = () => {
	// Input states
	const [email, setEmail] = useState('');
	const [first_name, setFirst_name] = useState('');
	const [last_name, setLastname] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [repassword, setRepassword] = useState('');
	const [dob, setDob] = useState('');

	// Error states
	const [errors, setErrors] = useState({
		email: '',
		first_name: '',
		last_name: '',
		username: '',
		password: '',
		repassword: '',
		dob: '',
	});

	// Other states
	const [isLoading, setIsLoading] = useState(false);

	// Hooks
	const api = useApi();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isUser = useSelector((state) => state.isUser);
	const {
		mutate: signup,
		isLoading: isMutating,
		isSuccess,
		isError,
	} = useSignupMutation();

	const handleGoogleSignup = (credentialResponse) => {
		const data = {
			credential: credentialResponse,
		};
		api.post('googleSignup', data).then((response) => {
			let token = response.data.token;
			if (response.data.result) {
				dispatch(auth.login([token, 'user']));
				navigate('/');
			} else {
				console.log('Error logging in');
			}
		});
	};

	const manageOnChange = (name, value) => {
		setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // Reset error for the field
		switch (name) {
			case 'email':
				setEmail(value);
				break;
			case 'first_name':
				setFirst_name(value);
				break;
			case 'last_name':
				setLastname(value);
				break;
			case 'username':
				setUsername(value);
				break;
			case 'password':
				setPassword(value);
				break;
			case 'repassword':
				setRepassword(value);
				break;
			case 'dob':
				setDob(value);
				break;
			default:
				break;
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const data = {
			email,
			first_name,
			last_name,
			username,
			password,
			repassword,
			date_of_birth: dob,
		};

		const validationErrors = validateSignupData(data);

		// Set client-side validation errors
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			console.log('Validation Errors:', validationErrors);
			return;
		}

		setIsLoading(true);

		signup(data, {
			onSuccess: () => {
				alert('Signup successful!');
				setIsLoading(false);
				navigate('/verify', { state: { email } });
			},
			onError: (error) => {
				setIsLoading(false);

				console.log(error.response?.data?.errors);

				const apiErrors = error.response?.data?.errors || {};
				const newErrors = { ...apiErrors };

				// Handle API errors
				if (apiErrors.email)
					newErrors.email = apiErrors.email.join(', ');
				if (apiErrors.username)
					newErrors.username = apiErrors.username.join(', ');
				if (apiErrors.password)
					newErrors.password = apiErrors.password.join(', ');
				if (apiErrors.date_of_birth)
					newErrors.dob = apiErrors.date_of_birth.join(', ');

				setErrors(newErrors); // Set error messages from the backend
				// console.log(apiErrors);
			},
			onSettled: () => {
				setIsLoading(false);
			},
		});
	};

	return {
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
	};
};
