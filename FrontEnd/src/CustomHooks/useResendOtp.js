import { useApi } from '../Contexts/ApiContext';
import { useMutation } from '@tanstack/react-query';

const resendOtp = async (api, email) => {
	try {
		const response = await api.post('resend-otp/', { email });
		return response.data;
	} catch (error) {
		throw error.response?.data || error;
	}
};

export const useResendOtp = () => {
	const api = useApi();
	return useMutation({
		mutationFn: (email) => resendOtp(api, email),
		onSuccess: () => {
			console.log('OTP resent successfully');
		},
		onError: (error) => {
			console.error('Error resending OTP:', error.detail || error);
		},
	});
};
