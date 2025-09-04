/**
 * Tipos de acciones para el mapa
 */
export const MAP_ACTION_TYPES = {
	adding: "adding",
	seeing: "seeing",
	listing: "listing",
};

/**
 * Estados del mapa
 */
export const MAP_STATES = {
	idle: "idle",
	loading: "loading",
	error: "error",
};

/**
 * Configuración por defecto del mapa
 */
export const MAP_CONFIG = {
	defaultCenter: [-5.1955724, -80.6301423],
	defaultZoom: 13,
	maxZoom: 18,
	minZoom: 3,
};

export default {
	MAP_ACTION_TYPES,
	MAP_STATES,
	MAP_CONFIG,
};
