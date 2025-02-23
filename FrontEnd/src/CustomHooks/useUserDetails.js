import { useQuery } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const fetchUserDetails = async (api, userId) => {
	const response = await api.get(`/api/users/${userId}/user-profile`);
	return response.data;
};

const useUserDetails = (userId) => {
	const api = useApi();
	return useQuery({
		queryKey: ['userDetails', userId],
		queryFn: () => fetchUserDetails(api, userId),
	});
};

export default useUserDetails;
