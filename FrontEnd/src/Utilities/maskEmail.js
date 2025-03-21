const maskEmail = (email) => {
	if (!email) return '';
	const [localPart, domain] = email.split('@');
	const maskedLocalPart = localPart.slice(0, 2) + '**' + localPart.slice(-1);
	return `${maskedLocalPart}@${domain}`;
};

export default maskEmail;
