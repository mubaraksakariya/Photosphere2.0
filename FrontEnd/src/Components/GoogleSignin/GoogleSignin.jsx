import { GoogleLogin } from '@react-oauth/google';
import React from 'react';
import useGoogleLogin from '../../CustomHooks/usGoogleLogin';

const GoogleSignin = () => {
	const { mutate: signInWithGoogle, isLoading, error } = useGoogleLogin();

	const handleSuccess = (credentialResponse) => {
		const token = credentialResponse.credential;
		signInWithGoogle({
			token,
			onerror: (error) => {
				console.log(error);
			},
		});
	};
	const handleError = (error) => {
		console.log('Login Failed', error);
	};
	return <GoogleLogin onSuccess={handleSuccess} onError={handleError} />;
};

export default GoogleSignin;
