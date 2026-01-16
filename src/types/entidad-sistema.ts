
export interface EntidadSistema {
  idEntidadSistema: number;
  nombreEntidadSistema: string;
  indicadorEstado: string;
  idModuloSistema: number;
  usuarioRegistro: string;
  fechaRegistro: string;
  usuarioModificacion: string | null;
  fechaModificacion: string | null;
  ultimaFechaDescarga: string | null;
  ultimaFechaSubida: string | null;
  numeroRegistrosPendientesIteracion: number;
  numeroRegistrosPendientesSincronizacion: number;
  modoSincronizacion: string;
  numeroFilasPorPagina: number;
  estadoImportacion: string;
  nombrePlantillaImportacion: string;
  elementos: ElementoEntidad[];
}


export interface ElementoEntidad {
  id: number;
  idEntidad: number;
  nombreElemento: string;
  visible: string;
  editable: string;
  indicadorEstado: string;
  usuarioRegistro: string;
  fechaRegistro: string;
  usuarioModificacion: string | null;
  fechaModificacion: string | null;
  entidad: EntidadSistema;
}


export interface CreateEntidadSistemaDto {
  nombreEntidadSistema: string;
  idModuloSistema: number;
  usuarioRegistro: string;
  numeroRegistrosPendientesIteracion?: number;
  numeroRegistrosPendientesSincronizacion?: number;
  modoSincronizacion?: '0' | '1' | '2' | '3';
  numeroFilasPorPagina?: number;
  estadoImportacion?: string;
  nombrePlantillaImportacion?: string;
}


export interface UpdateEntidadSistemaDto {
  nombreEntidadSistema?: string;
  indicadorEstado?: 'A' | 'E';
  idModuloSistema?: number;
  numeroRegistrosPendientesIteracion?: number;
  numeroRegistrosPendientesSincronizacion?: number;
  modoSincronizacion?: '0' | '1' | '2' | '3';
  numeroFilasPorPagina?: number;
  estadoImportacion?: string;
  nombrePlantillaImportacion?: string;
  usuarioModificacion: string;
}