import React from 'react';
import PropTypes from 'prop-types';

const ChatProfileThumpnail = ({
	imageUrl,
	userName = 'username',
	size = '40px',
	isOnline = false,
}) => {
	return (
		<div className='relative' style={{ width: size, height: size }}>
			<img
				src={imageUrl || 'default-avatar.png'}
				alt={`${userName}'s profile`}
				className='w-full h-full object-cover rounded-full'
			/>
			{isOnline && (
				<span className='absolute bottom-0.5 right-0.5 w-2 h-2 bg-green-500 rounded-full border-2 border-white'></span>
			)}
		</div>
	);
};

// ChatProfileThumpnail.propTypes = {
// 	imageUrl: PropTypes.string,
// 	userName: PropTypes.string.isRequired,
// 	size: PropTypes.string,
// 	isOnline: PropTypes.bool,
// };

export default ChatProfileThumpnail;
