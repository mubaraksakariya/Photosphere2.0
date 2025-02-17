import { useQuery } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const fetchRecentNotifications = async (api) => {
	const { data } = await api.get('api/notifications/latest/');
	return data;
};

const useRecentNotifications = () => {
	const api = useApi();

	return useQuery({
		queryKey: ['recentNotifications'],
		queryFn: () => fetchRecentNotifications(api),
		staleTime: 60000, // Cache data for 1 minute
		refetchInterval: 30000, // Auto-refetch every 30 seconds
	});
};

export default useRecentNotifications;
