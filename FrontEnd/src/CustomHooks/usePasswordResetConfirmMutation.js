import { useApi } from '../Contexts/ApiContext';
import { useMutation } from '@tanstack/react-query';

const submitPasswordReset = async (resetData, api) => {
	const { data } = await api.post('api/password-reset-confirm/', resetData);
	return data;
};

const usePasswordResetConfirmMutation = () => {
	const api = useApi();

	return useMutation({
		mutationFn: (resetData) => submitPasswordReset(resetData, api),
	});
};

export default usePasswordResetConfirmMutation;
