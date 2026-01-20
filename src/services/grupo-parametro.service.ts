import { GrupoParametro } from "../types/grupo-parametro";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const RUC_STORAGE_KEY = 'current_ruc';

class GrupoParametroService {
  private getHeaders(): HeadersInit {
    const ruc = localStorage.getItem(RUC_STORAGE_KEY);
    return {
      'Content-Type': 'application/json',
      'ruc': ruc || '',
    };
  }

  async getAll(): Promise<GrupoParametro[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/grupo-parametro`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error al obtener grupos de parámetros: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en getAll:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<GrupoParametro> {
    try {
      const response = await fetch(`${API_BASE_URL}/grupo-parametro/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error al obtener grupo de parámetro: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en getById:', error);
      throw error;
    }
  }

  async create(data: { nombreGrupoParametro: string; usuarioRegistro: string }): Promise<GrupoParametro> {
    try {
      const response = await fetch(`${API_BASE_URL}/grupo-parametro`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error al crear grupo de parámetro: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  async update(id: number, data: { nombreGrupoParametro: string; usuarioModificacion: string }): Promise<GrupoParametro> {
    try {
      const response = await fetch(`${API_BASE_URL}/grupo-parametro/${id}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar grupo de parámetro: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error en update:', error);
      throw error;
    }
  }

  async toggleEstado(id: number, data: { indicadorEstado: string; usuarioModificacion: string }): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/grupo-parametro/${id}/toggle-estado`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error al cambiar estado: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error en toggleEstado:', error);
      throw error;
    }
  }
}

export const grupoParametroService = new GrupoParametroService();