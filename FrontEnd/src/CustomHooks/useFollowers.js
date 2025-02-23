import { useQuery } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const fetchFollowers = async (api, userId) => {
	const response = await api.get(`/api/users/${userId}/followers`);
	return response.data;
};

const useFollowers = (userId) => {
	const api = useApi();
	return useQuery({
		queryKey: ['followers', userId],
		queryFn: () => fetchFollowers(api, userId),
	});
};

export default useFollowers;
