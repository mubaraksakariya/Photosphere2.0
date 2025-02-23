import { formatDateIsoToLocal } from '../../../Utilities/formatDate';

const RecentComments = ({ comments }) => {
	// console.log(comments);

	return (
		<div className='p-4'>
			<h3 className='font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-3'>
				Recent Comments
			</h3>
			<ul className='space-y-4'>
				{comments.map((comment, index) => (
					<li
						key={index}
						className='p-3 bg-lightMode-section dark:bg-darkMode-section rounded-md shadow-light dark:shadow-dark'>
						<p className='text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
							{comment?.text}
						</p>
						<small className='text-sm text-lightMode-accent dark:text-darkMode-accent'>
							{comment?.user?.username} •{' '}
							{formatDateIsoToLocal(comment?.created_at)}
						</small>
					</li>
				))}
			</ul>
		</div>
	);
};

export default RecentComments;
