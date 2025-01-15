import { useQuery } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const isFollowing = async (api, user_id) => {
	const { data } = await api.get(`/users/${user_id}/check-follow/`);
	return data;
};

const useCheckFollow = (user_id) => {
	const api = useApi();

	return useQuery({
		queryKey: ['isFollowing', user_id],
		queryFn: () => isFollowing(api, user_id),
		enabled: !!user_id, // Only run the query if user_id is provided
	});
};

export default useCheckFollow;
