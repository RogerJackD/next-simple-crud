import { ParametroSistema, CreateParametroSistemaDto, UpdateParametroSistemaDto } from "../types/parametro-sistema";

const API_URL = "http://localhost:3001/api/parametros-sistema";
const RUC_STORAGE_KEY = "current_ruc";

/**
 * Obtiene el RUC desde localStorage
 * @throws Error si no hay RUC en localStorage
 */
const getRucFromStorage = (): string => {
  const ruc = localStorage.getItem(RUC_STORAGE_KEY);
  if (!ruc) {
    throw new Error("No se encontró RUC. Por favor, inicie sesión nuevamente.");
  }
  return ruc;
};

/**
 * Genera los headers necesarios para las peticiones, incluyendo el RUC
 */
const getHeaders = (): HeadersInit => {
  const ruc = getRucFromStorage();
  return {
    "Content-Type": "application/json",
    "X-Tenant-Id": ruc,
  };
};

export const ParametroSistemaService = {
  getAll: async (): Promise<ParametroSistema[]> => {
    const response = await fetch(API_URL, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      if (response.status === 400) {
        const error = await response.json();
        throw new Error(error.message || "RUC no válido");
      }
      throw new Error("Error al obtener parámetros");
    }
    
    return response.json();
  },

  getById: async (id: number): Promise<ParametroSistema> => {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      if (response.status === 400) {
        const error = await response.json();
        throw new Error(error.message || "RUC no válido");
      }
      throw new Error("Error al obtener parámetro");
    }
    
    return response.json();
  },

  
};