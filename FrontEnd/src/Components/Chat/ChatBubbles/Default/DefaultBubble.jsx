import React from 'react';

function DefaultBubble({ message }) {
	console.log(message);

	return (
		<div className='default-bubble' onClick={() => console.log(message)}>
			default message
		</div>
	);
}

export default DefaultBubble;
