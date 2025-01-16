import { useApi } from '../Contexts/ApiContext';
import { useMutation } from '@tanstack/react-query';

const signupUser = async (userData, api) => {
	const { data } = await api.post('api/signup/', userData);
	return data;
};

export const useSignupMutation = () => {
	const api = useApi();

	return useMutation({
		mutationFn: (userData) => signupUser(userData, api),
		onSuccess: (response) => {
			console.log('User signed up successfully');
			console.log(response);
		},
		// onError: (error) => {
		// 	console.error(
		// 		'Error signing up:',
		// 		error.response?.data?.detail || error
		// 	);
		// },
	});
};
