import { CreateElementoEntidadDto } from "../types/elemento-entidad";
import { ElementoEntidad } from "../types/entidad-sistema";

const API_URL = "http://localhost:3001/api/elemento-entidad";
const RUC_STORAGE_KEY = "current_ruc";


const getRucFromStorage = (): string => {
  const ruc = localStorage.getItem(RUC_STORAGE_KEY);
  if (!ruc) {
    throw new Error("No se encontró RUC. Por favor, inicie sesión nuevamente.");
  }
  return ruc;
};


const getHeaders = (): HeadersInit => {
  const ruc = getRucFromStorage();
  return {
    "Content-Type": "application/json",
    "ruc": ruc,
  };
};

export const ElementoEntidadService = {

  getAllWithRelations: async (): Promise<ElementoEntidad[]> => {
    const response = await fetch(`${API_URL}?relations=true`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      if (response.status === 400) {
        const error = await response.json();
        throw new Error(error.message || "RUC no válido");
      }
      throw new Error("Error al obtener elementos de entidad");
    }
    
    return response.json();
  },
  getById: async (id: number): Promise<ElementoEntidad> => {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      if (response.status === 400) {
        const error = await response.json();
        throw new Error(error.message || "RUC no válido");
      }
      if (response.status === 404) {
        throw new Error("Elemento no encontrado");
      }
      throw new Error("Error al obtener elemento");
    }
    
    return response.json();
  },
  
};