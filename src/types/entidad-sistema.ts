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
}