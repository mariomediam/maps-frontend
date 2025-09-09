import { create } from 'zustand';

const QUERIES = {
	md: '(min-width: 768px)',
	lg: '(min-width: 1024px)',
};

const useWindowStore = create((set) => ({
	isMobile: true,
	isTabletUp: false,
	isDesktopUp: false,



	setBreakpoints: values => set(values),
}));

export function initBreakpointListeners() {
	const { setBreakpoints } = useWindowStore.getState();

	const mqMD = window.matchMedia(QUERIES.md);
	const mqLG = window.matchMedia(QUERIES.lg);

	const onChange = () => {
		setBreakpoints({
			isMobile: !mqMD.matches,
			isTabletUp: mqMD.matches,
			isDesktopUp: mqLG.matches,
		});
	};

	onChange(); // Estado inicial
	mqMD.addEventListener('change', onChange);
	mqLG.addEventListener('change', onChange);

	// cleanup opcional si lo usas dentro de un hook
	return () => {
		mqMD.removeEventListener('change', onChange);
		mqLG.removeEventListener('change', onChange);
	};
}

export default useWindowStore;
