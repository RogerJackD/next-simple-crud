// services/entidad-sistema.service.ts

import { EntidadSistema } from "../types/entidad-sistema";

const API_URL = "http://localhost:3001/api/entidad-sistema";
const RUC_STORAGE_KEY = "current_ruc";

 //Obtiene el RUC desde localStorage

const getRucFromStorage = (): string => {
  const ruc = localStorage.getItem(RUC_STORAGE_KEY);
  if (!ruc) {
    throw new Error("No se encontró RUC. Por favor, inicie sesión nuevamente.");
  }
  return ruc;
};

 //Genera los headers necesarios para las peticiones, incluyendo el RUC
const getHeaders = (): HeadersInit => {
  const ruc = getRucFromStorage();
  return {
    "Content-Type": "application/json",
    "ruc": ruc,
  };
};

export const EntidadSistemaService = {
  /**
   * Obtiene todas las entidades del sistema con sus elementos
   */
  getAllWithElements: async (): Promise<EntidadSistema[]> => {
    const response = await fetch(`${API_URL}?elements=true`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      if (response.status === 400) {
        const error = await response.json();
        throw new Error(error.message || "RUC no válido");
      }
      throw new Error("Error al obtener entidades del sistema");
    }
    
    return response.json();
  },
};