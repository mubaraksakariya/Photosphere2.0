import { useApi } from '../Contexts/ApiContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const markNotificationsRead = async (api) => {
	const { data } = await api.post('api/notifications/mark-as-read/');
	return data;
};

export const useMarkNotificationsAsRead = () => {
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => markNotificationsRead(api),
		onSuccess: () => {
			console.log('Notifications marked as read');
			// Invalidate the notifications query to refetch fresh data
			queryClient.invalidateQueries(['notifications']);
		},
		onError: (error) => {
			console.error(
				'Error marking notifications as read:',
				error.response?.data?.detail || error
			);
		},
	});
};
