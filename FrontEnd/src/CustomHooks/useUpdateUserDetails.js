import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const updateUserDetails = async (api, userId, formData) => {
	const response = await api.put(`/api/profiles/${userId}/`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	return response.data;
};

const useUpdateUserDetails = (userId) => {
	const api = useApi();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (formData) => updateUserDetails(api, userId, formData),
		onSuccess: () => {
			queryClient.invalidateQueries(['userDetails', userId]);
		},
	});
};

export default useUpdateUserDetails;
