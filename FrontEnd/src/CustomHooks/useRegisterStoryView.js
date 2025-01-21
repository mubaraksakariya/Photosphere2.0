import { useMutation } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const registerView = (api, { story_id }) => {
	return api.post(`api/stories/${story_id}/register_view/`);
};

const useRegisterStoryView = () => {
	const api = useApi();
	return useMutation({
		mutationFn: ({ story_id }) => registerView(api, { story_id }),
	});
};

export default useRegisterStoryView;
