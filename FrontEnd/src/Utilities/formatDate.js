const formatDateIsoToLocal = (isoDate) => {
	const options = {
		month: 'short', // Short month name (e.g., "Jan")
		day: 'numeric', // Day of the month
		hour: 'numeric', // Hour
		minute: '2-digit', // Minute with leading zero
		year: 'numeric',
	};
	return new Date(isoDate).toLocaleString('en-US', options);
};

export { formatDateIsoToLocal };
