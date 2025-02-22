import { useApi } from '../Contexts/ApiContext';
import { useMutation } from '@tanstack/react-query';

const requestPasswordReset = async (emailData, api) => {
	const { data } = await api.post('api/password-reset/', emailData);
	return data;
};

const usePasswordResetMutation = () => {
	const api = useApi();

	return useMutation({
		mutationFn: (emailData) => requestPasswordReset(emailData, api),
		onError: (error) => {
			if (error.response?.data) {
				return error.response.data; // Return API errors
			}
			return { general: 'Something went wrong. Please try again.' };
		},
	});
};

export default usePasswordResetMutation;
