import React from 'react';
import useInfiniteSearchUsers from '../../../CustomHooks/useSearchUsers';
import { useInView } from 'react-intersection-observer';
import UserToShare from './UserToShare';

function UsersList({ selectedUsers = [], toggleUserSelection, searchTerm }) {
	const {
		data,
		isLoading,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		error,
	} = useInfiniteSearchUsers(searchTerm);

	const { ref, inView } = useInView();

	React.useEffect(() => {
		if (inView && hasNextPage) {
			fetchNextPage();
		}
		if (error) console.error(error);
	}, [inView, error]);
	return (
		<div>
			<ul className='mt-2 max-h-40 overflow-y-auto'>
				{data?.pages?.map((page) =>
					page.results.map((user) => (
						<UserToShare
							key={user.id}
							user={user}
							toggleUserSelection={toggleUserSelection}
							selectedUsers={selectedUsers}
						/>
					))
				)}
				<div ref={ref} className='h-10'></div>
			</ul>
		</div>
	);
}

export default UsersList;
