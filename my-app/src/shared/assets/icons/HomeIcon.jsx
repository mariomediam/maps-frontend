const HomeIcon = ({
	className = '',
	width = 24,
	height = 24,
	fill = 'currentColor',
	...props
}) => {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 24 24"
			fill="none"
			className={className}
			{...props}
		>
			<title>Icono de casa</title>
			<path
				d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
				stroke={fill}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<polyline
				points="9,22 9,12 15,12 15,22"
				stroke={fill}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default HomeIcon;
