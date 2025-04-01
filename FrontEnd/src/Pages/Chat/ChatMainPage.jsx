import React, { useState } from 'react';
import MobileScreen from './MobileScreen';
import OtherScreen from './OtherScreen';
import WebSocketStatus from '../../Components/WebSocket/WebSocketStatus';

function ChatMainPage() {
	return (
		<>
			<div className='md:hidden'>
				<MobileScreen />
			</div>
			<div className='hidden md:block'>
				<OtherScreen />
			</div>
			<WebSocketStatus />
		</>
	);
}

export default ChatMainPage;
