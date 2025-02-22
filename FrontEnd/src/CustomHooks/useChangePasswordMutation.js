import { useApi } from '../Contexts/ApiContext';
import { useMutation } from '@tanstack/react-query';

const changePassword = async (passwordData, api) => {
	const { data } = await api.post('api/users/change-password/', passwordData);
	return data;
};

const useChangePasswordMutation = () => {
	const api = useApi();

	return useMutation({
		mutationFn: (passwordData) => changePassword(passwordData, api),
		onError: (error, variables, context) => {
			if (error.response?.data) {
				// Send errors to the component
				return error.response.data;
			}
			return { general: 'Something went wrong. Please try again.' };
		},
	});
};

export default useChangePasswordMutation;
