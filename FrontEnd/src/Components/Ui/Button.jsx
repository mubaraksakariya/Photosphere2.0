const Button = ({
	children,
	variant = 'default',
	className = '',
	...props
}) => {
	const baseStyles = 'px-4 py-2 rounded-lg font-medium transition shadow-md';
	const variants = {
		default:
			'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700',
		outline:
			'border border-lightMode-textPrimary dark:border-darkMode-textPrimary text-lightMode-textPrimary dark:text-darkMode-textPrimary hover:bg-lightMode-section dark:hover:bg-darkMode-section',
		destructive: 'bg-red-600 text-white hover:bg-red-700',
	};

	return (
		<button
			className={`${baseStyles} ${variants[variant] || ''} ${className}`}
			{...props}>
			{children}
		</button>
	);
};
export default Button;
