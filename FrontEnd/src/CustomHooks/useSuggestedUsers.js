import { useQuery } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const GetSuggestedUsers = async (api) => {
	const response = await api.get('api/users/suggested_users');
	return response.data;
};

const useSuggestedUsers = () => {
	const api = useApi();
	return useQuery({
		queryKey: ['suggestedUsers'],
		queryFn: () => GetSuggestedUsers(api),
	});
};

export default useSuggestedUsers;
