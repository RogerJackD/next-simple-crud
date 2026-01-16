// services/entidad-sistema.service.ts

import { EntidadSistema, CreateEntidadSistemaDto, UpdateEntidadSistemaDto } from "../types/entidad-sistema";

const API_URL = "http://localhost:3001/api/entidad-sistema";
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

export const EntidadSistemaService = {
  
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

  
  getById: async (id: number): Promise<EntidadSistema> => {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      if (response.status === 400) {
        const error = await response.json();
        throw new Error(error.message || "RUC no válido");
      }
      if (response.status === 404) {
        throw new Error("Entidad no encontrada");
      }
      throw new Error("Error al obtener entidad");
    }
    
    return response.json();
  },

  
  create: async (data: CreateEntidadSistemaDto): Promise<EntidadSistema> => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      if (response.status === 400) {
        const error = await response.json();
        throw new Error(error.message || "Datos inválidos");
      }
      throw new Error("Error al crear entidad");
    }
    
    return response.json();
  },

  
  
};