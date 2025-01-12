import { useMutation } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';
import { useDispatch } from 'react-redux';
import { login } from '../Store/Slices/AuthSlice';

const signinUser = (data, api) => {
	return api.post('signin/', data);
};

const useSignin = () => {
	const api = useApi();
	const dispatch = useDispatch();

	return useMutation({
		mutationFn: (data) => signinUser(data, api),
		onSuccess: (response) => {
			console.log('User signed in successfully');
			const { refresh, access, user } = response.data;
			dispatch(login({ user, token: { refresh, access } }));
		},
		// onError: (error) => {
		// 	console.error(
		// 		'Error signing in:',
		// 		error.response?.data?.detail || error
		// 	);
		// },
	});
};

export default useSignin;
