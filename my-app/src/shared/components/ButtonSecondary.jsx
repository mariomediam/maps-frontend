import React from 'react';

const ButtonSecondary = ({
	texto,
	onClick,
	disabled = false,
	type = 'button',
	className = '',
	...props
}) => {
	const baseClasses = [
		'border',
		'focus:outline-none',
		'text-center',
		'cursor-pointer',
		'transition-colors',
		'duration-200',
		'ease-in-out',
		'disabled:opacity-50',
		'disabled:cursor-not-allowed',
		className,
	]
		.filter(Boolean)
		.join(' ');

	return (
		<button
			type={type}
			className={baseClasses}
			onClick={onClick}
			disabled={disabled}
			{...props}
		>
			{texto}
		</button>
	);
};

export default ButtonSecondary;
