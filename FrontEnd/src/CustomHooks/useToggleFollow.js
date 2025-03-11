import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const toggleFollow = (api, user_id) => {
	return api.post('api/users/toggle-follow/', { user_id });
};

const useToggleFollow = () => {
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (user_id) => toggleFollow(api, user_id),
		onSuccess: () => {
			queryClient.invalidateQueries(['followers']);
		},
	});
};

export default useToggleFollow;
