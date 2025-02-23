import { useQuery } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const fetchFollowings = async (api, userId) => {
	const response = await api.get(`/api/users/${userId}/followings`);
	return response.data;
};

const useFollowings = (userId) => {
	const api = useApi();
	return useQuery({
		queryKey: ['followings', userId],
		queryFn: () => fetchFollowings(api, userId),
	});
};
export default useFollowings;
