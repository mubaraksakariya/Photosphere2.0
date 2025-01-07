import { GoogleLogin } from '@react-oauth/google';
import React from 'react';

const GoogleSignin = () => {
	const handleSuccess = (credentialResponse) => {
		console.log('Login Success', credentialResponse);
	};

	const handleError = () => {
		console.log('Login Failed');
	};

	return <GoogleLogin onSuccess={handleSuccess} onError={handleError} />;
};

export default GoogleSignin;
