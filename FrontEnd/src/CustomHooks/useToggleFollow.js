import { useMutation } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const toggleFollow = (api, user_id) => {
	return api.post('api/users/toggle-follow/', { user_id });
};

const useToggleFollow = () => {
	const api = useApi();
	return useMutation({
		mutationFn: (user_id) => toggleFollow(api, user_id),
	});
};

export default useToggleFollow;
