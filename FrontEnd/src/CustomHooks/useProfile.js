import { useQuery } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const getProfile = async (api, user_id) => {
	const response = await api.get(`api/users/${user_id}/user-profile`);
	return response.data;
};

const useProfile = (user_id) => {
	const api = useApi();
	return useQuery({
		queryFn: () => getProfile(api, user_id),
		queryKey: ['profile', user_id],
		enabled: !!user_id, // Ensure the query runs only if user_id is defined
	});
};

export default useProfile;
