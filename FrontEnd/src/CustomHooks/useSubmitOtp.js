import { useApi } from '../Contexts/ApiContext';
import { useMutation } from '@tanstack/react-query';

const submitOtp = async (api, data) => {
	try {
		const response = await api.post('verify/', data);
		return response.data;
	} catch (error) {
		throw error.response?.data || error;
	}
};

export const useSubmitOtp = () => {
	const api = useApi();
	return useMutation({
		mutationFn: (data) => submitOtp(api, data),
		onSuccess: () => {
			console.log('OTP verified successfully');
		},
		onError: (error) => {
			console.error('Error verifying OTP:', error.detail || error);
		},
	});
};
