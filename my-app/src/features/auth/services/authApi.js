import useAxios from '@utils/useAxios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const URL = `${API_BASE_URL}/api/token/`;
const TOKEN_KEY = 'mapsTokens';

const login = async (username, password) => {
	try {
		const api = useAxios();
		const response = await api.post(URL, { username, password });
		
		// Guardar tokens en localStorage
		const tokens = response.data;
		localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
		
		console.log('Login exitoso, tokens guardados');
		return tokens;
	} catch (error) {
		console.error('Error al iniciar sesión:', error);
		throw error;
	}
};

const logout = () => {
	localStorage.removeItem(TOKEN_KEY);
	console.log('Logout exitoso, tokens eliminados');
};

const getStoredTokens = () => {
	const storedTokens = localStorage.getItem(TOKEN_KEY);
	return storedTokens ? JSON.parse(storedTokens) : null;
};

const isAuthenticated = () => {
	const tokens = getStoredTokens();
	return !!tokens?.access;
};

export { login, logout, getStoredTokens, isAuthenticated };

// curl --location 'http://127.0.0.1:8000/api/token/' \
// --header 'Content-Type: application/json' \
// --data '{
//     "username": "mmedina",
//     "password": "asdada"
// }'

// Cuando login es correcto retorna:
// {
//     "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1ODExNzczNywiaWF0IjoxNzU4MDMxMzM3LCJqdGkiOiI5MmY5ZDA5MmYwMTA0OGI3YTk3OThjZGIwZGVhMDQ1NiIsInVzZXJfaWQiOiJtbWVkaW5hIn0.BEh48huTMGSbrwLRHNkWtzI6OmC3BpVxd1KhhLUvPD4",
//     "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU4MDc0NTM3LCJpYXQiOjE3NTgwMzEzMzcsImp0aSI6IjkxZTBlYTVlMzg5NDRhZjdiNzlhYzNkYTM2ZTEzMzIxIiwidXNlcl9pZCI6Im1tZWRpbmEifQ._VoeNIIZGXYTAcn2dsuPY5Silvoy8zpeyT3k57uuRG0"
// }

// Cuando login es incorrecto retorna:
// {
//     "detail": "No active account found with the given credentials"
// }
