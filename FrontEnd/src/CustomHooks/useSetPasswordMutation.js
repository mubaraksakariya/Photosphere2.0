import { useApi } from '../Contexts/ApiContext';
import { useMutation } from '@tanstack/react-query';

const setPassword = async (passwordData, api) => {
	const { data } = await api.post('api/users/set-password/', passwordData);
	return data;
};

const useSetPasswordMutation = () => {
	const api = useApi();

	return useMutation({
		mutationFn: (passwordData) => setPassword(passwordData, api),
		onSuccess: (response) => {
			console.log('Password set successfully');
			console.log(response);
		},
	});
};

export default useSetPasswordMutation;
