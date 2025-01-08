import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useApi } from '../../Contexts/ApiContext';
import { useNavigate } from 'react-router';

export const useSignupLogic = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [first_name, setFirst_name] = useState('');
	const [last_name, setLastname] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [dob, setDob] = useState('');

	const api = useApi();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isUser = useSelector((state) => state.isUser);

	useEffect(() => {
		if (isUser) navigate('/');
	}, [isUser, navigate]);

	const handleGoogleSignup = (credentialResponse) => {
		const data = {
			credential: credentialResponse,
		};
		// Example API call for Google signup
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

	const handleSubmit = (e) => {
		e.preventDefault();
		setIsLoading(true);
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const phoneRegex = /^(\+91|0|91)?\d{10}$/;

		if (
			email === '' ||
			(!emailRegex.test(email) && !phoneRegex.test(email))
		) {
			console.log('Email/Phone error');
			alert('Email or Phone error');
			setIsLoading(false);
			return;
		}

		const data = {
			email,
			first_name,
			last_name,
			username,
			password,
			dob,
		};

		api.post('signup', data).then((response) => {
			if (response.data.result) {
				const data = {
					user: response.data.user,
				};
				navigate('/verify', { state: data });
			} else {
				setIsLoading(false);
				alert('Error signing up');
			}
		});
	};

	return {
		isLoading,
		email,
		first_name,
		last_name,
		username,
		password,
		dob,
		setEmail,
		setFirst_name,
		setLastname,
		setUsername,
		setPassword,
		setDob,
		handleGoogleSignup,
		handleSubmit,
	};
};
