import { useMutation } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';
import { useDispatch } from 'react-redux';
import { login } from '../Store/Slices/AuthSlice';

const googleLogin = async (api, credential) => {
	// console.log(credential);

	return await api.post('api/google-signin/', credential);
};

const useGoogleLogin = () => {
	const api = useApi();
	const dispatch = useDispatch();
	return useMutation({
		mutationFn: (credential) => googleLogin(api, credential),
		onSuccess: (response) => {
			// console.log(response.data);
			// console.log('User signed in successfully:', response.data);
			const { refresh, access, user } = response.data;
			dispatch(login({ user, token: { refresh, access } }));
		},
		onError: (error) => {
			console.log(error);

			console.error(
				'Sign-in failed:',
				error.response?.data?.detail || 'An error occurred'
			);
		},
	});
};

export default useGoogleLogin;
